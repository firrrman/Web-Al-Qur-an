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
  const [detailSurah, setDetailSurah] = useState<DetailSurah | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (nomor) {
      setLoading(true);
      setDetailSurah(null); // Reset state saat berganti surah

      getDetailSurah(parseInt(nomor))
        .then((response) => {
          setDetailSurah(response);
        })
        .catch((err) => {
          console.error("Error fetching surah detail:", err);
          setError("Gagal memuat detail surah");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [nomor]);

  console.log(detailSurah);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4">Memuat detail surah...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <p>{error}</p>
        <button
          className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // Jangan render komponen jika data belum tersedia
  if (!detailSurah) {
    return null;
  }

  return (
    <div className="px-10 pb-24 lg:px-16">
      {/* deskripsi */}
      <DetailDescripsi
        nama={detailSurah.nama}
        arti={detailSurah.arti}
        namaLatin={detailSurah.namaLatin}
        jumlahAyat={detailSurah.jumlahAyat}
        tempatTurun={detailSurah.tempatTurun}
      />

      {/* surah */}
      <Surah />

      {/* surah sebelum dan sesudah */}
      <SurahSebelumSesudah />
    </div>
  );
}
