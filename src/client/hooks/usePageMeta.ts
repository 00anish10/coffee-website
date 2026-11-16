import { useEffect } from 'react';

function upsertMeta(key: 'name' | 'property', value: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${value}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(key, value);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * Keeps document title, meta description and Open Graph tags in sync with the
 * active route. Helps SEO and the browser tab/history.
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    const descTag = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = descTag?.getAttribute('content') ?? null;

    document.title = title;
    upsertMeta('property', 'og:title', title);
    upsertMeta('name', 'twitter:title', title);

    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
      upsertMeta('name', 'twitter:description', description);
    }

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== null) {
        upsertMeta('name', 'description', previousDescription);
      }
    };
  }, [title, description]);
}
