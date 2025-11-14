import { useState, useEffect } from "react";
import { useUser } from "../lib/UserContext";
import { supabase } from "../lib/Store";

export default function Settings() {
  const { user, profile, loadProfile } = useUser();
  const [form, setForm] = useState({ username: "", pfp: "", bio: "" });

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  if (!user) return <div className="p-8">Please log in.</div>;

  async function save() {
    await supabase
      .from("profiles")
      .update({
        username: form.username,
        pfp: form.pfp,
        bio: form.bio
      })
      .eq("id", user.id);

    await loadProfile(user.id);
    alert("Saved!");
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Edit Profile</h1>

      <label>Username</label>
      <input
        className="border p-2 w-full"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <label>Profile Picture URL</label>
      <input
        className="border p-2 w-full"
        value={form.pfp}
        onChange={(e) => setForm({ ...form, pfp: e.target.value })}
      />

      <label>Bio</label>
      <textarea
        className="border p-2 w-full"
        value={form.bio}
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
      />

      <button
        onClick={save}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}
