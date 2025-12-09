import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomer } from "../../api/customerApi";

export default function CustomerAdd() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(""); // ✅ added state for address

  async function handleSave(e) {
    e.preventDefault();

    try {
      await createCustomer({
        name: name,
        phone: phone,
        address: address
      });

      nav("/customers"); // redirect
    } catch (err) {
      console.error(err);
      alert("មិនអាចបញ្ចូលអតិថិជនបានទេ!");
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">បង្កើតអតិថិជន</h1>

      <form className="space-y-3" onSubmit={handleSave}>

        <input
          type="text"
          placeholder="ឈ្មោះអតិថិជន"
          className="w-full border px-4 py-3 rounded-xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="លេខទូរស័ព្ទ"
          className="w-full border px-4 py-3 rounded-xl"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="text"
          placeholder="អាស័យដ្ឋាន"
          className="w-full border px-4 py-3 rounded-xl"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
          រក្សាទុក
        </button>
      </form>
    </div>
  );
}