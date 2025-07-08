// app/page.js
import "./globals.css";
import CategoryList from "./_components/CategoryList.jsx";
import MenuItems from "./_components/Menuitem";
//import CookingGIF from "./_Components/CookingGif";
//import Hero from "./_Components/Hero";
import Footer from "./_components/Footer";
export default async function Page() {

  return (
    <>
      <CategoryList />
      <MenuItems />
      <Footer />
    </>
  );
}
