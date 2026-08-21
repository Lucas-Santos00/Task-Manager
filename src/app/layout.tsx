import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SprintBoard',
  description: 'Gerenciamento de sprints para times de desenvolvimento',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
