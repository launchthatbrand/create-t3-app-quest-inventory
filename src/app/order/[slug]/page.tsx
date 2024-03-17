/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DefaultForm } from "~/app/_components/DefaultForm";
import { getFormData } from "./actions";

export default async function Page({ params }: { params: { slug: string } }) {
  const id = parseInt(params.slug, 10);
  const result = await getFormData(id);
  console.log("data", result);

  return (
    <div className="container flex flex-col items-center text-black">
      <DefaultForm data={result?.data} type="in" />
    </div>
  );
}
