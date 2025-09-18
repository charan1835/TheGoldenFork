"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import GlobalApi from "../_utils/GlobalApi";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Star, Loader2, IndianRupee } from "lucide-react";
import GlareCard from "./animations/GlareCard";
import InfiniteMenu from "./InfiniteMenu";

function MenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const selectedCategory = params.get("category");

  const { user } = useUser();
  const { incrementCartCount, fetchCartCount, cartCount } = useCart();

  useEffect(() => {
    const load = async () => {
      if (selectedCategory) {
        await getMenuItems(selectedCategory);
      } else {
        await getAllItems();
      }
    };
    load();
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

  const getAllItems = async () => {
    try {
      setLoading(true);
      const resp = await GlobalApi.getAllMenuItems();
      setMenuItems(resp.menuitems || []);
    } catch (error) {
      console.error("Error fetching all menu items:", error);
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

  const flowingItems = menuItems.map((m) => ({
    image: m.img?.url,
    link: `#`,
    title: m.name,
    description: m.description,
    price: m.price,
    _raw: m,
  }));

  const handlePick = (it) => {
    if (it?._raw) {
      handleAddToCart(it._raw);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground capitalize">
          {selectedCategory ? `${selectedCategory.replace(/([A-Z])/g, " $1").trim()} Menu` : 'All Menu Items'}
        </h2>
        <p className="text-muted-foreground mt-1">
          {selectedCategory ? `Discover delicious ${selectedCategory} dishes` : 'Browse everything fresh from our kitchen'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          <span className="ml-3 text-gray-600">Loading menu items...</span>
        </div>
      ) : menuItems.length > 0 ? (
        <InfiniteMenu items={flowingItems} onItemClick={handlePick} infinite={!selectedCategory} />
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