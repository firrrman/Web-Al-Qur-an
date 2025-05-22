// Example 2: Using FuzzySearch in DetailSurah.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailSurah } from "../../service/alquranApi";
import FuzzySearch, { SearchType } from "./FuzzySearch";

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

export default function DetailSurah() {
  const { nomor } = useParams();
  const [detailSurah, setDetailSurah] = useState<DetailSurah>();
  const [filteredAyat, setFilteredAyat] = useState<Ayat[]>([]);
  const [currentAyat, setCurrentAyat] = useState<number | null>(null);

  useEffect(() => {
    if (nomor) {
      getDetailSurah(parseInt(nomor)).then((response) => {
        setDetailSurah(response);
        setFilteredAyat(response.ayat); // Initially show all ayat
      });
    }
  }, [nomor]);

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

  // Available search types for the DetailSurah page
  const availableSearchTypes = [
    { value: "arab" as SearchType, label: "Teks Arab" },
    { value: "latin" as SearchType, label: "Teks Latin" },
    { value: "indonesia" as SearchType, label: "Arti Indonesia" },
    { value: "nomor" as SearchType, label: "Nomor Ayat" },
  ];

  // Define how to get searchable fields from an Ayat based on search type
  const getSearchableFields = (
    item: unknown,
    searchType: SearchType
  ): string[] => {
    const ayat = item as Ayat;
    switch (searchType) {
      case "arab":
        return [ayat.teksArab];
      case "latin":
        return [ayat.teksLatin];
      case "indonesia":
        return [ayat.teksIndonesia];
      default:
        return [];
    }
  };

  // Define how to get the identifier for an Ayat
  const getItemIdentifier = (item: unknown): number => {
    const ayat = item as Ayat;
    return ayat.nomorAyat;
  };

  return (
    <div>
      {/* Komponen Pencarian */}
      <div className="mt-6 mb-4">
        {detailSurah?.ayat && (
          <FuzzySearch
            onSearchResults={(results) => setFilteredAyat(results as Ayat[])}
            data={detailSurah.ayat}
            initialSearchType="all"
            availableSearchTypes={availableSearchTypes}
            showThresholdSlider={true}
            initialThreshold={2}
            placeholder="Cari ayat..."
            getSearchableFields={getSearchableFields}
            getItemIdentifier={getItemIdentifier}
          />
        )}

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
