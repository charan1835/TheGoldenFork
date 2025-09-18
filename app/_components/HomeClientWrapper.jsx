// app/_components/HomeClientWrapper.jsx
"use client";

import { Suspense } from "react";
import CategoryList from "./CategoryList";
import MenuItems from "./Menuitem";
import Hero from "./Hero";

export default function HomeClientWrapper() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div>Loading Categories...</div>}>
        <CategoryList />
      </Suspense>

      <Suspense fallback={<div>Loading Menu...</div>}>
        <MenuItems />
      </Suspense>
    </>
  );
}
