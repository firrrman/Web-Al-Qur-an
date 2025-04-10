import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/fragment/Header";
import Card from "../component/fragment/Card";
import "../App.css";
import HeroSection from "../component/fragment/HeroSection";
import { getSurah } from "../service/alquranApi";

interface Surah {
  nomor: number;
  namaLatin: string;
  nama: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
}

// Fungsi Levenshtein Distance untuk fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}

// Fungsi fuzzy match dengan threshold
function fuzzyMatch(
  text: string,
  query: string,
  threshold: number = 2
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

export default function Home() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"nama" | "nomor" | "ayat">(
    "nama"
  );
  const [nomorSurah, setNomorSurah] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fuzzyThreshold, setFuzzyThreshold] = useState(2);
  const navigate = useNavigate();

  // Ambil data surah
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setIsLoading(true);
        const data = await getSurah();
        setSurahs(data);
      } catch (error) {
        console.error("Error fetching surahs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  // Filter surah dengan fuzzy search
  const filteredSurahs = useMemo(() => {
    if (!surahs.length) return [];

    // Pencarian berdasarkan nomor surah (exact match)
    if (searchType === "nomor") {
      if (nomorSurah.trim() === "") return surahs;
      return surahs.filter(
        (surah) => surah.nomor.toString() === nomorSurah.trim()
      );
    }

    // Pencarian fuzzy jika ada query
    if (searchTerm.trim() === "") return surahs;

    return surahs.filter((surah) => {
      if (searchType === "nama") {
        return (
          fuzzyMatch(surah.namaLatin, searchTerm, fuzzyThreshold) ||
          fuzzyMatch(surah.nama, searchTerm, fuzzyThreshold)
        );
      }
      return false;
    });
  }, [surahs, searchTerm, searchType, nomorSurah, fuzzyThreshold]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "nama" | "nomor" | "ayat";
    setSearchType(value);
    if (value !== "nomor") setNomorSurah("");
    if (value !== "ayat") setSearchTerm("");
  };

  const handleNomorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 1 && Number(value) <= 114)) {
      setNomorSurah(value);
    }
  };

  const handleCardClick = (nomor: number) => {
    navigate(`/surah/${nomor}`);
  };

  const handleAyatSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search-ayat?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFuzzyThreshold(parseInt(e.target.value));
  };

  return (
    <div className="relative pb-10 min-h-screen bg-gray-50">
      <Header className="bg-transparent" />
      <HeroSection />

      {/* Search Bar */}
      <div className="relative z-20 px-4 md:px-8 lg:px-16 -mt-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-48">
              <select
                value={searchType}
                onChange={handleSearchTypeChange}
                className="w-full p-2 border bg-white border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="nama">Nama Surah</option>
                <option value="nomor">Nomor Surah</option>
              </select>
            </div>

            <div className="flex-grow flex">
              {searchType === "nomor" ? (
                <input
                  type="number"
                  placeholder="Masukkan nomor surah (1-114)..."
                  value={nomorSurah}
                  onChange={handleNomorChange}
                  min="1"
                  max="114"
                  className="w-full p-2 bg-white border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <input
                  type="text"
                  placeholder={
                    searchType === "nama"
                      ? "Cari nama surah..."
                      : "Cari ayat (akan membuka halaman baru)..."
                  }
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full p-2 bg-white border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              )}
              {searchType === "ayat" && (
                <button
                  onClick={handleAyatSearch}
                  disabled={!searchTerm.trim()}
                  className="ml-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Cari
                </button>
              )}
            </div>
          </div>

          {/* Fuzzy Search Options (hanya muncul saat pencarian nama surah) */}
          {searchType === "nama" && (
            <div className="bg-gray-50 p-3 rounded-md">
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

          {(searchTerm || nomorSurah) && searchType !== "ayat" && (
            <p className="mt-2 text-sm text-green-700">
              {filteredSurahs.length} surah ditemukan
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      {searchType !== "ayat" && (
        <div className="relative z-10 p-4 px-4 md:px-8 lg:px-16 rounded-t-4xl bg-white -mt-5 w-full">
          {isLoading ? (
            <div className="mt-10 text-center text-gray-500">
              Memuat data...
            </div>
          ) : filteredSurahs.length === 0 ? (
            <div className="mt-10 text-center text-gray-500">
              Tidak ditemukan surah yang sesuai dengan pencarian Anda.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSurahs.map((surah) => (
                <Card
                  key={surah.nomor}
                  surah={surah}
                  onClick={() => handleCardClick(surah.nomor)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
