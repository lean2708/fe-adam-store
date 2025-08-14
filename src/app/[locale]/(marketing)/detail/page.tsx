import SideCategory from "@/components/templates/(marketing)/detail/SideCategory";
import { ContentCategory } from "@/components/templates/(marketing)/detail/ContentCategory";

export default function AoPoloStore() {
  return (
    <div className="flex w-full">
      <div className="h-full w-[17%]">
        <SideCategory />
      </div>
      <div className="h-full w-[83%] px-5">
        <ContentCategory />
      </div>
    </div>
  );
}
