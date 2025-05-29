import { api } from "../lib/axios";

export type AccessShortenUrlResponse = {
  url: string;
};

export const accessShortenUrl = async (shortUrl: string) => {
  const { data } = await api.patch<AccessShortenUrlResponse>(
    `/shorten/${shortUrl}/access`
  );
  return data;
};
