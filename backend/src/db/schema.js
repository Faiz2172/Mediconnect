import { pgTable, serial, text, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// 1. Define the ENUM for blog categories
export const categoryEnum = pgEnum('category_enum', [
  'Technology',
  'Food',
  'Travel',
  'Lifestyle',
  'Education',
  'Other',
]);

// 2. Define the blog_posts table
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: categoryEnum('category').notNull(),
  content: text('content').notNull(),
  image: text('image'), // Optional: URL or path to the image
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
