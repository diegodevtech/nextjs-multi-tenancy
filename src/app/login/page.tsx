import { saveSession } from "@/utils/session";
import { redirect } from "next/navigation";
import React from "react";

export async function loginAction(formData: FormData) {
  "use server";

  const { username, password } = Object.fromEntries(formData);

  const response = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if(response.ok) {
    const { token } = await response.json()
    await saveSession(token);
    redirect("/");
  }
}
export const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)] bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-md w-80" action={loginAction}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
