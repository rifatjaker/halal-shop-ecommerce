import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router keeps the browser scroll position when navigating
 * (SPA behavior) — this resets it to the top on every page change.
 * Only pathname is watched, so switching category/search inside the
 * shop page doesn't yank you to the top mid-browsing.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
