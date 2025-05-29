import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "./card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createLink } from "../api/create-link";
import type { ShortenUrlListResponse } from "../api/get-links";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

const RegisterLinkSchema = z.object({
  url: z.string().url("URL inválida"),
  shortUrl: z
    .string()
    .min(1, "O link encurtado é obrigatório")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "O link encurtado só pode conter letras, números, hífens e underlines"
    ),
});

type RegisterLinkFormData = z.infer<typeof RegisterLinkSchema>;

export function RegisterLink() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterLinkFormData>({
    resolver: zodResolver(RegisterLinkSchema),
  });
  const { mutateAsync: createLinkFn } = useMutation({
    mutationFn: createLink,
    onSuccess(_, { shortUrl, url }) {
      const cached = queryClient.getQueryData<ShortenUrlListResponse>([
        "links",
      ]);

      if (cached) {
        const { shortenedUrls } = cached as {
          shortenedUrls: { shortUrl: string; url: string }[];
        };
        queryClient.setQueryData(["links"], {
          shortenedUrls: [{ shortUrl, url, accessCount: 0 }, ...shortenedUrls],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!data.url || !data.shortUrl) {
      return;
    }
    await createLinkFn({ ...data });
    toast.success("Link criado com sucesso!");
  });

  return (
    <Card className="w-full @3xl::max-w-[380px] items-start">
      <h2 className="text-lg text-gray-600">Novo link</h2>

      <form onSubmit={onSubmit} className="space-y-6 w-full">
        <div className="flex flex-col gap-4">
          <Input
            label="link original"
            {...register("url")}
            placeholder="www.exemplo.com.br"
            errorMessage={errors.url?.message}
          />
          <Input
            label="link encurtado"
            fixedValue="brev.ly/"
            {...register("shortUrl")}
            placeholder="www.exemplo.com.br"
            errorMessage={errors.shortUrl?.message}
          />
        </div>
        <Button disabled={!isValid} type="submit">
          Salvar link
        </Button>
      </form>
    </Card>
  );
}
