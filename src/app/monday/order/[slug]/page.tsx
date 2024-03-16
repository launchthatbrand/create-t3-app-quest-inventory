import { DefaultForm } from "~/app/_components/DefaultForm";
import { getFormData } from "./actions";

export default async function Page({ params }: { params: { slug: string } }) {
  const id = parseInt(params.slug, 10);
  const result = await getFormData(id);
  console.log("data", result?.data);

  return (
    <div className="container flex w-96 flex-col rounded-md bg-slate-200 p-5 text-black shadow-md">
      My Order: {params.slug}
      <DefaultForm data={result?.data} type="in" />
    </div>
  );
}
