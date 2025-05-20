import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { shortenUrlRegex } from '@/shared/shorten-url-regex'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ShortenUrlNotFound } from './errors/shorten-url-not-found'
import { WrongFormatShortenUrl } from './errors/wrong-format-shorten-url'

const removeShortenUrlInput = z.object({
  shortUrl: z.string().regex(shortenUrlRegex, {
    message:
      'Slug must be at least 4 characters long and contain only letters, numbers, or dashes',
  }),
})

type RemoveShortenUrlInput = z.input<typeof removeShortenUrlInput>

export const removeShortenUrl = async (
  input: RemoveShortenUrlInput
): Promise<Either<Error, { message: string }>> => {
  const { shortUrl } = removeShortenUrlInput.parse(input)

  if (!shortenUrlRegex.test(shortUrl)) {
    return makeLeft(new WrongFormatShortenUrl())
  }

  const existingLink = await db.query.links.findFirst({
    where: eq(schema.links.shortUrl, shortUrl),
  })

  if (!existingLink) {
    return makeLeft(new ShortenUrlNotFound())
  }

  await db
    .delete(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl))
    .execute()

  return makeRight({
    message: 'Shorten URL removed',
  })
}
