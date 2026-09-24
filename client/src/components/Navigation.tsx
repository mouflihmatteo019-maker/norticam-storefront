import { type ComponentProps } from 'react';
import { Link as RouterLink } from 'wouter';
import { canonicalPath } from '@/lib/seo-render';
import { themeRuntime, themeHref } from '@/lib/theme-runtime';
export * from 'wouter';
// Navigation and server-generated HTML use the same URLs: no extra slash redirect.
export function Link(props: ComponentProps<typeof RouterLink>) {
  const href = props.href || props.to;
  if (!href) return <RouterLink {...props} />;
  if (themeRuntime()) {
    const { to, href: ignored, replace, state, asChild, ...rest } = props as any;
    return <a {...rest} href={themeHref(href)} />;
  }
  const normalized = href.startsWith('/') && !href.startsWith('//') && !/\.[a-z0-9]+(?:[?#]|$)/i.test(href) ? canonicalPath(href) : href;
  const next = { ...props, ...(props.href !== undefined ? {href:normalized} : {to:normalized}) } as ComponentProps<typeof RouterLink>;
  return <RouterLink {...next} />;
}
