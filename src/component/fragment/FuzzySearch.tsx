import React, { useState } from "react";

/**
 * Calculates the Levenshtein distance between two strings.
 */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = Array(b.length + 1)
    .fill(null)
    .map((_, i) => [i]);

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

/**
 * Performs fuzzy matching between a text and a query.
 */
function fuzzyMatch(
  text: string,
  query: string,
  threshold: number = 2,
): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match
  if (textLower.includes(queryLower)) return true;

  // Split query into words
  const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 0);
  const textWords = textLower.split(/\s+/).filter((word) => word.length > 0);

  // Check if any query word is similar to any text word
  return queryWords.some((qWord) =>
    textWords.some((tWord) => levenshteinDistance(qWord, tWord) <= threshold)
  );
}

// Search type options
export type SearchType =
  | "nama"
  | "nomor"
  | "ayat"
  | "arab"
  | "latin"
  | "indonesia"
  | "all";

// Props for the FuzzySearch component
interface FuzzySearchProps {
  // Required props
  onSearchResults: (results: unknown[]) => void;
  data: unknown[];

  // Optional props with defaults
  initialSearchType?: SearchType;
  availableSearchTypes?: Array<{
    value: SearchType;
    label: string;
  }>;
  showThresholdSlider?: boolean;
  initialThreshold?: number;
  placeholder?: string;

  // Field mapping functions
  getSearchableFields: (item: unknown, searchType: SearchType) => string[];
  getItemIdentifier: (item: unknown) => string | number;
}

const FuzzySearch: React.FC<FuzzySearchProps> = ({
  onSearchResults,
  data,
  initialSearchType = "nama",
  availableSearchTypes = [],
  showThresholdSlider = true,
  initialThreshold = 2,
  placeholder = "Cari...",
  getSearchableFields,
  getItemIdentifier,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>(initialSearchType);
  const [numberInput, setNumberInput] = useState("");
  const [fuzzyThreshold, setFuzzyThreshold] = useState(initialThreshold);

  // Filter data based on search criteria
  const handleSearch = () => {
    let results: unknown[] = [];

    if (searchType === "nomor") {
      // For number searches, perform exact match
      if (numberInput.trim() === "") {
        results = data;
      } else {
        results = data.filter((item) => {
          const identifier = getItemIdentifier(item).toString();
          return identifier === numberInput.trim();
        });
      }
    } else {
      // For text searches, perform fuzzy match
      if (searchTerm.trim() === "") {
        results = data;
      } else {
        results = data.filter((item) => {
          const fieldsToSearch = getSearchableFields(item, searchType);
          return fieldsToSearch.some((field) =>
            fuzzyMatch(field, searchTerm, fuzzyThreshold)
          );
        });
      }
    }

    onSearchResults(results);
    return results;
  };

  // Update search results whenever search parameters change
  React.useEffect(() => {
    handleSearch();
  },);

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberInput(e.target.value);
  };

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSearchType = e.target.value as SearchType;
    setSearchType(newSearchType);

    // Reset inputs when changing search type
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
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search Type Selector */}
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

        {/* Search Input Field */}
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
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleSearchTermChange}
              className="w-full p-2 bg-white border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          )}
        </div>
      </div>

      {/* Fuzzy Search Threshold Slider */}
      {showThresholdSlider && searchType !== "nomor" && (
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
            <span>Ketat</span>
            <span>Longgar</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Semakin tinggi nilai, semakin banyak hasil yang mirip akan ditemukan
          </p>
        </div>
      )}
    </div>
  );
};

export default FuzzySearch;
