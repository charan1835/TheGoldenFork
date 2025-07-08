"use client";

import { useEffect, useState, useRef } from "react";
import GlobalApi from "../_utils/GlobalApi";
import { ArrowRightCircle, ArrowLeftCircle, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function CategoryList() {
  const [categoryList, setCategoryList] = useState([]);
  const scrollRef = useRef(null);
  const params = useSearchParams();
  const router = useRouter();
  const selectedCategory = params.get("category");

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = () => {
    GlobalApi.getCategory().then((resp) => {
      setCategoryList(resp.categories);
    });
  };

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      container.scrollLeft += direction === "right" ? 250 : -250;
    }
  };

  const handleClearSelection = () => {
    router.push("/");
  };

  return (
    <div className="relative px-4 py-4 sm:px-6 md:px-8">
      {/* Clear Selection Button - Show only when category is selected */}
      {selectedCategory && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Selected:</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {selectedCategory}
            </span>
          </div>
          <button
            onClick={handleClearSelection}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        className="overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar"
      >
        <div className="flex gap-3 sm:gap-4 md:gap-5 py-2">
          {categoryList.map((category, index) => {
            const isSelected = selectedCategory === category.slug;
            return (
              <Link
                href={`?category=${category.slug}`}
                key={index}
                className={`min-w-[100px] sm:min-w-[120px] md:min-w-[140px] flex-shrink-0 flex flex-col items-center gap-2 border rounded-xl p-3 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer
                  ${
                    isSelected
                      ? "bg-orange-600 text-white border-orange-600"
                      : "bg-white text-gray-800 border-gray-200 hover:border-gray-300"
                  }`}
              >
                {category.icon?.url && (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full overflow-hidden shadow-sm bg-gray-100">
                    <img
                      src={category.icon.url}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="text-xs sm:text-sm font-medium text-center truncate w-full">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Scroll Arrows */}
      <ArrowLeftCircle
        className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer z-10 opacity-70 hover:opacity-100 transition-opacity hidden sm:block"
        size={35}
        onClick={() => handleScroll("left")}
      />
      <ArrowRightCircle
        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer z-10 opacity-70 hover:opacity-100 transition-opacity hidden sm:block"
        size={35}
        onClick={() => handleScroll("right")}
      />
    </div>
  );
}

export default CategoryList;