"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import GlobalApi from "../_utils/GlobalApi";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Star, Loader2, IndianRupee } from "lucide-react";

function MenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const selectedCategory = params.get("category");

  const { user } = useUser();
  const { incrementCartCount, fetchCartCount, cartCount } = useCart();

  useEffect(() => {
    if (selectedCategory) {
      getMenuItems(selectedCategory);
    } else {
      setMenuItems([]);
    }
  }, [selectedCategory]);

  const getMenuItems = async (categorySlug) => {
    try {
      setLoading(true);
      const resp = await GlobalApi.getMenuItemsByCategory(categorySlug);
      setMenuItems(resp.menuitems || []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item) => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error("Please sign in to add items to cart!");
      return;
    }

    const payload = {
      email: user.primaryEmailAddress.emailAddress,
      image: item.img?.url || "",
      itemname: item.name,
      phonenumber: user.phoneNumbers?.[0]?.phoneNumber || "0000000000",
      price: item.price,
    };

    try {
      incrementCartCount(); // Immediate UI update
      await GlobalApi.createUserCart(payload);
      await fetchCartCount(); // Sync with server
      toast.success(`${item.name} added to cart! 🛒`);
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error("Failed to add item to cart.");
      await fetchCartCount(); // Revert on error
    }
  };

  if (!selectedCategory) {
    return null;
  }

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 capitalize">
          {selectedCategory.replace(/([A-Z])/g, " $1").trim()} Menu
        </h2>
        <p className="text-gray-600 mt-1">
          Discover delicious {selectedCategory} dishes
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          <span className="ml-3 text-gray-600">Loading menu items...</span>
        </div>
      ) : menuItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 relative overflow-hidden">
                {item.img?.url ? (
                  <img
                    src={item.img.url}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 flex-1 mr-2 line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center text-orange-600 font-bold text-lg">
                    <IndianRupee className="w-4 h-4" />
                    <span>{item.price}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < 4 ? "fill-current" : ""}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-xs ml-1">(4.2)</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm font-medium flex items-center gap-1"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-500 text-xs">No Items</span>
          </div>
          <p className="text-gray-600">No items found for this category</p>
        </div>
      )}
    </div>
  );
}

export default MenuItems;