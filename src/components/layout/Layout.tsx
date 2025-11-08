import Header from './Header'
import Footer from './Footer'
import { NotificationCenter } from '@ui'


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
      <NotificationCenter />
    </div>
  )
}

export default Layout