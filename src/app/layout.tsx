import type { Metadata } from 'next'
import { Nanum_Gothic_Coding } from 'next/font/google'
import './globals.css'

import { QuarterCircle } from '@/components/nav/QuarterCircle'
import { NavbarMenus } from '../components/nav/NavbarMenus'

const nanumGothicCoding = Nanum_Gothic_Coding({
  weight: ['400'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={nanumGothicCoding.className}>
        <div className="blur-box" />
        <div className="main-box">
          <div style={{ marginBottom: '24rem' }}>
            <div className="double-border flex flex-row justify-between mb-4">
              <div className="flex flex-col justify-between">
                <span className="sm:text-md md:text-3xl font-extrabold">
                  NO PROBLEM IS A BIG PROBLEM
                </span>
                <NavbarMenus />
              </div>
              <QuarterCircle />
            </div>
            {children}
          </div>
          <div className="flex flex-col justify-start items-center">
            <div>하이고니</div>
          </div>
        </div>
      </body>
    </html>
  )
}
