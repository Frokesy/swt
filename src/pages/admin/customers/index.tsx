/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const USERS_COLLECTION_ID = 'users';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.orderDesc('$createdAt')]
      );
      setCustomers(res.documents as any[]);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Customers</h1>
      </div>
      <div className="mb-4">
        <input
          placeholder="Search by name, email, phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg w-full"
        />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="overflow-auto bg-white border border-gray-100 rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Joined</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const id = u.userId;
                return (
                  <tr key={id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{u.name || '—'}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.phone || '—'}</td>
                    <td className="p-3">
                      {new Date(
                        u.$createdAt || u.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/admin/customers/${id}`}
                        className="text-blue-600"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCustomers;
