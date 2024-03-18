/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { fetchCategories, fetchEvents, fetchLocations } from "../actions";

import { DefaultForm } from "~/app/_components/DefaultForm";
import React from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

async function CheckoutPage({}: Props) {
  const fetchedEvents = await fetchEvents();
  const fetchedLocations = await fetchLocations();
  const locations = fetchedLocations?.data.boards[0].items_page.items;
  const fetchedCategories = await fetchCategories();
  const categories = fetchedCategories?.data.boards[0].groups;

  // console.log("categories", categories);
  return (
    <div className="container flex flex-col items-center justify-center rounded-md p-3 text-black">
      <DefaultForm
        type="out"
        categories={categories}
        events={fetchedEvents}
        locations={locations}
      />
    </div>
  );
}

export default CheckoutPage;
