export default function Avatar({ src, size = 40 }) {
  return (
    <img
      src={src || "/default.png"}
      width={size}
      height={size}
      className="rounded-full object-cover"
    />
  );
}