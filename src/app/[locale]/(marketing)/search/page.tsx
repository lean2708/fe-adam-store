import ContentSearch from "@/components/templates/(marketing)/search/ContentSearch";
import { HeaderSearch } from "@/components/templates/(marketing)/search/HeaderSearch";
import { SideSearch } from "@/components/templates/(marketing)/search/SideSearch";

export default function SearchPage() {
  return (
    <>
      <HeaderSearch />
      <ContentSearch />
    </>
  );
}
