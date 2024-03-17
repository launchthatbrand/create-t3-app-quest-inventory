import React from "react";
import { DefaultForm } from "~/app/_components/DefaultForm";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

function CheckoutPage({}: Props) {
  return (
    <div className="container flex w-2/5 flex-col items-center justify-center rounded-md bg-white p-3 text-black">
      <DefaultForm type="out" />
    </div>
  );
}

export default CheckoutPage;
