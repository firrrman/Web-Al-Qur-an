import DetailDescripsi from "../component/fragment/DetailDescripsi";
import Surah from "../component/fragment/Surah";
import SurahSebelumSesudah from "../component/fragment/SurahSebelumSesudah";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDetailSurah } from "../service/alquranApi";

interface DetailSurah {
  nama: string;
  arti: string;
  namaLatin: string;
  jumlahAyat: string;
  tempatTurun: string;
  ayat: {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
    audio: {
      "05": string;
    };
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
    <div className="px-10 pb-24 lg:px-16">
      {/* deskripsi */}
      <DetailDescripsi
        nama={`${detailSurah?.nama}`}
        arti={`${detailSurah?.arti}`}
        namaLatin={`${detailSurah?.namaLatin}`}
        jumlahAyat={`${detailSurah?.jumlahAyat}`}
        tempatTurun={`${detailSurah?.tempatTurun}`}
      />

      {/* surah */}
      <Surah />

      {/* surah sebelum dan sesudah */}
      <SurahSebelumSesudah />
    </div>
  );
}
