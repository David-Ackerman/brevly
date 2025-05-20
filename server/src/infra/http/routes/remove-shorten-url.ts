import { removeShortenUrl } from '@/app/services/remove-shorten-url'
import { isRight, unwrapEither } from '@/shared/either'
import { shortenUrlRegex } from '@/shared/shorten-url-regex'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const removeShortenUrlRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    '/shorten/:shortUrl',
    {
      schema: {
        summary: 'Remove a shorten URL',
        tags: ['shorten'],
        params: z.object({
          shortUrl: z.string().regex(shortenUrlRegex),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { shortUrl } = request.params

      const result = await removeShortenUrl({ shortUrl })

      if (isRight(result)) {
        return reply.status(200).send({ message: 'Shorten URL removed' })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'ShortenUrlNotFound':
          return reply.status(404).send({ message: error.message })
        case 'WrongFormatShortenUrl':
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}
