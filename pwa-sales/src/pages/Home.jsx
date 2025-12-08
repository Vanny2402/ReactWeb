
import MainLayout from "../layouts/MainLayout";

export default function Home() {
  return (
    <MainLayout title="Dashboard">
      <div className="space-y-4">

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-gray-700 text-lg font-semibold">Today's Summary</h2>
          <p className="text-gray-500">Sales, payments</p>
        </div>

      </div>
    </MainLayout>
  );
}
