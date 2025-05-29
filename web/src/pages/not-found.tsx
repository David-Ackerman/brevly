import { Link } from "react-router";
import notFoundImage from "../assets/404.svg";
import { Card } from "../components/card";

export function NotFound() {
  return (
    <Card className="py-16">
      <img src={notFoundImage} alt="404" />
      <h1 className="text-xl text-gray-600 text-center">Link não encontrado</h1>
      <p className="text-md text-gray-500 text-center">
        O link que você está tentando acessar não existe, foi removido ou é uma
        URL inválida. Saiba mais em{" "}
        <Link className="text-blue-base underline" to="/">
          brev.ly
        </Link>
        .
      </p>
    </Card>
  );
}
