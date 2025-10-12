import { CircleDashed } from "lucide-react";
import Ad from "../../components/defaults/Ad";
import Header from "../../components/defaults/Header";
import TopNav from "../../components/defaults/TopNav";
import Footer from "../../components/defaults/Footer";

const DeliveryInfo = () => {
  const deliveryInfo = [
    "Orders placed will be delivered within 3 – 4 working days (excluding weekends)",
    "If a customer re-arranges, redirects, cancels, rejects, or refuses their delivery with our delivery partners without prior notice, Wosiwosi will not accept any liability for any continued delay or spoilage of fresh/frozen products that may occur from the extended period of the delivery.",
    "Order placed after 10am on Thrusday will be delivered the following Monday.",
    "Once order has been dispatched, amendment/cancellation may not be possible.",
    "If nobody is available when your parcel is delivered, the delivery driver will leave your parcel at a safe place within your compound.",
    "At checkout, the Total Weight of your order is calculated based on the gross weight of each product, which includes both the product content and its packaging.",
    "For some products, especially lightweight but bulky items, we may use volumetric weight instead of actual mass to determine shipping costs. This is calculated based on the product’s dimensions using industry-standard formulas.",
    "Shipping costs are determined by the Total Weight of your order, which may be based on either gross weight or volumetric weight, depending on the product.",
    "The final shipping fee is automatically calculated at checkout, ensuring accurate pricing based on logistics requirements.",
    "Kindly give us a call if you are coming to collect at our store.",
  ];
  return (
    <div>
      <Ad />
      <Header />
      <TopNav />
      <div className="lg:w-[60%] w-[90%] mx-auto my-10 space-y-3">
        <h2 className="text-[24px] font-semibold">Delivery Information</h2>
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
