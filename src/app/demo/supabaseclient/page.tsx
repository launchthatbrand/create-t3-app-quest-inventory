"use client";

import { type User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { supabaseBrowser } from "~/lib/supabase/browser";

function SupabaseClientPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getClientSession() {
      setLoading(true);
      const supabase = supabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("result", user);
      setUser(user);
      setLoading(false);
    }
    void getClientSession();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (user)
    return (
      <div>
        <p>User Found</p>
        <p>{user.email}</p>
      </div>
    );
}

export default SupabaseClientPage;
