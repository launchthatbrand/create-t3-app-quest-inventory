import React from "react";
import SinglePostComponent from "~/app/_components/Post";
import { api } from "~/trpc/server";
import supabaseServer from "~/lib/supabase/server";

async function SupabasePostsPage() {
  // const supabase = await supabaseServer();
  // const result = await supabase.from("post").select("*");
  // const data = result.data as Post[];
  const data = await api.post.getAll.query();
  console.log("data", data);
  return (
    <div className="space-y-3">
      <p> Supabase Posts:</p>
      {data?.map((item) => <SinglePostComponent key={item.id} item={item} />)}
    </div>
  );
}

export default SupabasePostsPage;
