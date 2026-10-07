import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export const AdminListingsPage = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllListings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, type, status, deadline, organizations(name)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setListings(data);
      }
      setLoading(false);
    };

    fetchAllListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          All Platform Listings
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Global view of all posted jobs and internships across organizations.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-gray-500">
          Loading listings...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold uppercase text-gray-400 tracking-wider">
                <th className="p-4">Title</th>
                <th className="p-4">Organization</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {listings.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4 font-semibold text-gray-900">
                    {item.title}
                  </td>
                  <td className="p-4 text-gray-600">
                    {item.organizations?.name || "N/A"}
                  </td>
                  <td className="p-4 capitalize text-gray-600">{item.type}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-700 uppercase">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(item.deadline).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
