import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";

function ConfirmModal({
  open,title,description,onCancel,onConfirm,}) {

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-[420px] rounded-3xl bg-white p-8 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <FiAlertTriangle className="text-red-500 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {title}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {description}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition shadow-md"
              >
                New Chat
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;