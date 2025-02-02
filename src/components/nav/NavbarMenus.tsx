import Link from 'next/link'

export const NavbarMenus = () => {
  return (
    <div className="nav-menus flex flex-row flex-start gap-x-4 ml-4 p-2">
      <Link href="/blog" className="-rotate-5 border-b border-black">
        <span className="sm:text-xl">HOME</span>
      </Link>
      <Link href="/project" className="-rotate-5 border-b border-black">
        <span className="sm:text-xl">PROJECT</span>
      </Link>
      <Link
        href="https://github.com/hajongon"
        className="-rotate-5 border-b border-black"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="sm:text-xl">GITHUB</span>
      </Link>
      <Link
        href="https://instagram.com/h4gon"
        target="_blank"
        rel="noopener noreferrer"
        className="-rotate-5 border-b border-black"
      >
        <span className="sm:text-xl">INSTAGRAM</span>
      </Link>
    </div>
  )
}
