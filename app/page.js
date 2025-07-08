// app/page.js
import "./globals.css";
import dynamic from "next/dynamic";
import Footer from "./_components/Footer";
import { Suspense } from "react";

// Optional: Lazy load for smooth UX
const MenuItems = dynamic(() => import("./_components/Menuitem"), { ssr: false });
const CategoryList = dynamic(() => import("./_components/CategoryList"), { ssr: false });

export default async function Page() {
  return (
    <>
      <Suspense fallback={<div className="p-4 text-gray-600">Loading Categories...</div>}>
        <CategoryList />
      </Suspense>

      <Suspense fallback={<div className="p-4 text-gray-600">Loading Menu...</div>}>
        <MenuItems />
      </Suspense>

      <Footer />
    </>
  );
}
