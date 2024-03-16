import React from "react";
import { DefaultForm } from "~/app/_components/DefaultForm";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

function CheckoutPage({}: Props) {
  return (
    <div className="container flex w-96 flex-col rounded-md bg-slate-200 p-5 text-black shadow-md">
      MondayForm
      <DefaultForm type="out" />
    </div>
  );
}

export default CheckoutPage;
