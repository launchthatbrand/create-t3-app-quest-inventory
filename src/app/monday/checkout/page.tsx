import React from "react";
import { DefaultForm } from "~/app/_components/DefaultForm";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

function CheckoutPage({}: Props) {
  return (
    <div className="container flex flex-col items-center justify-center rounded-md p-3 text-black">
      <DefaultForm type="out" />
    </div>
  );
}

export default CheckoutPage;
