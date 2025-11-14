import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "./Store";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // load session
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setProfile(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // load profile from supabase
  async function loadProfile(uid) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .single();

    setProfile(data || null);
  }

  return (
    <UserContext.Provider value={{ user, profile, loadProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
