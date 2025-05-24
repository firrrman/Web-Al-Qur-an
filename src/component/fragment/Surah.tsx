import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailSurah } from "../../service/alquranApi";

interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: {
    "05": string;
  };
}

interface DetailSurah {
  ayat: Ayat[];
}

export default function Surah() {
  const { nomor } = useParams();
  const [detailSurah, setDetailSurah] = useState<DetailSurah>();
  const [filteredAyat, setFilteredAyat] = useState<Ayat[]>([]);
  const [currentAyat, setCurrentAyat] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  useEffect(() => {
    if (nomor) {
      getDetailSurah(parseInt(nomor)).then((response) => {
        setDetailSurah(response);
        setFilteredAyat(response.ayat); // Initially show all ayat
      });
    }
  }, [nomor]);

  useEffect(() => {
    if (!detailSurah?.ayat) return;

    if (!searchQuery.trim()) {
      setFilteredAyat(detailSurah.ayat);
      return;
    }

    const filtered = detailSurah.ayat.filter((ayat) => {
      const query = searchQuery.toLowerCase().trim();

      switch (searchType) {
        case "arab":
          return ayat.teksArab.toLowerCase().includes(query);
        case "latin":
          return ayat.teksLatin.toLowerCase().includes(query);
        case "indonesia":
          return ayat.teksIndonesia.toLowerCase().includes(query);
        case "nomor":
          return ayat.nomorAyat.toString().includes(query);
        default:
          return (
            ayat.teksArab.toLowerCase().includes(query) ||
            ayat.teksLatin.toLowerCase().includes(query) ||
            ayat.teksIndonesia.toLowerCase().includes(query) ||
            ayat.nomorAyat.toString().includes(query)
          );
      }
    });

    setFilteredAyat(filtered);
  }, [searchQuery, searchType, detailSurah]);

  function audioPlay(nomorAyat: number) {
    const audioElement = document.getElementById(
      `audioAyat-${nomorAyat}`
    ) as HTMLAudioElement;
    if (audioElement) {
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

  const searchOptions = [
    { value: "arab", label: "Teks Arab" },
    { value: "latin", label: "Teks Latin" },
    { value: "indonesia", label: "Arti Indonesia" },
    { value: "nomor", label: "Nomor Ayat" },
  ];

  return (
    <div>
      {/* Komponen Pencarian */}
      <div className="mt-6 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              {searchOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari ayat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredAyat && (
          <p className="mt-2 text-sm text-green-700">
            {filteredAyat.length} ayat ditemukan
          </p>
        )}
      </div>

      {/* Daftar Ayat */}
      <div className="mt-8">
        {filteredAyat?.length > 0 ? (
          filteredAyat.map((ayat) => (
            <div
              className="w-full flex items-center justify-between py-10 border-b border-green-100"
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
                <h1 className="text-2xl md:text-3xl lg:text-4xl group-hover:text-green-900">
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
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-green-800">Tidak ada ayat yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
