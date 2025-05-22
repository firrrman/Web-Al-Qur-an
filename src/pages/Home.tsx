// Example 1: Using FuzzySearch in Home.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/fragment/Header";
import Card from "../component/fragment/Card";
import "../App.css";
import HeroSection from "../component/fragment/HeroSection";
import { getSurah } from "../service/alquranApi";
import FuzzySearch, { SearchType } from "../component/fragment/FuzzySearch";

interface Surah {
  nomor: number;
  namaLatin: string;
  nama: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
}

export default function Home() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
    item: unknown,
    searchType: SearchType
  ): string[] => {
    const surah = item as Surah;
    if (searchType === "nama") {
      return [surah.namaLatin, surah.nama, surah.arti];
    }
    return [];
  };

  // Define how to get the identifier for a Surah
  const getItemIdentifier = (item: unknown): number => {
    const surah = item as Surah;
    return surah.nomor;
  };

  return (
    <div className="relative pb-10 min-h-screen bg-gray-50">
      <Header className="bg-transparent" />
      <HeroSection />

      {/* Search Bar */}
      <div className="relative z-20 px-4 md:px-8 lg:px-16 -mt-8">
        <FuzzySearch
          onSearchResults={(results) => setFilteredSurahs(results as Surah[])}
          data={surahs}
          initialSearchType="nama"
          availableSearchTypes={availableSearchTypes}
          showThresholdSlider={true}
          initialThreshold={0}
          placeholder="Cari nama surah..."
          getSearchableFields={getSearchableFields}
          getItemIdentifier={getItemIdentifier}
        />

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
