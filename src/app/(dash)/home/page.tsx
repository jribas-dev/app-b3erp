"use client";
import { useEffect, useState } from "react";
import { DashboardMenu } from "@/components/home/dashboard-menu";

export default function Home() {
  const [currentRole, setCurrentRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("selectedRole");
    if (storedRole) {
      setCurrentRole(storedRole);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedRole", currentRole);
  }, [currentRole]);

  const roles = [
    { value: "saler", label: "Vendedor" },
    { value: "supervisor", label: "Supervisor" },
    { value: "buyer", label: "Comprador" },
  ];

  return (
    <div className="flex-col pt-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* Role Selector */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-1 flex">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => setCurrentRole(role.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentRole === role.value
                    ? "bg-blue-600 dark:bg-indigo-800 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Menu */}
        <DashboardMenu userRole={currentRole} />
      </div>
    </div>
  );
}
