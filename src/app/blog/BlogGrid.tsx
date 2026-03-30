"use client";
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { urlFor } from '@/sanity/lib/image';

const EASE = [0.23, 1, 0.32, 1] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: EASE },
  },
};

export function BlogGrid({ posts }: { posts: any[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {posts.map((post: any) => (
        <motion.div key={post._id} variants={itemVariants}>
          <Link href={`/blog/${post.slug?.current}`} className="group block">
            <article className="rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              {post.coverImage?.asset && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={urlFor(post.coverImage).width(600).height(375).url()}
                    alt={post.coverImage.alt || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5">
                {post.category && (
                  <span className="text-xs font-semibold text-brand uppercase tracking-wider">
                    {post.category.title}
                  </span>
                )}
                <h2 className="text-xl font-bold text-foreground mt-1 mb-2 group-hover:text-brand transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-textmain text-sm line-clamp-3 mb-3">
                    {post.excerpt}
                  </p>
                )}
                {post.date && (
                  <time className="text-xs text-gray-400">
                    {format(parseISO(post.date), 'd MMMM yyyy', { locale: fr })}
                  </time>
                )}
              </div>
            </article>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
