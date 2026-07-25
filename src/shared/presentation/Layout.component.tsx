import type { ComponentChildren } from 'preact'
import { Footer } from './Footer.component'
import { Header } from './Header.component'
import { NotificationCenter } from './NotificationCenter.component'

interface LayoutProps {
  children: ComponentChildren
}

export function Layout({ children }: LayoutProps) {
  return (
    <div class="flex min-h-screen flex-col bg-background text-gray-900 dark:text-gray-100">
      <Header />
      <main class="flex w-full flex-1 flex-col px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
      <NotificationCenter />
    </div>
  )
}
