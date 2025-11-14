import Link from "next/link";
import Avatar from "./Avatar";

export default function Message({ message, profile }) {
  return (
    <div className="flex gap-3 p-2 items-start">
      <Link href={`/u/${profile?.id}`}>
        <Avatar src={profile?.pfp} size={40} />
      </Link>

      <div>
        <Link href={`/u/${profile?.id}`}>
          <div className="font-bold hover:underline cursor-pointer">
            {profile?.username || "Unknown"}
          </div>
        </Link>

        <div>{message.content}</div>
      </div>
    </div>
  );
}
