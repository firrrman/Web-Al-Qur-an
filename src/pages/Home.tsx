import Header from "../component/fragment/Header";
import Card from "../component/fragment/Card";
import "../App.css";
import HeroSection from "../component/fragment/HeroSection";

export default function Home() {
  return (
    <div className="relative pb-10">
      {/* header */}
      <Header className={"bg-transparent"} />

      {/* hero section */}
      <HeroSection />

      {/* content */}
      <div className="relative z-10 p-4 px-8 lg:px-10 rounded-t-4xl bg-white -mt-10 w-full">

        {/* card */}
        <div className="mt-10 grid gap-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 group">
          <Card />
        </div>
      </div>
    </div>
  );
}
