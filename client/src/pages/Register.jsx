import { useState } from "react";
import { registerUser } from "../api/auth";

export default function Register({ setStep, setEmail }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      setEmail(form.email);
      setStep("verify");
    } catch (err) {
      alert(err?.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <input
          className="w-full mb-4 p-3 border rounded-lg"
          placeholder="Name"
          onChange={(e)=>setForm({...form, name:e.target.value})}
        />

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

        <button className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition">
          Register
        </button>
      </form>
    </div>
  );
}