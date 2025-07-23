"use client"

import Categories from "@/components/templates/(marketing)/Index/Categories"
import BestSellers from "@/components/templates/(marketing)/Index/BestSellers"
import NewestProducts from "@/components/templates/(marketing)/Index/NewestProducts"
import MainBanner from "@/components/templates/(marketing)/Index/MainBanner"
import HeroBanner from "@/components/templates/(marketing)/Index/HeroBanner"

export default function HomePage() {
  return (
    <main >
      {/* Hero Section */}
      {/* Featured Products Row */}
      <MainBanner />

      {/* Categories Section */}
      <Categories
        categories={[
          {
            id: "1",
            title: "Beige Shirt",
            image: "https://images.pexels.com/photos/6311602/pexels-photo-6311602.jpeg?auto=compress&cs=tinysrgb&h=400&w=300",
          },
          {
            id: "2",
            title: "Black Pants",
            image: "https://images.pexels.com/photos/12103882/pexels-photo-12103882.jpeg?auto=compress&cs=tinysrgb&h=400&w=300",
          },
          {
            id: "3",
            title: "Black Hoodie",
            image: "https://images.pexels.com/photos/8041807/pexels-photo-8041807.jpeg?auto=compress&cs=tinysrgb&h=400&w=300",
          },
          {
            id: "4",
            title: "Gray Shirt",
            image: "https://images.pexels.com/photos/7049774/pexels-photo-7049774.jpeg?auto=compress&cs=tinysrgb&h=400&w=300",
          },
          {
            id: "5",
            title: "Black Suit",
            image: "https://images.pexels.com/photos/7679461/pexels-photo-7679461.jpeg?auto=compress&cs=tinysrgb&h=400&w=300",
          },
          {
            id: "6",
            title: "Black Cap",
            image: "https://images.pexels.com/photos/6069525/pexels-photo-6069525.jpeg?auto=compress&cs=tinysrgb&h=400&w=300",
          },
        ]}
      />
      { /* Best Sellers Section */}
      <BestSellers products={
        [{
          title: "",
          mainImage: "",
          id: 1
        }, {
          title: "",
          mainImage: "",
          id: 2
        }, {
          title: "",
          mainImage: "",
          id: 3
        },
      ]
      } />
      {/* Hero Banner */}
      <HeroBanner />
      {/* Sản phẩm mới */}
      <NewestProducts products={
        [{
          title: "",
          mainImage: "",
          id: 1
        }, {
          title: "",
          mainImage: "",
          id: 2
        }, {
          title: "",
          mainImage: "",
          id: 3
        },]
      } />
    </main>

  )
}
