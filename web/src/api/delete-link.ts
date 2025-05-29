import { api } from "../lib/axios";

type RemoveLinkParams = {
  shortUrl: string;
};

export const removeLink = async ({ shortUrl }: RemoveLinkParams) => {
  const { data } = await api.delete(`/shorten/${shortUrl}`);
  return data;
};
