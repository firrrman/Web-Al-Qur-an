import { Link, useParams } from "react-router-dom";
import { getDetailSurah } from "../../service/alquranApi";
import { useState, useEffect } from "react";

export default function BeforeAfter() {
  interface DetailSurah {
    nomor: number;

    suratSebelumnya: {
      namaLatin: string;
    };

    suratSelanjutnya: {
      namaLatin: string;
    };
  }

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

  const sebelumnya: number | undefined = detailSurah?.nomor
    ? detailSurah.nomor === 1
      ? detailSurah.nomor - 0
      : detailSurah.nomor - 1
    : undefined;

  const selanjutnya: number | undefined | void = detailSurah?.nomor
    ? detailSurah.nomor === 114
      ? detailSurah.nomor + 0
      : detailSurah.nomor + 1
    : undefined;

  return (
    <div className="fixed bottom-0 right-0 left-0 bg-white p-5 md:p-7 px-10 lg:px-16 md:px-10 border-t-2 border-gray-500 flex justify-between items-center rounded-t-3xl">
      <div className="flex items-center gap-2">
        <Link to={`/${sebelumnya}`}>
          <img src="/img/left-arrow.png" className="w-7 lg:w-10" alt="" />
        </Link>
        <p className="mb-1 font-semibold text-sm">
          {detailSurah?.suratSebelumnya.namaLatin}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <p className="mb-1 font-semibold text-sm">
          {detailSurah?.suratSelanjutnya.namaLatin}
        </p>
        <Link to={`/${selanjutnya}`}>
          <img
            src="/img/left-arrow.png"
            className="w-7 rotate-180 lg:w-10"
            alt=""
          />
        </Link>
      </div>
    </div>
  );
}
