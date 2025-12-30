import { Metadata } from "next";
import FilterBar from "./_components/filter-bar";
import HomeMap from "./_components/home-map";
import HomeReports from "./_components/home-reports";
import { getReports } from "@/service/reportsService";

export const metadata: Metadata = {
  title: "FindEra | Lost, Found, Connected.",
};

const Home = async () => {
  const { data } = await getReports(1, 100);

  return (
    <div className="main">
      <FilterBar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <div className="sticky top-0 h-[400px] md:h-[100vh] w-full overflow-hidden">
            <HomeMap position={[-7.803974, 110.370732]} zoom={13} items={data} />
          </div>
        </div>

        <div className="report py-6 px-5">
          <HomeReports />
        </div>
      </div>
    </div>
  );
};

export default Home;
