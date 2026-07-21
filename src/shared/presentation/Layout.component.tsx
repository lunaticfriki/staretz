import type { ComponentChildren } from 'preact'
import { Footer } from './Footer.component'
import { Header } from './Header.component'

interface LayoutProps {
  children: ComponentChildren
}

export function Layout({ children }: LayoutProps) {
  return (
    <div class="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />
      <main class="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
      <Footer />
    </div>
  )
}
