import Hero from "@/app/component/Hero/Hero";
import Services from "@/app/component/Services/Services";
import Banner from "@/app/component/Banner/Banner";
import Subscribe from "@/app/component/Subscriber/Subscriber";
import Banner2 from "@/app/component/Banner/Banner2";
// import Footer from "@/app/component/Footer/Footer";
// import Navbar from "@/app/component/NavBar/NavBar";

export default function Home() {
  return (
      <main className="overflow-x-hidden bg-white text-gray-900">
          {/*<Navbar/>*/}
        <Hero />
        <Services />
        <Banner />
        <Subscribe />
        <Banner2 />
        {/*<MachineSpecs />*/}
        {/*<Footer />*/}
      </main>
  );
}
