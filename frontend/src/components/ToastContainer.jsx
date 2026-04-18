import { useApp } from "../context/AppContext";

const ToastContainer = () => {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-3 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id}
          className={`toast flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-medium max-w-xs pointer-events-auto
            ${toast.type === "success" ? "bg-gray-900 border border-green-500/30" :
              toast.type === "error" ? "bg-red-600" : "bg-gray-800"}`}>
          <span className="text-lg flex-shrink-0">
            {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "ℹ️"}
          </span>
          <span className="leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
