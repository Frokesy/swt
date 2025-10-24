import { useState } from "react";
import { Menu, Search, ShoppingBag, UserIcon, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../../hooks/useCart";

const navItems = [
  { id: 1, label: "Home", link: "/" },
  { id: 2, label: "My Account", link: "/account" },
  { id: 3, label: "Product Catalogue", link: "/product-catalogue" },
  { id: 4, label: "Regular Sales", link: "/regular-sales" },
  { id: 5, label: "Preorder", link: "/preorder" },
  { id: 6, label: "Delivery Information", link: "/delivery-info" },
];

const Header = () => {
  const { cartCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="lg:w-[60%] w-[90%] mx-auto lg:my-10 my-4 flex justify-between items-center">
        <Menu
          className="lg:hidden block cursor-pointer"
          onClick={() => setDrawerOpen(true)}
        />

        <h2 className="text-green-700 lg:text-[44px] text-[30px] italic font-bold">
          Rehubot
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
          <Search className="lg:hidden block cursor-pointer" />
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
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </NavLink>
          <NavLink to="/account">
            <div className="bg-[#6eb356] p-2 rounded-full cursor-pointer">
              <UserIcon color="#fff" />
            </div>
          </NavLink>
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setDrawerOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="fixed top-0 left-0 h-full w-[80%] sm:w-[60%] bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-200">
                <h2 className="text-green-700 text-2xl font-semibold italic">
                  Divwis
                </h2>
                <X
                  size={26}
                  className="cursor-pointer text-gray-600 hover:text-green-700 transition"
                  onClick={() => setDrawerOpen(false)}
                />
              </div>

              <div className="flex flex-col mt-4 px-5 space-y-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.link}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) =>
                      `text-lg font-medium py-2 px-3 rounded-lg transition-all ${
                        isActive
                          ? "text-green-700 bg-green-100"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <div className="mt-auto p-5 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} Divwis. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
