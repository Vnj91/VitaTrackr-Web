import '../styles/globals.css'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
// ToastContainer is a client component
import dynamic from 'next/dynamic'
// import the client wrapper which re-exports ToastContainer as default
const ToastContainer = dynamic(() => import('../components/ToastClient'), { ssr: false })

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
