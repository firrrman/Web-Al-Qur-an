import RotatingText from "../template/RotatingText";

export default function HeroSection() {
  return (
    <div className=" top-0 h-[450px] w-full relative">
      <img
        src="/img/background.jpg"
        alt=""
        className="w-full h-full object-cover object-bottom filter brightness-40"
      />

      <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center text-white gap-2 text-3xl sm:text-4xl lg:text-5xl">
        <h1 className="font-semibold">Al-Qur'an</h1>
        <RotatingText
          texts={["30 Juz", "114 Surah", "6.236 Ayat"]}
          mainClassName="px-2 font-semibold shadow-sm shadow-black text-white sm:px-2 md:px-3 bg-green-800 overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
          staggerFrom={"last"}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          rotationInterval={4000}
        />
      </div>
    </div>
  );
}
