import React from "react";
import SinglePostComponent from "~/app/_components/Post";
import supabaseServer from "~/lib/supabase/server";

type Post = {
  name: string;
  id: string;
};

async function SupabasePostsPage() {
  const supabase = await supabaseServer();
  const result = await supabase.from("post").select("*");
  const data = result.data as Post[];
  return (
    <div className="space-y-3">
      <p> Supabase Posts:</p>
      {data?.map((item) => <SinglePostComponent key={item.id} item={item} />)}
    </div>
  );
}

export default SupabasePostsPage;
