import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./Store";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // 🔹 Handle auth state changes
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user || null;
        setUser(authUser);

        if (authUser) {
          await loadProfile(authUser.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔹 Load profile from DB
  async function loadProfile(uid) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .single();

    setProfile(data || null);
    return data;
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
