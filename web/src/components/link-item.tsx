import { CopyIcon, TrashIcon } from "@phosphor-icons/react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeLink } from "../api/delete-link";
import type { ShortenUrlListResponse } from "../api/get-links";
import { toast } from "sonner";

type LinkItemProps = {
  shortUrl: string;
  url: string;
  accessCount: number;
};
export function LinkItem(props: LinkItemProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: deletLinkFn } = useMutation({
    mutationFn: removeLink,
    onSuccess(_, { shortUrl }) {
      const cached = queryClient.getQueryData<ShortenUrlListResponse>([
        "links",
      ]);
      if (cached) {
        const { shortenedUrls } = cached as {
          shortenedUrls: { shortUrl: string; url: string }[];
        };
        queryClient.setQueryData(["links"], {
          shortenedUrls: shortenedUrls.filter(
            (link) => link.shortUrl !== shortUrl
          ),
        });
      }
      toast.success("Link deletado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  function handleCopyLink() {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_FRONTEND_URL}/${props.shortUrl}`
    );
    toast.success("Link copiado para a área de transferência!");
  }

  function handleDeleteLink() {
    const confirm = window.confirm(
      "Você tem certeza que deseja deletar esse link? Essa ação não pode ser desfeita."
    );
    if (confirm) {
      deletLinkFn({ shortUrl: props.shortUrl });
    }
  }

  function handleAccessLink() {
    queryClient.setQueryData<ShortenUrlListResponse>(["links"], (old) => {
      if (old) {
        const { shortenedUrls } = old;
        const updatedShortenedUrls = shortenedUrls.map((link) => {
          if (link.shortUrl === props.shortUrl) {
            return {
              ...link,
              accessCount: link.accessCount + 1,
            };
          }
          return link;
        });
        return {
          ...old,
          shortenedUrls: updatedShortenedUrls,
        };
      }
      return old;
    });
  }
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex-1 space-y-1 max-w-1/2 ">
        <Link
          className="text-md text-blue-base overflow-x-hidden text-ellipsis whitespace-nowrap"
          to={props.shortUrl}
          target="_blank"
          onClick={handleAccessLink}
        >
          brev.ly/{props.shortUrl}
        </Link>
        <p className="text-sm text-gray-500 overflow-x-hidden text-ellipsis whitespace-nowrap">
          {props.url}
        </p>
      </div>
      <div className="flex items-center">
        <span className="text-sm mr-5 text-gray-500">
          {props.accessCount} acessos
        </span>
        <Button
          onClick={handleCopyLink}
          variant="secondary"
          className="mr-1 size-8"
        >
          <CopyIcon className="size-3 text-gray-600" />
        </Button>
        <Button
          onClick={handleDeleteLink}
          variant="secondary"
          className="size-8"
        >
          <TrashIcon className="size-3 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}
