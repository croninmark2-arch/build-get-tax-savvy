export const metadata = {
  title: 'Get Tax Savvy',
  description: 'Track business expenses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
