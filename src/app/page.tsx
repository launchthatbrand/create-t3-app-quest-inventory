import { CreatePost } from "~/app/_components/create-post";
import Link from "next/link";
import { Session } from "@supabase/supabase-js";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { unstable_noStore as noStore } from "next/cache";
import { readUserSession } from "./(auth)/actions";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });
  // const session = await getServerAuthSession();
  const {
    data: { session },
  } = await readUserSession();

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-[3rem]">
          B5 Office Of Safety Inventory System
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/order/checkout"
          >
            <h3 className="text-2xl font-bold">Check Out →</h3>
            <div className="text-lg">Check out an order.</div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/order"
          >
            <h3 className="text-2xl font-bold">Check In →</h3>
            <div className="text-lg">Check in an order.</div>
          </Link>
        </div>
        {/* <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.email}</span>}
            </p>
          </div>
        </div> */}

        {/* <CrudShowcase session={session} /> */}
      </div>
    </main>
  );
}

// async function CrudShowcase({ session }: { session: Session | null }) {
//   if (!session?.user) return null;

//   const latestPost = await api.post.getLatest.query();

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       <CreatePost />
//     </div>
//   );
// }
