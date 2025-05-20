import { Link } from "react-router";
import notFoundImage from "../assets/404.svg";

export function NotFound() {
  return (
    <div className="flex flex-col items-center gap-6 px-12 py-16 mx-auto w-full max-w-[580px]  bg-gray-100 rounded-lg">
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
    </div>
  );
}
