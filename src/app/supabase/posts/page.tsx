import React from "react";
import SinglePostComponent from "~/app/_components/Post";
import { api } from "~/trpc/server";

async function SupabasePostsPage() {
  const data = await api.post.getAll.query();
  console.log("data", data);
  return (
    <div className="space-y-3">
      <p> Supabase Posts:</p>
      {data?.map((item) => <SinglePostComponent key={item.id} {...item} />)}
    </div>
  );
}

export default SupabasePostsPage;
