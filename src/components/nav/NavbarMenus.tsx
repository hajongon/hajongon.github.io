import Link from 'next/link'

export const NavbarMenus = () => {
  return (
    <div className="flex flex-row flex-start gap-x-4 ml-4">
      <Link href="/blog" className="-rotate-5 border-b border-black">
        HOME
      </Link>
      <Link
        href="https://github.com/hajongon"
        className="-rotate-5 border-b border-black"
        target="_blank"
        rel="noopener noreferrer"
      >
        GITHUB
      </Link>
      <Link
        href="https://instagram.com/h4gon"
        target="_blank"
        rel="noopener noreferrer"
        className="-rotate-5 border-b border-black"
      >
        INSTAGRAM
      </Link>
    </div>
  )
}
