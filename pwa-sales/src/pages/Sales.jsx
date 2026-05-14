import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function Sales() {
  return (
    <MainLayout title="ការលក់">
      <nav className="flex flex-col gap-3 p-2 max-w-md">
        <Link
          to="/sales/list"
          className="block rounded-xl border bg-white px-4 py-3 font-medium text-blue-700 shadow-sm hover:bg-blue-50"
        >
          បញ្ជីលក់
        </Link>
        <Link
          to="/sales/ProductSale"
          className="block rounded-xl border bg-white px-4 py-3 font-medium text-blue-700 shadow-sm hover:bg-blue-50"
        >
          លក់ថ្មី
        </Link>
      </nav>
    </MainLayout>
  );
}
