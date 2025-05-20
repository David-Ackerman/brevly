import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { shortenUrlRegex } from '@/shared/shorten-url-regex'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { ShortenUrlNotFound } from './errors/shorten-url-not-found'
import { WrongFormatShortenUrl } from './errors/wrong-format-shorten-url'

const accessShortenUrlInput = z.object({
  shortUrl: z.string().regex(shortenUrlRegex, {
    message:
      'Slug must be at least 4 characters long and contain only letters, numbers, or dashes',
  }),
})

type AccessShortenUrlInput = z.input<typeof accessShortenUrlInput>

export const accessShortenUrl = async (
  input: AccessShortenUrlInput
): Promise<Either<Error, { url: string }>> => {
  const { shortUrl } = accessShortenUrlInput.parse(input)

  if (!shortenUrlRegex.test(shortUrl)) {
    return makeLeft(new WrongFormatShortenUrl())
  }

  const existingLink = await db.query.links.findFirst({
    where: eq(schema.links.shortUrl, shortUrl),
  })

  if (!existingLink) {
    return makeLeft(new ShortenUrlNotFound())
  }

  const result = await db
    .update(schema.links)
    .set({ accessCount: sql`${schema.links.accessCount} + 1` })
    .where(eq(schema.links.shortUrl, shortUrl))
    .returning()
    .execute()

  return makeRight({
    url: result[0].originalUrl,
    accessCount: result[0].accessCount,
  })
}
