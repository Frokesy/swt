import { useEffect, useState } from 'react';
import { getAdBannerContent } from '../../lib/siteContent';

const Ad = () => {
  const [message, setMessage] = useState(
    'Orders after 10am on Thu are shipped the following Monday'
  );
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const loadAd = async () => {
      const content = await getAdBannerContent();
      setMessage(content.message);
      setEnabled(content.enabled);
    };

    loadAd();
  }, []);

  if (!enabled || !message.trim()) return null;

  return (
    <div className="bg-green-700 text-[#fff] font-semibold py-3 text-center lg:text-[14px] text-[12px]">
      <p>{message}</p>
    </div>
  );
};

export default Ad;
