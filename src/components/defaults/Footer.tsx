import {
  HeadphonesIcon,
  HelpCircleIcon,
  InstagramIcon,
  LinkedinIcon,
  LocateIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="bg-[#191d28] text-[#fff] py-[10vh]">
      <div className="border-b border-[#404040] mb-10 w-[80vw] mx-auto"></div>
      <div className="lg:w-[80vw] w-[90vw] mx-auto grid lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-[34px] font-semibold">Divwis</h2>
          <p className="text-[14px]">
            © {currentYear} Divwis Limited. All rights reserved
          </p>
          <div className="flex items-center space-x-[16px]">
            <InstagramIcon />
            <TwitterIcon />
            <YoutubeIcon />
            <LinkedinIcon />
          </div>
        </div>

        <div className="flex lg:flex-row flex-col space-y-10 lg:space-y-0">
          <div className="space-y-3 lg:w-[50%]">
            <h2 className="text-[20px] font-bold mt-10 lg:mt-0">Quick Links</h2>
            <ul className="space-y-3 text-[15px]">
              <li>
                <span>About</span>
              </li>
              <li>
                <span>FAQs</span>
              </li>
              <li>
                <span>Terms of Service</span>
              </li>
              <li>
                <span>Privacy Policy</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="text-[20px] font-bold">Contact</h2>
            <ul className="space-y-3 text-[15px]">
              <li className="flex items-center space-x-3">
                <HelpCircleIcon />
                <p>support@divwisglobals.com</p>
              </li>
              <li className="flex items-center space-x-3">
                <HeadphonesIcon />
                <p>+234-809-790-8574</p>
              </li>
              <li className="flex items-center space-x-3 pb-10">
                <LocateIcon />
                <p>Somewhere Street, Some Town, One city</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
