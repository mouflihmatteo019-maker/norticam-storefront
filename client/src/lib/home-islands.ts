import type { ThemeRuntime } from './theme-runtime';

export function prepareHomeIslands(root: HTMLElement, runtime: ThemeRuntime): HTMLElement {
  if (runtime.path !== '/') return root;
  const header = root.querySelector<HTMLElement>('[data-home-header]');
  const content = root.querySelector<HTMLElement>('[data-home-content]');
  const footer = root.querySelector<HTMLElement>('[data-home-footer]');
  if (!header || !content || !footer) return root;
  runtime.homeMounts = { header, content, footer };
  // Never clear root/main or move the original hero. Its image must remain
  // the exact same DOM node before and after React starts.
  for (const slot of [header, content, footer]) slot.replaceChildren();
  const target = root.ownerDocument.createElement('div');
  target.id = 'norticam-home-runtime';
  root.appendChild(target);
  return target;
}
