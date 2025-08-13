import Pagination from "@/components/templates/(marketing)/detail/Pagination";
import Products from "@/components/templates/(marketing)/detail/Products";
import Header from "@/components/templates/(marketing)/detail/Header";
import SideCategory from "@/components/templates/(marketing)/detail/SideCategory";
import { ContentCategory } from "@/components/templates/(marketing)/detail/ContentCategory";

export default function AoPoloStore() {
  return (
    <div className="flex w-full">
      <div className="h-full w-[15%] border-r-1 border-gray-400">
        <SideCategory />
      </div>
      <div className="h-full w-[85%] px-5">
        <ContentCategory />
      </div>
    </div>
  );
}
