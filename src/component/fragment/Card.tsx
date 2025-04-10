interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti?: string;
}

interface CardProps {
  surah: Surah;
  onClick: () => void;
}

export default function Card({ surah, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer hover:scale-[1.02] transition-transform duration-200"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center pb-1 justify-center w-10 h-10 rounded-full text-[8px] text-green-800 font-semibold relative">
              <img src="/img/symbol.png" alt="" className="absolute" />
              {surah.nomor}
            </div>
            <div className="text-right flex-1 ml-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {surah.namaLatin}
              </h3>
              <p className="text-sm text-gray-500">
                {surah.tempatTurun} • {surah.jumlahAyat} ayat
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <h2 className="text-2xl font-arabic text-right w-full">
              {surah.nama}
            </h2>
          </div>
          {surah.arti && (
            <p className="mt-2 text-sm text-gray-600">"{surah.arti}"</p>
          )}
        </div>
      </div>
    </div>
  );
}
