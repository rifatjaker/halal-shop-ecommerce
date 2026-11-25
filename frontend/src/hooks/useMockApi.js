import { useEffect, useState } from 'react';

/**
 * Simulates an API call so we can show loading skeletons.
 * When the real backend arrives, swap the loader for a fetch()
 * call — the loading/skeleton flow stays exactly the same.
 */
export function useMockApi(loader, deps, delay = 450) {
  const [state, setState] = useState({ data: null, loading: true });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    const t = setTimeout(() => {
      Promise.resolve(loader())
        .then((data) => {
          if (alive) setState({ data, loading: false });
        })
        .catch(() => {
          if (alive) setState({ data: null, loading: false });
        });
    }, delay);
    return () => {
      alive = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
