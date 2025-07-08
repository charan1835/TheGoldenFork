// app/page.js
import "./globals.css";
import HomeClientWrapper from "./_components/HomeClientWrapper";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
export default async function Page() {
  return (
    <>
      <HomeClientWrapper />
      //<Hero />
      <Footer />
    </>
  );
}
