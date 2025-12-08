import { useNavigate, useParams } from "react-router-dom";

export default function CustomerEdit() {
  const nav = useNavigate();
  const { id } = useParams();
  console.log("Editing customer:", id);
  function handleSave(e) {
    e.preventDefault();
    nav("/customers");
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Edit Customer</h1>

      <form className="space-y-3" onSubmit={handleSave}>
        <input
          type="text"
          defaultValue="Customer Name"
          className="w-full border px-4 py-3 rounded-xl"
        />

        <input
          type="text"
          defaultValue="012345678"
          className="w-full border px-4 py-3 rounded-xl"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
          Update
        </button>
      </form>
    </div>
  );
}
