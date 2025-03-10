import { useState, useEffect } from "react";
import { getSurah } from "../../service/alquranApi";

export default function Card() {
  interface Surah {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    tempatTurun: string;
  }

  const [surah, setSurah] = useState<Surah[]>([]);
  useEffect(() => {
    getSurah().then((respon) => {
      console.log(respon);
      setSurah(respon);
    });
  }, []);

  console.log(surah);

  return surah.map((item) => (
    <a
      href={`/${item.nomor}`}
      className="p-4 w-full shadow-sm bg-white shadow-gray-400 flex justify-between items-center text-sm hover:scale-105 transition-transform duration-300"
      key={item.nomor}
    >
      <div className="flex gap-2 items-center">
        <div className="relative"
        >
          <img src="/img/symbol.png" alt="" className="w-10"/>
          <p className="absolute top-0 bottom-0 left-0 right-0 text-[8px] text-green-800 font-semibold mb-[2px] flex justify-center items-center">{item.nomor}</p>
        </div>
        <div>
          <h1>{item.namaLatin}</h1>
          <p className="text-[10px] mb-1 text-green-800">
            {item.tempatTurun} | {item.jumlahAyat}
          </p>
        </div>
      </div>
      <h1>{item.nama}</h1>
    </a>
  ));
}
