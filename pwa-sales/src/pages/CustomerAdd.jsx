import { useNavigate } from "react-router-dom";

export default function CustomerAdd() {
  const nav = useNavigate();

  function handleSave(e) {
    e.preventDefault();
    nav("/customers");
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Add Customer</h1>

      <form className="space-y-3" onSubmit={handleSave}>
        <input
          type="text"
          placeholder="Customer Name"
          className="w-full border px-4 py-3 rounded-xl"
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border px-4 py-3 rounded-xl"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
          Save
        </button>
      </form>
    </div>
  );
}
