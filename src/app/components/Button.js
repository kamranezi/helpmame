import Link from 'next/link';

export default function Button({ href, children, variant = 'default' }) {
  const base = "px-6 py-2 rounded font-semibold transition-colors";
  const style =
    variant === 'red'
      ? `${base} bg-red-500 text-white hover:bg-red-600`
      : `${base} bg-blue-500 text-white hover:bg-blue-600`;

  return <Link href={href} className={style}>{children}</Link>;
}