import Link from "next/link";

export default function Message({ message }) {
  const sender = message.user;

  return (
    <div className="flex gap-3 p-2 items-start">
      <Link href={`/u/${sender?.id}`}>
        <img
          src={sender?.pfp || "/default.png"}
          className="w-10 h-10 rounded-full cursor-pointer"
        />
      </Link>

      <div>
        <Link href={`/u/${sender?.id}`}>
          <div className="font-bold hover:underline cursor-pointer">
            {sender?.username || "Unknown"}
          </div>
        </Link>

        <div>{message.content}</div>
      </div>
    </div>
  );
}
