import { useParams } from "react-router-dom";
import { getDetailSurah } from "../../service/alquranApi";
import { useState, useEffect } from "react";

export default function Audio() {
  interface audio {
    audioFull: {
      "01": string;
      "02": string;
      "03": string;
      "04": string;
      "05": string;
    };
  }

  const { nomor } = useParams();

  const [audio, setAudio] = useState<audio>();

  useEffect(() => {
    if (nomor) {
      getDetailSurah(parseInt(nomor)).then((response) => {
        setAudio(response);
      });
    }
  }, [nomor]);

  return (
    <div className="w-full mt-5 px-4 lg:w-fit">
      <audio
        src={audio?.audioFull["05"]}
        controls
        className="h-8 sm:h-10 w-full scale-70 md:scale-75 md:px-20 lg:scale-100 lg:px-0 lg:w-100"
      ></audio>
      <div className="w-full flex justify-center">
        <div className="text-[12px] md:text-sm text-center lg:w-100 lg:mt-1 w-fit">
          <p> (Misyari-Rasyid-Al-Afasi)</p>
        </div>
      </div>
    </div>
  );
}
