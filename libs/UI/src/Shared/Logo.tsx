import { Link } from "@remix-run/react"

export default function Logo({ logoPath }: { readonly logoPath: string }) {
  return (
    <Link to="/" className="flex gap-1 items-center">
      <img src={logoPath} alt="logo text" className="h-8" />
    </Link>
  )
}
