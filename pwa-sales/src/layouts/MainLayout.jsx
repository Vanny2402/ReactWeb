export default function MainLayout({ title, children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-16">

      {/* Top Header */}
      {/* <header className="bg-white shadow-md p-4 text-lg font-semibold text-gray-700 sticky top-0 z-50"></header> */}
      <header className="bg-white shadow-md p-4 text-lg font-semibold text-gray-700 sticky top-0 z-50">
        {title}
      </header>

      {/* Page Body */}
      <main className="flex-1 overflow-y-auto p-4">
            {/* <main className="flex-1 overflow-y-auto p-4"> */}

        {children}
      </main>

    </div>
  );
}
