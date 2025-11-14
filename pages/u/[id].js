import { supabase } from "../../lib/Store";

export async function getServerSideProps(context) {
  const { id } = context.params;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  return {
    props: {
      profile: data || null
    }
  };
}

export default function UserProfile({ profile }) {
  if (!profile) return <div className="p-8">User not found.</div>;

  return (
    <div className="p-8 max-w-xl mx-auto text-center space-y-4">
      <img
        src={profile.pfp}
        className="mx-auto w-32 h-32 rounded-full"
      />

      <h1 className="text-3xl font-bold">{profile.username}</h1>
      <p className="text-gray-600">{profile.bio}</p>
    </div>
  );
}
