import { createClient } from "@supabase/supabase-js";

// ------------------------------------
// Supabase Client
// ------------------------------------
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ------------------------------------
// Auth: Sign Up
// ------------------------------------
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  // If user successfully signed up → create profile row
  if (data.user) {
    await createUserProfile(data.user);
  }

  return { data, error };
}

// ------------------------------------
// Auth: Sign In
// ------------------------------------
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

// ------------------------------------
// Auth: Sign Out
// ------------------------------------
export async function signOut() {
  await supabase.auth.signOut();
}

// ------------------------------------
// Create Profile After Signup
// ------------------------------------
export async function createUserProfile(user) {
  const newProfile = {
    id: user.id,
    username: "User" + Math.floor(Math.random() * 9000),
    pfp: `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.id}`,
    bio: "Hello! I'm new to SafeChat.",
    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from("profiles").insert(newProfile);

  if (error) {
    console.error("Failed to create profile:", error);
  }

  return newProfile;
}

// ------------------------------------
// Fetch a Single User Profile
// ------------------------------------
export async function getUserProfile(id) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }

  return data;
}

// ------------------------------------
// Fetch Multiple User Profiles (Map of IDs → Profiles)
// ------------------------------------
export async function getProfilesByIds(ids) {
  if (!ids || ids.length === 0) return {};

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("id", ids);

  if (error) {
    console.error("Failed to fetch multiple profiles:", error);
    return {};
  }

  const result = {};
  for (const p of data) result[p.id] = p;
  return result;
}
