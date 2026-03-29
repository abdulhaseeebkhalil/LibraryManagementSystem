import { useState } from "react";
import { loginUser } from "../api/auth";

export default function Login({ setStep }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      await loginUser(form);
      setStep("dashboard");
    } catch (err) {
      alert(err?.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-500">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Welcome Back
        </h2>

        <input
          className="w-full mb-4 p-3 border rounded-lg"
          placeholder="Email"
          onChange={(e)=>setForm({...form, email:e.target.value})}
        />

        <input
          type="password"
          className="w-full mb-4 p-3 border rounded-lg"
          placeholder="Password"
          onChange={(e)=>setForm({...form, password:e.target.value})}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}