import DetailDescripsi from "../component/fragment/DetailDescripsi";
import Surah from "../component/fragment/Surah";
import SurahSebelumSesudah from "../component/fragment/SurahSebelumSesudah";

export default function DetailSurah() {
  return (
    <div className="px-10 pb-24">
      {/* deskripsi */}
      <DetailDescripsi />

      {/* surah */}
      <Surah />

      {/* surah sebelum dan sesudah */}
      <SurahSebelumSesudah />
    </div>
  );
}
