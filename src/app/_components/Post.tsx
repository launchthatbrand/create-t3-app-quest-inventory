import React from "react";

type Props = {
  item: {
    name: string;
    id: string;
  };
};

function SinglePostComponent({ item }: Props) {
  return (
    <div className="rounded-md bg-white bg-opacity-10 p-3 shadow-md">
      <p>{item.name}</p>
      <p>{item.id}</p>
    </div>
  );
}

export default SinglePostComponent;
