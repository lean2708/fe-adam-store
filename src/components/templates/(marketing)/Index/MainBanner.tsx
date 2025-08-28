"use client";

import { Button } from "@/components/ui/button";
import MainBannerSwiper from "./MainBanner/MainBannerSwiper";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { useChatWidgetStore } from "@/stores/chatWidgetStore";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle } from "lucide-react";

// List of banner image filenames in public/imgs/banner
const bannerImages = [
  "banner1.jpg",
  "banner2.jpg",
  "banner3.jpg",
  // Add more filenames as needed
];

const heroSlides = bannerImages.map((filename, idx) => ({
  src: `/imgs/banner/${filename}`,
  alt: `Banner ${idx + 1}`,
}));

export default function MainBanner() {
  const t = useTranslations("Languages");
  const { isAuthenticated } = useAuth();
  const { openWidget } = useChatWidgetStore();

  const handleChatClick = () => {
    if (isAuthenticated) {
      openWidget();
    } else {
      // Redirect to login if not authenticated
      window.location.href = "/login";
    }
  };

  return (
    <section className="">
      {/* Hero Carousel - Embla carousel */}
      <div
        className="relative py-16  adam-store-bg-light overflow-hidden w-full"
        style={{ minHeight: 400 }}
      >
        <MainBannerSwiper heroSlides={heroSlides} />
      </div>
      {/* <div className="py-8 px-8" ref={buttonRef}>
          <div className="flex justify-end">
            <Button
              onClick={handleChatClick}
              className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-3 shadow-lg"
            >
              {t("chatwithus")}
            </Button>
          </div>
        </div> */}

      {/* Sticky button that appears after scrolling past original */}
      <Button
        onClick={handleChatClick}
        className="fixed bottom-6 right-6 z-50 bg-black hover:bg-gray-800 text-white rounded-full px-6 py-3 shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-300 flex items-center gap-2"
      >
        <MessageCircle
          className="h-8 w-8"
          style={{ width: "25px", height: "25px" }}
        />
        {t("chatwithus")}
      </Button>
    </section>
  );
}
