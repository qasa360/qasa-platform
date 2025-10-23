'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to suppress hydration warnings caused by browser extensions
 * that modify the DOM after server rendering but before React hydration.
 */
export function useSuppressHydration() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Common browser extension attributes
    const extensionAttributes = [
      'data-new-gr-c-s-check-loaded',
      'data-gr-ext-installed',
      'data-grammarly-shadow-root',
      'data-gramm',
    ];

    // Remove browser extension attributes that cause hydration mismatches
    const removeExtensionAttributes = () => {
      const body = document.body;
      if (body) {
        extensionAttributes.forEach((attr) => {
          if (body.hasAttribute(attr)) {
            body.removeAttribute(attr);
          }
        });
      }
    };

    // Run immediately and on DOM mutations
    removeExtensionAttributes();

    const observer = new MutationObserver(() => {
      removeExtensionAttributes();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: extensionAttributes,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return isClient;
}
