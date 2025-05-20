import { accessShortenUrl } from '@/app/services/access-shorten-url'
import { isRight, unwrapEither } from '@/shared/either'
import { shortenUrlRegex } from '@/shared/shorten-url-regex'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const accessShortenUrlRoute: FastifyPluginAsyncZod = async server => {
  server.patch(
    '/shorten/:shortUrl/access',
    {
      schema: {
        summary: 'Access a shorten URL and increment its access count',
        tags: ['shorten'],
        params: z.object({
          shortUrl: z.string().regex(shortenUrlRegex),
        }),
        response: {
          200: z.object({
            url: z.string(),
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

      const result = await accessShortenUrl({
        shortUrl,
      })

      if (isRight(result)) {
        return reply.status(200).send({ url: unwrapEither(result).url })
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
