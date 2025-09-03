import { NextResponse } from "next/server";
import { api } from "~/trpc/server";
import { createSubitem } from "~/app/monday/actions";

type OrderItem = {
  id: string;
  name: string;
  quantity: { checkout: number; checkin?: number };
  itemId?: string | null;
  error?: string;
};

type OrderPayload = {
  items: OrderItem[];
  MondayItemId?: string;
  [key: string]: unknown;
};

function isOrderPayload(value: unknown): value is OrderPayload {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as { items?: unknown };
  return Array.isArray(obj.items);
}

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const orderId = Number(params.id);
  if (!Number.isFinite(orderId)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  try {
    console.log("sync-items:start", JSON.stringify({ orderId }));
    const record = await api.formResponse.getFormResponseById.query({
      id: orderId,
    });

    if (!record) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const mondayItemId = record.mondayItemId;
    if (!mondayItemId) {
      return NextResponse.json(
        { error: "mondayItemId missing on formResponses row" },
        { status: 400 },
      );
    }

    const raw =
      typeof record.data === "string"
        ? record.data
        : JSON.stringify(record.data);
    const parsed: unknown = JSON.parse(raw);
    if (!isOrderPayload(parsed)) {
      return NextResponse.json(
        { error: "Form data missing items" },
        { status: 400 },
      );
    }

    // Preserve all original fields (event, location, etc.) and only mutate items & MondayItemId
    const formData: OrderPayload = {
      ...(parsed as Record<string, unknown>),
    } as OrderPayload;
    if (!Array.isArray(formData.items)) {
      return NextResponse.json(
        { error: "Form data items is not an array" },
        { status: 400 },
      );
    }
    formData.MondayItemId = formData.MondayItemId ?? mondayItemId;

    // Mark processing start
    await api.formResponse.updateWithMondayData.mutate({
      id: orderId,
      processingStatus: "processing",
      processingMeta: JSON.stringify({ startedAt: new Date().toISOString() }),
    });

    for (let i = 0; i < formData.items.length; i++) {
      const item: OrderItem = formData.items[i]!;
      try {
        console.log(
          "sync-items:item:start",
          JSON.stringify({ orderId, sku: item.id, index: i }),
        );
        // Skip if already processed
        if (item.itemId) continue;

        const itemId = await createSubitem(item, mondayItemId);
        formData.items[i] = {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          itemId,
        };

        // Persist incrementally after each successful item
        await api.formResponse.updateWithMondayData.mutate({
          id: orderId,
          data: JSON.stringify(formData),
          processingMeta: JSON.stringify({
            lastUpdatedItem: item.id,
            progress: { index: i + 1, total: formData.items.length },
          }),
        });
        console.log(
          "sync-items:item:ok",
          JSON.stringify({ orderId, sku: item.id, index: i }),
        );
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : String(err ?? "unknown error");
        formData.items[i] = {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          itemId: null,
          error: errorMsg,
        };
        await api.formResponse.updateWithMondayData.mutate({
          id: orderId,
          data: JSON.stringify(formData),
          processingMeta: JSON.stringify({
            lastErrorItem: item.id,
            error: errorMsg,
          }),
        });
        console.error(
          "sync-items:item:error",
          JSON.stringify({ orderId, sku: item.id, index: i, error: errorMsg }),
        );
      }
    }

    // Mark processing complete
    await api.formResponse.updateWithMondayData.mutate({
      id: orderId,
      processingStatus: "completed",
      processingMeta: JSON.stringify({ finishedAt: new Date().toISOString() }),
    });
    console.log("sync-items:done", JSON.stringify({ orderId }));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "sync-items:fatal",
      JSON.stringify({
        orderId: Number(params.id),
        error:
          error instanceof Error
            ? error.message
            : String(error ?? "unknown error"),
      }),
    );
    // Mark failed
    await api.formResponse.updateWithMondayData.mutate({
      id: Number(params.id),
      processingStatus: "failed",
      processingMeta: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
