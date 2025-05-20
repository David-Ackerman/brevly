import { shortenUrl } from '@/app/services/shorten-url'
import { isRight, unwrapEither } from '@/shared/either'
import { shortenUrlRegex } from '@/shared/shorten-url-regex'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { z } from 'zod'

export const shortenUrlRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/shorten',
    {
      schema: {
        summary: 'Create a new shortened URL',
        body: z.object({
          url: z.string().url(),
          shortUrl: z.string().regex(shortenUrlRegex, {
            message:
              'Slug must be at least 4 characters long and contain only letters, numbers, or dashes',
          }),
        }),
        tags: ['shorten'],
        response: {
          201: z.object({
            url: z.string().url(),
            shortUrl: z.string(),
            accessCount: z.number(),
          }),
          400: z
            .object({ message: z.string() })
            .describe('Invalid URL or short URL format.'),
          409: z
            .object({ messagee: z.string() })
            .describe('Short url already exists.'),
        },
      },
    },
    async (request, reply) => {
      const { url, shortUrl } = request.body

      const result = await shortenUrl({
        url,
        shortUrl,
      })

      if (isRight(result)) {
        console.log(unwrapEither(result))
        return reply.status(201).send({
          ...unwrapEither(result),
        })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'ShortenUrlExists':
          return reply.status(409).send()
        case 'WrongFormatShortenUrl':
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}
