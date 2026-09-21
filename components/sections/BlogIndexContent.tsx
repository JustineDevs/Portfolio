'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, CalendarDays, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { PublicPost } from '@/lib/content/types';
import { getRenderableImageUrl } from '@/lib/asset-urls';

const categories = ['All writing', 'Design', 'Product', 'Software', 'Development', 'Systems'];

function formatDate(value?: string | null) {
  if (!value) return 'Field note';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function postCategory(post: PublicPost) {
  const text = `${post.title} ${post.summary} ${post.sourcePlatform || ''}`.toLowerCase();
  if (/(design|ux|ui|architect)/.test(text)) return 'Design';
  if (/(product|founder|business|customer)/.test(text)) return 'Product';
  if (/(software|code|coding|developer|programming)/.test(text)) return 'Software';
  if (/(go|python|javascript|typescript|build|technical|system)/.test(text)) return 'Development';
  return 'Systems';
}

function postHref(post: PublicPost) {
  return post.postType === 'external' && post.canonicalUrl ? post.canonicalUrl : `/blog/${post.slug}`;
}

function PostImage({ post, featured = false }: { post: PublicPost; featured?: boolean }) {
  return post.coverImageUrl ? (
    <Image
      src={getRenderableImageUrl(post.coverImageUrl)}
      alt=""
      fill
      sizes="(min-width: 1024px) 55vw, 100vw"
      className={`h-full w-full object-cover grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0 ${featured ? 'group-hover:brightness-105' : ''}`}
      unoptimized
    />
  ) : (
    <div className="relative h-full w-full overflow-hidden bg-[#eef0f2]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(19,66,255,0.18),transparent_28%),linear-gradient(135deg,#f8f8f8_0%,#dfe3e7_100%)]" />
      <div className="absolute inset-5 border border-[#c9cdd2] bg-[linear-gradient(135deg,transparent_49%,rgba(66,66,66,0.12)_50%,transparent_51%)] bg-[length:28px_28px]" />
      <span className="absolute bottom-4 left-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6a7280]">JSTN / writing</span>
    </div>
  );
}

function PostCard({ post }: { post: PublicPost }) {
  const href = postHref(post);
  const content = (
    <>
      <div className="group relative aspect-[1.45] overflow-hidden border border-[#d5d5d5] bg-[#eef0f2]">
        <PostImage post={post} />
      </div>
      <div className="mt-3 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6a7280]">
        <span className="border border-[#d5d5d5] bg-[#f8f8f8] px-2 py-1 text-[#424242]">{postCategory(post)}</span>
        <span>{post.postType === 'native' ? 'Article' : 'External post'}</span>
      </div>
      <div className="mt-2 flex items-start justify-between gap-4">
        <h2 className="text-[20px] font-bold leading-[1.15] tracking-[-0.025em] text-[#424242]">{post.title}</h2>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[#7a8496]" aria-hidden="true" />
      </div>
      <p className="mt-2 line-clamp-3 text-[13px] leading-[1.65] text-[#58606d]">{post.summary}</p>
      <div className="mt-4 flex items-center gap-2 text-[10px] text-[#6a7280]">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
        <time dateTime={post.publishedAt || undefined}>{formatDate(post.publishedAt)}</time>
      </div>
    </>
  );

  return post.postType === 'external' && post.canonicalUrl ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
      {content}
    </a>
  ) : (
    <Link href={href} className="group block">
      {content}
    </Link>
  );
}

export default function BlogIndexContent({ posts }: { posts: PublicPost[] }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All writing');
  const featured = posts.find((post) => post.featured) || posts[0];
  const remainingPosts = featured ? posts.filter((post) => post.slug !== featured.slug) : posts;

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return remainingPosts.filter((post) => {
      const categoryMatches = activeCategory === 'All writing' || postCategory(post) === activeCategory;
      const queryMatches = !normalizedQuery || `${post.title} ${post.summary}`.toLowerCase().includes(normalizedQuery);
      return categoryMatches && queryMatches;
    });
  }, [activeCategory, query, remainingPosts]);

  if (!featured) {
    return <div className="border-x border-b border-[#d5d5d5] p-8 text-[#58606d]">No writing published yet.</div>;
  }

  return (
    <>
      <section className="border-x border-b border-[#d5d5d5] bg-[#f8f8f8] p-3 text-[#424242] sm:p-5 lg:p-6">
        <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden border border-[#d5d5d5] bg-white lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[260px] overflow-hidden bg-[#eef0f2] lg:min-h-[340px]"><PostImage post={featured} featured /></div>
          <div className="flex flex-col justify-between border-t border-[#d5d5d5] p-5 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6a7280]">Featured note / {postCategory(featured)}</p>
              <h2 className="mt-6 max-w-xl text-[30px] font-bold leading-[1.05] tracking-[-0.04em] text-[#424242] sm:text-[42px]">{featured.title}</h2>
              <p className="mt-5 max-w-lg text-[14px] leading-[1.75] text-[#58606d]">{featured.summary}</p>
            </div>
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#d5d5d5] pt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6a7280]">
              <span>{formatDate(featured.publishedAt)}</span>
              <span className="inline-flex items-center gap-1 text-[#424242]">Read note <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
            </div>
          </div>
        </Link>
      </section>

      <section className="grid border-x border-b border-[#d5d5d5] lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-b border-[#d5d5d5] p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-8">
          <div className="sticky top-24">
            <label className="flex items-center gap-2 bg-transparent py-2.5 text-[#6a7280]">
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Search writing</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" className="w-full bg-transparent text-sm text-[#424242] outline-none placeholder:text-[#8a919b]" />
            </label>
            <div className="mt-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6a7280]">Blog categories</p>
              <div className="mt-4 space-y-1">
                {categories.map((category) => (
                  <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`block w-full border-l-2 px-3 py-2 text-left text-sm transition-colors ${activeCategory === category ? 'border-[#1342FF] font-semibold text-[#424242]' : 'border-transparent text-[#6a7280] hover:border-[#d5d5d5] hover:text-[#424242]'}`}>
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
        <div className="p-5 sm:p-8 lg:p-10">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#d5d5d5] pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6a7280]">Recent writing</p>
              <h2 className="mt-2 text-[24px] font-bold tracking-[-0.03em] text-[#424242]">The latest notes</h2>
            </div>
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#8a919b]">{filteredPosts.length} shown</span>
          </div>
          {filteredPosts.length > 0 ? (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
              {filteredPosts.map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <p className="border border-dashed border-[#d5d5d5] p-8 text-sm text-[#6a7280]">No notes match this filter.</p>
          )}
        </div>
      </section>
    </>
  );
}
