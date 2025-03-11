import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDetailSurah } from "../../service/alquranApi";

interface DetailSurah {
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

  // Menambahkan state untuk melacak ayat yang sedang diputar
  const [currentAyat, setCurrentAyat] = useState<number | null>(null);

  function audioPlay(nomorAyat: number) {
    const audioElement = document.getElementById(
      `audioAyat-${nomorAyat}`
    ) as HTMLAudioElement;
    if (audioElement) {
      // Menghentikan audio yang sedang diputar jika ada
      if (currentAyat !== null && currentAyat !== nomorAyat) {
        const prevAudio = document.getElementById(
          `audioAyat-${currentAyat}`
        ) as HTMLAudioElement;
        if (prevAudio) {
          prevAudio.pause();
          prevAudio.currentTime = 0;
        }
      }
      audioElement.play();
      setCurrentAyat(nomorAyat);
    }
  }

  return (
    <div>
      <div className="mt-8">
        {detailSurah?.ayat?.map((ayat) => (
          <div
            className="w-full flex items-center justify-between py-10"
            key={ayat.nomorAyat}
          >
            <div className="relative">
              <img src="/img/symbol.png" alt="" className="w-10" />
              <p className="absolute top-0 bottom-0 left-0 right-0 text-[8px] text-green-800 font-semibold flex justify-center items-center">
                {ayat.nomorAyat}
              </p>
            </div>
            <div
              className="text-right flex-1/2 pl-12 sm:pl-20 lg:pl-72 cursor-pointer group flex flex-col gap-5"
              onClick={() => audioPlay(ayat.nomorAyat)}
            >
              <h1 className="text-xl md:text-2xl lg:text-3xl group-hover:text-green-900 ">
                {ayat.teksArab}
              </h1>
              <p className="text-[12px] md:text-[13px] lg:text-[15px] group-hover:text-green-900 text-green-800">
                {ayat.teksLatin}
              </p>
              <p className="text-[12px] md:text-[13px] lg:text-[15px] group-hover:text-green-900">
                {ayat.teksIndonesia}
              </p>
              <audio
                src={ayat.audio?.["05"]}
                id={`audioAyat-${ayat.nomorAyat}`}
              ></audio>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
