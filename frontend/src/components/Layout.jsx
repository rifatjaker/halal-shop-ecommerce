import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import { TopBanner, Footer } from './Shared';
import { useStore } from '../context/StoreContext';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  const { toast } = useStore();
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <TopBanner />
      <Header />
      <main key={location.pathname + location.search}>
        <Outlet />
      </main>
      <Footer />
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
