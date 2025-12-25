import { Clock, TrendingUp, Users } from "lucide-react";
import FilterBar from "./_components/filter-bar";
import ItemsCard from "./_components/items-card";
import PaginationUi from "@/components/shared/pagination-data";
import { Metadata } from "next";
import HomeMap from "./_components/home-map";

export const metadata: Metadata = {
  title: "FindEra | Lost, Found, Connected."
};  

export default function Home() {
  return (
    <div className="main">
      <FilterBar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <div className="sticky top-0 h-[400px] md:h-[100vh] w-full overflow-hidden">
            <HomeMap position={[-6.200000, 106.816666]} zoom={13} />
          </div>
        </div>
        <div className="report py-6 px-5">
          <div className="grid justify-center grid-cols-1 md:grid-cols-3 gap-4 mb-7">
            <div className="report_count relative">
              <div className="flex justify-between gap-4 rounded-[10px] shadow-sm px-4 py-4 bg-[#EEF3FF] transition-all duration-200 hover:scale-105 hover:shadow-md">
                <div className="data">
                  <span className="text-gray-500 text-[14px]">Total Laporan</span>
                  <h5 className="text-blue-500 text-[16px]">6</h5>
                </div>
                <div className="icon">
                  <div className="rounded-[10px] bg-primary p-3">
                    <TrendingUp className="text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="missing_items relative">
              <div className="flex justify-between gap-4 rounded-[10px] shadow-sm px-4 py-4 bg-[#FFF2F3] transition-all duration-200 hover:scale-105 hover:shadow-md">
                <div className="data">
                  <span className="text-gray-500 text-[14px]">Barang Hilang</span>
                  <h5 className="text-red-500 text-[16px]">6</h5>
                </div>
                <div className="icon">
                  <div className="rounded-[10px] bg-red-500 p-3">
                    <Clock className="text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="founded_items relative">
              <div className="flex justify-between gap-4 rounded-[10px] shadow-sm px-4 py-4 bg-[#EFFDF4] transition-all duration-200 hover:scale-105 hover:shadow-md">
                <div className="data">
                  <span className="text-gray-500 text-[14px]">Hasil Temuan</span>
                  <h5 className="text-red-500 text-[16px]">6</h5>
                </div>
                <div className="icon">
                  <div className="rounded-[10px] bg-green-500 p-3">
                    <Users className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="report_head mb-7">
            <div className="flex justify-between border shadow-sm rounded-[10px] px-4 py-3">
              <div className="section-title">
                  <h3 className="heading font-medium text-[18px] mb-2">Daftar Laporan</h3>
                  <p className="subheading text-gray-600 text-[15px] flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50 animate-[pulse_1.5s_ease-in-out_infinite]"></span>Live Update
                  </p>
              </div>
              <div className="item_count flex justify-center items-center">
                <span className="bg-[#EEF3FF] rounded-[15px] py-2 px-3 text-primary text-[14px]">6 Items</span>
              </div>
            </div>
          </div>

          <div className="list_item grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ItemsCard key={i} />
            ))}
          </div>
          <div className="pagination my-8">
            <PaginationUi />
          </div>
        </div>
      </div>
    </div>
  );
}
