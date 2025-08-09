import Sidebar from "@/components/templates/(marketing)/detail/Sidebar";
import Pagination from "@/components/templates/(marketing)/detail/Pagination";
import Products from "@/components/templates/(marketing)/detail/Products";
import Header from "@/components/templates/(marketing)/detail/Header";

export default function AoPoloStore() {
  return (
    <div>
      {/* Header */}
      <Header />
      <div className="flex  mx-auto">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Product Grid */}
          <Products />
          {/* Pagination only if there are products and more than 1 page */}
          <Pagination />
        </main>
      </div>
    </div>
  );
}
