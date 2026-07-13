import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";

function DeleteConfirmModal({
  open,
  icon,
  title,
  message,
  onCancel,onConfirm,confirmText = "Delete",confirmColor = "bg-red-500 hover:bg-red-600",}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">

      <motion.div
        initial={{ opacity: 0, scale: .9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: .9 }}
        className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            {icon || <FiTrash2 className="text-red-500" size={28} />}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center">
          {title}
        </h2>

        <p className="text-slate-500 text-center mt-3">
          {message}
        </p>

        <div className="flex justify-center gap-3 mt-8">

          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-xl text-white ${confirmColor}`}
          >
            {confirmText}
          </button>

        </div>

      </motion.div>

    </div>
  );
}

export default DeleteConfirmModal;