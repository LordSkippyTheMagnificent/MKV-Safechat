import { supabase } from "../../lib/Store";
import Message from "../../components/Message";
import { useEffect, useState } from "react";

export default function ChannelPage({ initialMessages, initialProfiles }) {
  const [messages, setMessages] = useState(initialMessages);
  const [profiles, setProfiles] = useState(initialProfiles);

  // Realtime updates (optional)
  useEffect(() => {
    const channel = supabase
      .channel("room-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        async (payload) => {
          const newMessage = payload.new;
          const senderId = newMessage.user_id;

          // If profile not loaded yet → load it now
          if (!profiles[senderId]) {
            const { data } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", senderId)
              .single();

            setProfiles((prev) => ({ ...prev, [senderId]: data }));
          }

          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [profiles]);

  return (
    <div className="p-4 space-y-4">
      {messages.map((msg) => (
        <Message
          key={msg.id}
          message={msg}
          profile={profiles[msg.user_id]}
        />
      ))}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const channelId = params.id;

  // Load messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true });

  // Extract sender IDs
  const senderIds = [...new Set(messages.map((m) => m.user_id))];

  // Load all sender profiles
  const { data: profilesArr } = await supabase
    .from("profiles")
    .select("*")
    .in("id", senderIds);

  // Convert array → object map
  const profiles = {};
  if (profilesArr)
    profilesArr.forEach((p) => {
      profiles[p.id] = p;
    });

  return {
    props: {
      initialMessages: messages || [],
      initialProfiles: profiles
    }
  };
}
