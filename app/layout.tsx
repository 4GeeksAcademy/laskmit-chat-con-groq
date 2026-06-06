import '../styles/globals.css'

export const metadata = {
  title: 'Laskmit Chat con Groq',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}
