import '../styles/globals.css'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
// ToastContainer is a client component
import dynamic from 'next/dynamic'
const ToastContainer = dynamic(()=>import('../components/Toast').then(m=>m.ToastContainer), { ssr: false })

export const metadata = {
  title: 'VitaTrackr',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Navbar />
        <ToastContainer />
        <PageTransition>
          <div id="main-content">{children}</div>
        </PageTransition>
      </body>
    </html>
  )
}
