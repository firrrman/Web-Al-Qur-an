import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
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

// Fungsi Levenshtein Distance untuk fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Calculate distances
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[b.length][a.length];
}

// Fungsi fuzzy match dengan threshold
function fuzzyMatch(
  text: string,
  query: string,
  threshold: number = 3
): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match
  if (textLower.includes(queryLower)) return true;

  // Split query into words
  const queryWords = queryLower.split(/\s+/);
  const textWords = textLower.split(/\s+/);

  // Check if any query word is similar to any text word
  return queryWords.some((qWord) =>
    textWords.some((tWord) => levenshteinDistance(qWord, tWord) <= threshold)
  );
}

export default function DetailSurah() {
  const { nomor } = useParams();
  const [detailSurah, setDetailSurah] = useState<DetailSurah>();
  const [currentAyat, setCurrentAyat] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("all");
  const [ayatNumber, setAyatNumber] = useState<string>("");
  const [fuzzyThreshold, setFuzzyThreshold] = useState<number>(2);

  // Filter ayat dengan fuzzy search
  const filteredAyat = useMemo(() => {
    if (!detailSurah?.ayat) return [];

    // Pencarian berdasarkan nomor ayat (exact match)
    if (searchType === "nomor") {
      if (ayatNumber.trim() === "") return detailSurah.ayat;
      return detailSurah.ayat.filter(
        (ayat) => ayat.nomorAyat.toString() === ayatNumber.trim()
      );
    }

    // Pencarian fuzzy jika ada query
    if (searchQuery.trim() === "") return detailSurah.ayat;

    return detailSurah.ayat.filter((ayat) => {
      if (searchType === "arab" || searchType === "all") {
        if (fuzzyMatch(ayat.teksArab, searchQuery, fuzzyThreshold)) return true;
      }

      if (searchType === "latin" || searchType === "all") {
        if (fuzzyMatch(ayat.teksLatin, searchQuery, fuzzyThreshold))
          return true;
      }

      if (searchType === "indonesia" || searchType === "all") {
        if (fuzzyMatch(ayat.teksIndonesia, searchQuery, fuzzyThreshold))
          return true;
      }

      return false;
    });
  }, [detailSurah, searchQuery, searchType, ayatNumber, fuzzyThreshold]);

  useEffect(() => {
    if (nomor) {
      getDetailSurah(parseInt(nomor)).then((response) => {
        setDetailSurah(response);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAyatNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAyatNumber(e.target.value);
  };

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value);
    if (e.target.value === "nomor") {
      setSearchQuery("");
    } else {
      setAyatNumber("");
    }
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFuzzyThreshold(parseInt(e.target.value));
  };

  return (
    <div>
      {/* Komponen Pencarian dengan Fuzzy Options */}
      <div className="mt-6 mb-4 p-4 bg-green-100 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-48">
            <select
              value={searchType}
              onChange={handleSearchTypeChange}
              className="w-full p-2 border bg-white border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="arab">Teks Arab</option>
              <option value="latin">Teks Latin</option>
              <option value="indonesia">Terjemahan Indonesia</option>
              <option value="nomor">Nomor Ayat</option>
            </select>
          </div>

          <div className="flex-grow">
            {searchType === "nomor" ? (
              <input
                type="number"
                placeholder="Masukkan nomor ayat..."
                value={ayatNumber}
                onChange={handleAyatNumberChange}
                min="1"
                className="w-full p-2 bg-white border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <input
                type="text"
                placeholder="Cari ayat..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-2 bg-white border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            )}
          </div>
        </div>

        {/* Fuzzy Search Options */}
        {searchType !== "nomor" && (
          <div className="bg-white p-3 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tingkat Toleransi Kesalahan: {fuzzyThreshold}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={fuzzyThreshold}
              onChange={handleThresholdChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Ketat</span>
              <span>Longgar</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Semakin tinggi nilai, semakin banyak hasil yang mirip akan
              ditemukan
            </p>
          </div>
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
