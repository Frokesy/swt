import { Camera, LogOut, User } from 'lucide-react';
import { useState, type SetStateAction } from 'react';

interface ProfileInfoProps {
  setLogoutModal: React.Dispatch<SetStateAction<boolean>>;
}
const ProfileInfo = ({ setLogoutModal }: ProfileInfoProps) => {
  const [profileImg, setProfileImg] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImg(url);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 text-green-700">
        Profile Information
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-green-600 bg-gray-100">
            {profileImg ? (
              <img
                src={profileImg}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-full h-full text-gray-400 p-8" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-green-700 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-green-800 transition">
            <Camera size={16} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>

        <div className="text-center sm:text-left">
          <h3 className="font-semibold text-lg">John Doe</h3>
          <p className="text-gray-500 text-sm">john@example.com</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            defaultValue="John Doe"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            defaultValue="john@example.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            defaultValue="+234 900 000 0000"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date Joined</label>
          <input
            type="text"
            value="Jan 20, 2025"
            readOnly
            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setLogoutModal(true)}
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
