import Ad from "../../components/defaults/Ad";
import Footer from "../../components/defaults/Footer";
import Header from "../../components/defaults/Header";
import TopNav from "../../components/defaults/TopNav";
import Products from "../../components/sections/Products";

const Home = () => {
  return (
    <div>
      <Ad />
      <Header />
      <TopNav />
      <div className="lg:w-[60%] w-[90%] mx-auto my-10">
        <img
          src="/assets/ad.png"
          alt="ad"
          className="w-[100%] h-[200px] lg:h-[390px]"
        />
      </div>
      <Products />
      <Footer />
    </div>
  );
};

export default Home;
