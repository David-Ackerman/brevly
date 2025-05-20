import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { shortenUrlRegex } from '@/shared/shorten-url-regex'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ShortenUrlExists } from './errors/shorten-url-exists'
import { WrongFormatShortenUrl } from './errors/wrong-format-shorten-url'

const shortenUrlSchema = z.object({
  url: z.string().url(),
  shortUrl: z.string().regex(/^[A-Za-z0-9-]{4,}$/, {
    message:
      'Slug must be at least 4 characters long and contain only letters, numbers, or dashes',
  }),
})

type ShortenUrlInput = z.infer<typeof shortenUrlSchema>

export async function shortenUrl(
  input: ShortenUrlInput
): Promise<
  Either<Error, { url: string; shortUrl: string; accessCount: number }>
> {
  const { url, shortUrl } = shortenUrlSchema.parse(input)
  if (!shortenUrlRegex.test(shortUrl)) {
    return makeLeft(new WrongFormatShortenUrl())
  }

  const existingLink = await db
    .select()
    .from(links)
    .where(eq(links.shortUrl, shortUrl))
    .execute()

  if (existingLink.length > 0) {
    return makeLeft(new ShortenUrlExists())
  }

  const newShortenUrl = await db
    .insert(links)
    .values({
      shortUrl,
      originalUrl: url,
      createdAt: new Date(),
      accessCount: 0,
    })
    .returning()
    .execute()

  return makeRight({
    url: newShortenUrl[0].originalUrl,
    shortUrl: newShortenUrl[0].shortUrl,
    accessCount: newShortenUrl[0].accessCount,
  })
}
