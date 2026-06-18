import "./globals.css"
import BottomNav from "@/components/bottom-nav"
import Sidebar from "@/components/sidebar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <div className="md:pl-64">
          <main className="pb-16 md:pb-0">
            {children}
          </main>
        </div>
        <BottomNav />
      </body>
    </html>
  )
}
