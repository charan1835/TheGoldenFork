// app/page.js
import "./globals.css";
import CategoryList from "./_Components/CategoryList.jsx";
import MenuItems from "./_Components/Menuitem";
//import CookingGIF from "./_Components/CookingGif";
//import Hero from "./_Components/Hero";
import Footer from "./_Components/Footer";
export default async function Page() {

  return (
    <>
      <CategoryList />
      <MenuItems />
      <Footer />
    </>
  );
}
