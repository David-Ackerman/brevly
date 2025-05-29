import { useParams } from "react-router";
import { Card } from "../components/card";
import brevlyIcon from "../assets/brevly-icon.svg";
import { useQuery } from "@tanstack/react-query";
import { accessShortenUrl } from "../api/access-shorten-url";
import { useEffect } from "react";

export function Redirect() {
  const params = useParams();
  const { shortenedUrl } = params;
  const { data, isSuccess } = useQuery({
    queryKey: ["redirect"],
    queryFn: () => {
      return accessShortenUrl(shortenedUrl || "");
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      window.location.href = data.url;
    }
  }, [data, isSuccess]);

  return (
    <Card>
      <img src={brevlyIcon} alt="404" />
      <h1 className="text-xl text-gray-600 text-center">Redirecionando...</h1>
      <p className="text-md text-gray-500 text-center">
        O link será aberto automaticamente em alguns instantes. Não foi
        redirecionado?{" "}
        <a className="text-blue-base underline" href={data?.url}>
          Acesse aqui
        </a>
      </p>
    </Card>
  );
}
