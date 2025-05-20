import { useParams } from "react-router";

export function Redirect() {
  const params = useParams();
  console.log(params);
  return (
    <div className="flex flex-col items-center gap-6 px-12 py-16 mx-auto w-full max-w-[580px] bg-gray-100 rounded-lg">
      <h1 className="text-xl text-gray-600 text-center">Redirecionando...</h1>
      <p className="text-md text-gray-500">
        Você será redirecionado para o link encurtado em{" "}
        <span className="font-bold">5 segundos</span>.
      </p>
    </div>
  );
}
