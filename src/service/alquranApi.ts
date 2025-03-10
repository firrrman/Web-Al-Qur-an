import axios from "axios";
// data surah
export const getSurah = async () => {
  const surah = await axios.get("https://equran.id/api/v2/surat");
  return surah.data.data;
};

// data detail surah
export const getDetailSurah = async (id: number) => {
  const detail = await axios.get(`https://equran.id/api/v2/surat/${id}`);
  return detail.data.data;
};
