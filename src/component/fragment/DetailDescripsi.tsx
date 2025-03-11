import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDetailSurah } from "../../service/alquranApi";
import Audio from "../element/AudioFull";

interface DetailSurah {
  nama: string;
  arti: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
}

export default function DetailSurah() {
  const { nomor } = useParams();

  const [detailSurah, setDetailSurah] = useState<DetailSurah>();

  useEffect(() => {
    if (nomor) {
      getDetailSurah(parseInt(nomor)).then((response) => {
        setDetailSurah(response);
      });
    }
  }, [nomor]);

  console.log(detailSurah);

  return (
    <div>
      <div className="pt-10 flex items-center gap-5 font-semibold text-green-800">
        {/* untuk kembali ke home */}
        <a href="/" className="text-4xl font-bold mb-2">
          ←
        </a>

        <h1 className="md:text-lg lg:text-xl">{detailSurah?.namaLatin}</h1>
      </div>

      {/* deskripsi singkat */}
      <div className="h-80 mt-8 relative bg-black rounded-3xl overflow-hidden">
        <img
          src="/img/background.jpg"
          alt=""
          className="object-cover w-full h-full object-bottom"
        />

        <div className="absolute top-0 bottom-0 left-0 right-0 bg-green-800 opacity-80 filter brightness-50"></div>

        <div className="absolute top-0 bottom-0 left-0 right-0 text-white flex flex-col lg:flex-row lg:justify-between justify-center items-center gap-3 lg:p-20">
          <div className="flex flex-col justify-center items-center lg:items-start gap-1 lg:gap-7">
            <h1 className="text-4xl md:text-5xl lg:text-8xl xl:text-9xl">
              {detailSurah?.nama}
            </h1>
            <h1 className="md:text-xl lg:text-2xl">{detailSurah?.arti}</h1>
            <div className="border-t-[1px] opacity-50 w-full lg:hidden"></div>
            <p className="text-[12px] md:text-sm">
              {detailSurah?.tempatTurun} | {detailSurah?.jumlahAyat} Ayat
            </p>
          </div>

          {/* audio abdullah al juhany */}
          <Audio />
        </div>
      </div>
    </div>
  );
}
