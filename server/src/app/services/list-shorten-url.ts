import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/shared/either'
import { and, asc, desc, gt, ilike, or } from 'drizzle-orm'
import { z } from 'zod'

const listShortenUrlsInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  cursor: z.string().datetime().optional(),
  pageSize: z.number().optional().default(20),
})

type ListShortenUrlsInput = z.input<typeof listShortenUrlsInput>

type ListShortenUrlsOutut = {
  shortenedUrls: Array<{
    url: string
    shortUrl: string
    accessCount: number
  }>
  nextCursor: string | null
}

export const listShortenUrls = async (
  input: ListShortenUrlsInput
): Promise<Either<never, ListShortenUrlsOutut>> => {
  const { cursor, pageSize, searchQuery, sortBy, sortDirection } =
    listShortenUrlsInput.parse(input)

  const cursorSelection = cursor
    ? gt(schema.links.createdAt, new Date(cursor))
    : undefined

  const shortenUrl = await db
    .select({
      url: schema.links.originalUrl,
      shortUrl: schema.links.shortUrl,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .where(
      and(
        cursorSelection,
        searchQuery
          ? or(
              ilike(schema.links.originalUrl, `%${searchQuery}%`),
              ilike(schema.links.shortUrl, `%${searchQuery}%`)
            )
          : undefined
      )
    )
    .orderBy(fields => {
      if (sortBy && sortDirection === 'asc') {
        return asc(fields[sortBy])
      }

      if (sortBy && sortDirection === 'desc') {
        return desc(fields[sortBy])
      }

      return desc(fields.createdAt)
    })
    .limit(pageSize + 1)

  const hasMore = shortenUrl.length > pageSize
  const data = hasMore ? shortenUrl.slice(0, pageSize) : shortenUrl
  const nextCursor = hasMore
    ? data[data.length - 1].createdAt.toISOString()
    : null

  return makeRight({ shortenedUrls: data, nextCursor })
}
