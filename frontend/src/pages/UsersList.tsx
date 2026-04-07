import { useState } from "react";
import api from "../api/axios";
import { getAllUsers } from "../api/usersApi";
import type { UserSummary } from "../types/UserSummary";
import type { AxiosError } from "axios";

export default function UsersList() {
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFetchUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const usersData = await getAllUsers(api, password);
      setUsers(usersData);
    } catch (err: any) {
      const axiosError = err as AxiosError;
      if (axiosError.status === 401) {
        setError("Invalid password. Please check and try again.");
      } else {
        setError("Failed to load users. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">All Users</h1>

      {/* Password Input Form */}
      <form onSubmit={handleFetchUsers} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Admin Password:
        </label>
        <div className="flex gap-3">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Load Users
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      )}

      {/* Users List */}
      {users && users.length > 0 && !loading && (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.username}
              className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
            >
              {/* Avatar on the left */}
              <img
                src={user.avatarUrl}
                alt={`${user.username}'s avatar`}
                className="w-16 h-16 rounded-full object-cover shadow-md"
              />

              {/* User info on the right */}
              <div className="flex-1">
                {/* Username - large and bold */}
                <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
                {/* Full name - under username, smaller */}
                <p className="text-sm text-gray-600">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && users.length === 0 && password.length > 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No users found or no access.</p>
        </div>
      )}
    </div>
  );
}
