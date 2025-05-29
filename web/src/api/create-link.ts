import { api } from "../lib/axios";

type CreateLinkParams = {
  url: string;
  shortUrl: string;
};

export const createLink = async ({ shortUrl, url }: CreateLinkParams) => {
  const { data } = await api.post("/shorten", { shortUrl, url });
  return data;
};
