export default function PageShell({ children }) {
  
  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
      <div className="bg-white min-h-screen rounded-t-2xl shadow-sm relative">
        {children}
      </div>
    </div>
  );
}
