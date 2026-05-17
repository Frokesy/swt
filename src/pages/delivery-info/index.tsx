import { CircleDashed } from "lucide-react";
import Ad from "../../components/defaults/Ad";
import Header from "../../components/defaults/Header";
import TopNav from "../../components/defaults/TopNav";
import Footer from "../../components/defaults/Footer";
import { useEffect, useState } from "react";
import { getDeliveryInfoContent } from "../../lib/siteContent";

const DeliveryInfo = () => {
  const [title, setTitle] = useState("Delivery Information");
  const [deliveryInfo, setDeliveryInfo] = useState<string[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      const content = await getDeliveryInfoContent();
      setTitle(content.title);
      setDeliveryInfo(content.items);
    };

    loadContent();
  }, []);

  return (
    <div>
      <Ad />
      <Header />
      <TopNav />
      <div className="lg:w-[60%] w-[90%] mx-auto my-10 space-y-3">
        <h2 className="text-[24px] font-semibold">{title}</h2>
        <div className="space-y-3">
          {deliveryInfo.map((info, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="">
                <CircleDashed className="mt-1" size={14} />
              </div>
              <p className="lg:text-[16px] text-[14px]">{info}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeliveryInfo;
