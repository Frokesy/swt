import { NavLink } from "react-router-dom";

const TopNav = () => {
  const navItems = [
    { id: 1, label: "Home", link: "/" },
    { id: 2, label: "My Account", link: "/account" },
    { id: 3, label: "Product Catalogue", link: "/product-catalogue" },
    { id: 4, label: "Regular Sales", link: "/regular-sales" },
    { id: 5, label: "Preorder", link: "/preorder" },
    { id: 6, label: "Delivery Information", link: "/delivery-info" },
  ];
  return (
    <div className="w-[100%] bg-[#6eb356] lg:flex hidden text-[#fff] py-3 text-center">
      <div className="lg:w-[60%] w-[90%] mx-auto flex items-center space-x-10">
        {navItems.map((item) => (
          <div
            className="hover:text-[#ffed21] cursor-pointer transition-colors ease-in-out duration-300"
            key={item.id}
          >
            <NavLink to={item.link}>{item.label}</NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopNav;
