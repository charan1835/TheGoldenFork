// app/_components/HomeClientWrapper.jsx
"use client";

import { Suspense } from "react";
import CategoryList from "./CategoryList";
import MenuItems from "./Menuitem";

export default function HomeClientWrapper() {
  return (
    <>
      <Suspense fallback={<div>Loading Categories...</div>}>
        <CategoryList />
      </Suspense>

      <Suspense fallback={<div>Loading Menu...</div>}>
        <MenuItems />
      </Suspense>
    </>
  );
}
