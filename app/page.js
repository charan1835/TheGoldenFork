// app/page.js
import "./globals.css";
import HomeClientWrapper from "./_components/HomeClientWrapper";
import Footer from "./_components/Footer";

export default async function Page() {
  return (
    <>
      <HomeClientWrapper />
      <Footer />
    </>
  );
}
