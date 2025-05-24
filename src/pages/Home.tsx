import { useState, useEffect } from "react";
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

type SearchType = "nama" | "nomor";

function levenshteinDistance(a: string, b: string): number {
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

function fuzzyMatch(
  text: string,
  query: string,
  threshold: number = 0
): boolean {
  if (query.trim() === "") return true;
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  if (textLower.includes(queryLower)) return true;
  if (queryLower.length > textLower.length + threshold) return false;
  if (textLower.length <= threshold || queryLower.length <= threshold) {
    return levenshteinDistance(textLower, queryLower) <= threshold;
  }
  const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 0);
  const textWords = textLower.split(/\s+/).filter((word) => word.length > 0);
  return queryWords.some((qWord) =>
    textWords.some((tWord) => {
      if (qWord.length <= threshold) {
        return (
          tWord.includes(qWord) ||
          levenshteinDistance(tWord, qWord) <= threshold
        );
      }
      return levenshteinDistance(tWord, qWord) <= threshold;
    })
  );
}

export default function Home() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Search related states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("nama");
  const [numberInput, setNumberInput] = useState("");
  const [fuzzyThreshold, setFuzzyThreshold] = useState(0);

  // Fetch surah data
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setIsLoading(true);
        const data = await getSurah();
        setSurahs(data);
        setFilteredSurahs(data); // Initially show all surahs
      } catch (error) {
        console.error("Error fetching surahs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  const handleCardClick = (nomor: number) => {
    navigate(`/surah/${nomor}`);
  };

  // Available search types for the Home page
  const availableSearchTypes = [
    { value: "nama" as SearchType, label: "Nama Surah" },
    { value: "nomor" as SearchType, label: "Nomor Surah" },
  ];

  // Define how to get searchable fields from a Surah based on search type
  const getSearchableFields = (
    item: Surah,
    searchType: SearchType
  ): string[] => {
    if (searchType === "nama") {
      return [item.namaLatin, item.nama, item.arti];
    }
    return [];
  };

  const handleSearch = () => {
    let results: Surah[] = [];
    if (searchType === "nomor") {
      if (numberInput.trim() === "") {
        results = surahs;
      } else {
        results = surahs.filter((item) => {
          const identifier = item.nomor.toString();
          return identifier === numberInput.trim();
        });
      }
    } else {
      if (searchTerm.trim() === "") {
        results = surahs;
      } else {
        results = surahs.filter((item) => {
          const fieldsToSearch = getSearchableFields(item, searchType);
          return fieldsToSearch.some((field) =>
            fuzzyMatch(field, searchTerm, fuzzyThreshold)
          );
        });
      }
    }
    setFilteredSurahs(results);
    return results;
  };

  useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, numberInput, searchType, fuzzyThreshold, surahs]);

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberInput(e.target.value);
  };

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSearchType = e.target.value as SearchType;
    setSearchType(newSearchType);
    if (newSearchType === "nomor") {
      setSearchTerm("");
    } else {
      setNumberInput("");
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
        <div className="w-full bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {availableSearchTypes.length > 0 && (
              <div className="w-full md:w-48">
                <select
                  value={searchType}
                  onChange={handleSearchTypeChange}
                  className="w-full p-2 border bg-white border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {availableSearchTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex-grow">
              {searchType === "nomor" ? (
                <input
                  type="number"
                  placeholder="Masukkan nomor..."
                  value={numberInput}
                  onChange={handleNumberInputChange}
                  className="w-full p-2 bg-white border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <input
                  type="text"
                  placeholder="Cari nama surah..."
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  className="w-full p-2 bg-white border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              )}
            </div>
          </div>
          {searchType !== "nomor" && (
            <div className="bg-gray-50 p-3 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tingkat Toleransi Kesalahan: {fuzzyThreshold}
              </label>
              <input
                type="range"
                min="0"
                max="3"
                value={fuzzyThreshold}
                onChange={handleThresholdChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Ketat (0)</span>
                <span>Longgar (3)</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Nilai 0 = pencarian harus persis sama, Nilai 3 = toleransi
                kesalahan tinggi. Semakin tinggi nilai, semakin banyak hasil
                yang mirip akan ditemukan.
              </p>
            </div>
          )}
        </div>

        {filteredSurahs.length > 0 && (
          <p className="mt-2 text-sm text-green-700">
            {filteredSurahs.length} surah ditemukan
          </p>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 px-4 md:px-8 lg:px-16 rounded-t-4xl bg-white -mt-5 w-full">
        {isLoading ? (
          <div className="mt-10 text-center text-gray-500">Memuat data...</div>
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
    </div>
  );
}
