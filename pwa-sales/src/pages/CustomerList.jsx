import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function CustomerList() {

  const customers = [
    { id: 1, name: "Somnang", phone: "012345678", debt: 25.0 },
    { id: 2, name: "Sokha", phone: "098765432", debt: 0.0 },
  ];

  return (
    <div className="p-4 mb-16">
      <h1 className="text-xl font-bold mb-4">Customers</h1>

      <input
        type="text"
        placeholder="Search customer..."
        className="w-full border rounded-xl px-4 py-2 mb-4 shadow-sm"
      />

      <div className="space-y-3">
        {customers.map(c => (
          <Link
            key={c.id}
            to={`/customers/${c.id}`}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm"
          >
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-gray-500">{c.phone}</p>
            </div>
            <p className={`font-bold ${c.debt > 0 ? "text-red-600" : "text-green-600"}`}>
              ${c.debt}
            </p>
          </Link>
        ))}
      </div>

      <Link
        to="/customers/add"
        className="fixed bottom-20 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg"
      >
        <FiPlus size={24} />
      </Link>
    </div>
  );
}
