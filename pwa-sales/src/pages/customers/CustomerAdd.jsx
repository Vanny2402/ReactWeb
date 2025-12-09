import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomer } from "../../api/customerApi";

export default function CustomerAdd() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(""); 
  const [loading, setLoading] = useState(false); // 👈 loading state

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true); // 👈 start loading

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
    } finally {
      setLoading(false); // 👈 stop loading
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl disabled:opacity-50"
          disabled={loading}>
          {loading ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
        </button>
      </form>
    </div>
  );
}
