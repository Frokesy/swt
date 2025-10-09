import { Menu, Search, ShoppingBag, UserIcon } from "lucide-react";

const Header = () => {
  return (
    <div className="lg:w-[60%] w-[90%] mx-auto lg:my-10 my-4 flex justify-between items-center">
      <Menu className="lg:hidden block" />
      <h2 className="text-green-700 lg:text-[44px] text-[30px] italic font-bold">
        Divwis
      </h2>
      <div className="lg:flex hidden w-[60%] border border-[#ccc] pl-3 rounded-lg">
        <input
          type="text"
          placeholder="Search for products..."
          className="outline-none border-none w-[90%] pr-4"
        />
        <div className="bg-[#12ff91] p-3 cursor-pointer">
          <Search />
        </div>
      </div>
      <div className="flex space-x-6 items-center">
        <Search className="lg:hidden block" />
        <ShoppingBag />
        <div className="bg-[#12ff91] p-2 rounded-full cursor-pointer">
          <UserIcon />
        </div>
      </div>
    </div>
  );
};

export default Header;
