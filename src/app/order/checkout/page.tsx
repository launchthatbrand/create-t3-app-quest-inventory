import React from "react";
import { DefaultForm } from "~/app/_components/DefaultForm";
import { fetchCategories } from "../actions";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

async function CheckoutPage({}: Props) {
  const fetchedCategories = await fetchCategories();
  const categories = fetchedCategories?.data.boards[0].groups;
  // console.log("categories", categories);
  return (
    <div className="container flex flex-col items-center justify-center rounded-md p-3 text-black">
      <DefaultForm type="out" categories={categories} />
    </div>
  );
}

export default CheckoutPage;
