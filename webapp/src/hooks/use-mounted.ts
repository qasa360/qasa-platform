import { useEffect, useState } from 'react';

/**
 * Hook to check if component is mounted
 * Useful for preventing hydration mismatches with client-only code
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

