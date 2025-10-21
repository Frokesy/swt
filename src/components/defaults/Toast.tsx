import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const Toast = ({ toast }: { toast: string }) => {
  return (
    <motion.div
      key="toast"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#6eb356] text-white px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50"
    >
      <CheckCircle size={18} className="text-white" />
      <span className="font-medium text-sm sm:text-base">{toast}</span>
    </motion.div>
  );
};

export default Toast;
