import { checkinOrder, updateSubitem } from "~/app/monday/actions";

import { NextResponse } from "next/server";
import { api } from "~/trpc/server";

type OrderItem = {
  itemId: string; // existing Monday subitem id
  id: string; // inventory item SKU id
  name: string;
  quantity: { checkout: number; checkin: number };
  error?: string;
};

type CheckinPayload = {
  items: OrderItem[];
};

function isCheckinPayload(value: unknown): value is CheckinPayload {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as { items?: unknown };
  return Array.isArray(obj.items);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const orderId = Number(params.id);
  if (!Number.isFinite(orderId)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  try {
    const raw = await req.text();
    const parsed: unknown = JSON.parse(raw);
    if (!isCheckinPayload(parsed)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Mark order item status to checkin in Monday
    const record = await api.formResponse.getFormResponseById.query({
      id: orderId,
    });
    if (record?.mondayItemId) {
      await checkinOrder(record.mondayItemId);
    }

    // Mark processing start for checkin
    await api.formResponse.updateWithMondayData.mutate({
      id: orderId,
      processingStatus: "checkin-processing",
    });

    for (let i = 0; i < parsed.items.length; i++) {
      const item = parsed.items[i]!;
      try {
        // Update subitem checkin quantity and inventory math
        await updateSubitem(item);

        await api.formResponse.updateWithMondayData.mutate({
          id: orderId,
          processingMeta: JSON.stringify({
            checkinProgress: { index: i + 1, total: parsed.items.length },
          }),
        });
      } catch (err) {
        await api.formResponse.updateWithMondayData.mutate({
          id: orderId,
          processingMeta: JSON.stringify({
            checkinErrorItem: item.itemId,
            error:
              err instanceof Error
                ? err.message
                : String(err ?? "unknown error"),
          }),
        });
      }
    }

    await api.formResponse.updateWithMondayData.mutate({
      id: orderId,
      processingStatus: "checkin-completed",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    await api.formResponse.updateWithMondayData.mutate({
      id: Number(params.id),
      processingStatus: "checkin-failed",
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
