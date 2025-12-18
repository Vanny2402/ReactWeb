import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import customerApi from "../../api/customerApi";
import paymentApi from "../../api/paymentApi";
import saleApi from "../../api/saleApi";   // ✅ Import saleApi
import { useNavigate } from "react-router-dom";

export default function BookingGardener() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("payment");
  const [customer, setCustomer] = useState(null);
  const [payments, setPayments] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const cust = await customerApi.getCustomerById(id);
        setCustomer(cust);

        const resPayments = await paymentApi.getAllPayments();
        setPayments(resPayments?.data || []);

        const resSales = await saleApi.getAllSales();
        setSales(resSales?.data || []);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  const tabs = [
    { id: "payment", label: "ការបង់ប្រាក់" },
    { id: "sale", label: " ការទីញ" },
    // { id: "info", label: "ពត៌មានលម្អិត" },
  ];
  const formatAmount = (val) => Number(val || 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="bg-indigo-700 rounded-xl p-2 pl-5 flex items-center text-white ">
            <div className="flex-1">
              <p className="font-semibold">{customer?.name}</p>
              <div className="flex items-center gap-2 text-xs bg-white/20 rounded-full px-1 py-1 w-fit mt-2">
                <span> លេខទូរស័ព្ទ : {customer?.phone}</span>
              </div>
            </div>
            <p className="font-semibold"> ត្រូវបង់ ${formatAmount(customer?.totalDebt)}</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === tab.id
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Payment Tab */}
          {activeTab === "payment" && (
            <div>
              <h2 className="font-semibold">ប្រតិបត្តិការបង់ប្រាក់</h2>
              {loading ? (
                <div className="flex flex-col items-center py-10 text-gray-500">
                  <FiLoader className="animate-spin mr-2" size={20} />
                  <p>កំពុងផ្ទុក...</p>
                </div>
              ) : (
                <>
                  <ul className="text-sm space-y-2 mt-2">
                    {payments
                      .filter((p) => p.customer?.id === customer?.id)
                      .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)) // ✅ sort by createDate desc
                      .map((p) => {
                        const date = new Date(p.paymentDate);
                        const formattedDate = date.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit"
                        }); return (
                          <li key={p.id} className="flex justify-between">
                            <span>
                              {formattedDate.replace(/\//g, "-")} (#{p.id})
                              <span className="text-red-400 font-bold text-[11px]">  {"\t\t"}{p.remark}</span>
                            </span>
                            <span>${formatAmount(p.amount)}</span>
                          </li>
                        );
                      })}
                  </ul>

                  <div className="flex justify-between font-semibold mt-3 border-t pt-2">
                    <span>
                      ប្រាក់បង់កន្លងមរបស់
                      <span className="font-bold text-green-600 px-2 rounded">
                        {customer?.name}
                      </span>
                    </span>
                    <span className="font-bold bg-sky-400 text-gray-800 px-2 rounded">
                      $
                      {formatAmount(
                        payments
                          .filter((p) => p.customer?.id === customer?.id)
                          .reduce((sum, p) => sum + Number(p.amount || 0), 0)
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Sale Tab */}
          {activeTab === "sale" && (
            <div>
              <h2 className="font-semibold">ប្រតិបត្តិការលក់</h2>
              {loading ? (
                <div className="flex flex-col items-center py-10 text-gray-500">
                  <FiLoader className="animate-spin mr-2" size={20} />
                  <p>កំពុងផ្ទុក...</p>
                </div>
              ) : (
                <>
                  <ul className="text-sm space-y-2 mt-2">
                    {sales
                      .filter((s) => s.customer?.id === customer?.id)
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // ✅ sort by saleDate desc
                      .map((s) => {
                        const date = new Date(s.createdAt);

                        // Use options to specify 2-digit year
                        const formattedDate = date.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit"
                        });
                        return (
                          <li key={s.id} className="flex justify-between">
                            <span>
                              {formattedDate.replace(/\//g, "-")} (#{s.id})
                            </span>
                            <span>${formatAmount(s.totalPrice)}</span>
                          </li>
                        );
                      })}
                  </ul>

                  <div className="flex justify-between font-semibold mt-3 border-t pt-2">
                    <span>
                      ការទិញកន្លងមករបស់
                      <span className="font-bold text-green-600 px-2 rounded">
                        {customer?.name}
                      </span>
                    </span>
                    <span className="font-bold bg-green-300 text-gray-800 px-2 rounded">
                      $
                      {formatAmount(
                        sales
                          .filter((s) => s.customer?.id === customer?.id)
                          .reduce((sum, s) => sum + Number(s.totalPrice || 0), 0)
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}


          {/* CTA Button changes dynamically */}
          <button
            onClick={() => {
              if (activeTab === "payment") {
                navigate(`/payments/Add/${customer?.id}`);
              } else if (activeTab === "sale") {
                // navigate(`/sales/ProductSale/${customer?.id}`);
                navigate(`/sales/ProductSale?customerId=${customer?.id}`);
              } else {
                navigate(`/customers/${customer?.id}`);
              }
            }}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold mt-4"
          >
            {activeTab === "payment"
              ? "បង់ប្រាក់បន្ថែម"
              : activeTab === "sale"
                ? "ទិញបន្ថែម"
                : "Info"}
          </button>
        </div>
      </div>
    </div>
  );
}
