import React from "react";
import SinglePostComponent from "~/app/_components/Post";
import { api } from "~/trpc/server";
import { unstable_noStore as noStore } from "next/cache";

async function SupabasePostsPage() {
  noStore();
  const data = await api.post.getAll.query();

  return (
    <div className="space-y-3">
      <p> Supabase Posts:</p>
      {data?.map((item) => <SinglePostComponent key={item.id} {...item} />)}
    </div>
  );
}

export default SupabasePostsPage;
