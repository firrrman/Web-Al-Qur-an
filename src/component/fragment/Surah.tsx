import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDetailSurah } from "../../service/alquranApi";

interface DetailSurah {
  ayat: {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
    audio: string;
  }[];
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
      <div className="mt-8">
        {detailSurah?.ayat?.map((ayat) => (
          <div
            className="w-full flex items-center justify-between py-8"
            key={ayat.nomorAyat}
          >
            <div className="relative">
              <img src="/img/symbol.png" alt="" className="w-10" />
              <p className="absolute top-0 bottom-0 left-0 right-0 text-[8px] text-green-800 font-semibold mb-[2px] flex justify-center items-center">
                {ayat.nomorAyat}
              </p>
            </div>
            <div className="text-right flex-1/2 pl-12 sm:pl-20 lg:pl-72">
              <h1 className="lg:text-2xl">{ayat.teksArab}</h1>
              <p className="text-[12px] lg:text-sm">{ayat.teksIndonesia}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
