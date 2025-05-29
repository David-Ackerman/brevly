import { Card } from "../components/card";
import { Button } from "../components/ui/button";
import brevly from "../assets/brevly.svg";
import {
  DownloadSimpleIcon,
  LinkIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { getLinks } from "../api/get-links";
import { LinkItem } from "../components/link-item";
import { RegisterLink } from "../components/register-link";
import { downloadUrl } from "@/utils/download-url";
import { api } from "@/lib/axios";

function App() {
  const { data, isLoading } = useQuery({
    queryKey: ["links"],
    queryFn: getLinks,
  });

  async function downloadCSV() {
    const { data } = await api.post<{ reportUrl: string }>(
      "/links/exports",
      {}
    );
    downloadUrl(data.reportUrl);
  }
  return (
    <main className="@container mx-auto w-full max-w-[980px] space-y-8">
      <div>
        <img src={brevly} alt="Brevly" className="h-6" />
      </div>
      <div className="flex flex-col gap-5 @3xl:flex-row ">
        <RegisterLink />
        <Card className="w-full items-start">
          <header className="flex items-center justify-between w-full">
            <h2 className="text-lg text-gray-600">Meus links</h2>
            <Button variant="secondary" onClick={downloadCSV}>
              <DownloadSimpleIcon className="size-4" /> Baixar CSV
            </Button>
          </header>
          <div className="flex flex-col gap-4 w-full">
            {isLoading ? (
              <>
                <hr className="bg-gray-200 h-px w-full border-none" />
                <div className="flex flex-col items-center justify-center gap-3 w-full pt-4 pb-6">
                  <SpinnerGapIcon className="w-7 h-6 text-gray-500 animate-spin" />
                  <p className="text-xs uppercase text-gray-500 text-center">
                    Carregando Links
                  </p>
                </div>
              </>
            ) : (
              <>
                {data && data.shortenedUrls.length > 0 ? (
                  data.shortenedUrls.map((link) => (
                    <>
                      <hr className="bg-gray-200 h-px w-full border-none" />
                      <LinkItem {...link} />
                    </>
                  ))
                ) : (
                  <>
                    <hr className="bg-gray-200 h-px w-full border-none" />
                    <div className="flex flex-col items-center justify-center gap-3 w-full pt-4 pb-6">
                      <LinkIcon className="w-7 h-6 text-gray-500" />
                      <p className="text-xs uppercase text-gray-500 text-center">
                        Ainda não existem links cadastrados
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}

export default App;
