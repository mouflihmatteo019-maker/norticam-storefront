import { useEffect, useRef } from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { themeHref, themeRuntime } from '@/lib/theme-runtime';

export default function NativeThemeContent() {
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node=content.current;
    if(!node) return;
    const list=node.querySelector('[data-article-toc]');
    const headings=Array.from(node.querySelectorAll<HTMLElement>('.norticam-rich-content h2, .norticam-rich-content h3'));
    if(list && headings.length>1) {
      list.replaceChildren();
      headings.forEach((heading,index)=>{
        if(!heading.id) heading.id=`article-section-${index+1}`;
        const item=document.createElement('li'), link=document.createElement('a');
        link.href=`#${heading.id}`; link.textContent=heading.textContent;
        item.append(link); list.append(item);
      });
      list.closest<HTMLElement>('[data-toc-panel]')!.hidden=false;
    }
    node.querySelectorAll<HTMLAnchorElement>('.norticam-rich-content a[href]').forEach(link=>{
      const url=new URL(link.href,location.origin);
      if([location.host,'norticam.com','www.norticam.com','checkout.norticam.com'].includes(url.host)) {
        link.href=themeHref(url.pathname+url.search+url.hash);
      }
    });
  },[]);
  return <StorefrontLayout><div ref={content} dangerouslySetInnerHTML={{__html:themeRuntime()?.nativeContent || ''}} /></StorefrontLayout>;
}
