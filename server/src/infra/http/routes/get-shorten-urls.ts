import { listShortenUrls } from '@/app/services/list-shorten-url'
import { unwrapEither } from '@/shared/either'
import { ne } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getShortenUrlsRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/shorten',
    {
      schema: {
        summary: 'Get all shortened URLs',
        tags: ['shorten'],
        querystring: z.object({
          searchQuery: z.string().optional(),
          sortBy: z.enum(['createdAt']).optional(),
          sortDirection: z.enum(['asc', 'desc']).optional(),
          cursor: z.string().datetime().optional(),
          pageSize: z.coerce.number().optional().default(20),
        }),
        response: {
          200: z.object({
            shortenedUrls: z.array(
              z.object({
                url: z.string().url(),
                shortUrl: z.string(),
                accessCount: z.number(),
              })
            ),
            nextCursor: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { cursor, pageSize, searchQuery, sortBy, sortDirection } =
        request.query

      const result = await listShortenUrls({
        cursor,
        pageSize,
        searchQuery,
        sortBy,
        sortDirection,
      })

      const { shortenedUrls, nextCursor } = unwrapEither(result)

      return reply
        .status(200)
        .send({ shortenedUrls: shortenedUrls, nextCursor })
    }
  )
}
