import { Menu, Search, ShoppingBag, UserIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "../../hooks/useCartStore";

interface HeaderProps {
  cartCount?: number;
}

const Header = ({ cartCount: cartItems = 0 }: HeaderProps) => {
  const { cartCount } = useCartStore();

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
        <div className="bg-[#6eb356] p-3 w-[10%] flex items-center justify-center cursor-pointer">
          <Search color="#fff" />
        </div>
      </div>
      <div className="flex space-x-6 items-center">
        <Search className="lg:hidden block" />
        <NavLink to="/cart">
          <div className="bg-[#6eb356] p-2 relative rounded-full cursor-pointer">
            <ShoppingBag color="#fff" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 20,
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full min-w-[18px] min-h-[18px] flex items-center justify-center px-1.5 py-0.5 shadow-md"
                >
                  {cartItems || cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </NavLink>
        <div className="bg-[#6eb356] p-2 rounded-full cursor-pointer">
          <UserIcon color="#fff" />
        </div>
      </div>
    </div>
  );
};

export default Header;
