import { api } from "../lib/axios";

export type ShortenUrlListResponse = {
  shortenedUrls: {
    url: string;
    shortUrl: string;
    accessCount: number;
  }[];
  nextCursor: string | null;
};

export const getLinks = async () => {
  const { data } = await api.get<ShortenUrlListResponse>("/shorten", {});
  return data;
};
