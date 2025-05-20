import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const links = pgTable('links', {
  shortUrl: text('short_url').primaryKey().notNull().unique(),
  originalUrl: text('original_url').notNull(),
  createdAt: timestamp('created_at').notNull(),
  accessCount: integer('access_count').notNull().$type<number>(),
})
