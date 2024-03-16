import React from "react";
import { DefaultForm } from "~/app/_components/DefaultForm";

type Props = {};

function MondayForm({}: Props) {
  return (
    <div className="container flex w-96 flex-col rounded-md bg-slate-200 p-5 text-black shadow-md">
      MondayForm
      <DefaultForm />
    </div>
  );
}

export default MondayForm;
