"use client";
import Image from "next/image";
import { useState } from "react";

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <main className="min-h-screen bg-[#002740] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image src="/bggettoknow.png" alt="bg" fill className="object-cover opacity-10" priority />
        <div className="absolute inset-0 bg-[#002740]/90" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md py-10">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <a href="/">
            <Image src="/full-logo-me.svg" alt="Mission Earth" width={140} height={44} className="object-contain" />
          </a>
        </div>

        <div className="border border-[#CEA870]/20 rounded-3xl bg-[#001f33]/80 backdrop-blur-md px-8 py-10 shadow-2xl">
          <h2 className="text-white text-2xl font-semibold mb-1">Create account</h2>
          <p className="text-gray-400 text-sm mb-8">Join Mission Earth and start your journey</p>

          <div className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="text-[#CEA870] text-xs uppercase tracking-widest font-medium block mb-2">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                placeholder="Your full name"
                className="w-full bg-[#002740] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/60 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-[#CEA870] text-xs uppercase tracking-widest font-medium block mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="your@email.com"
                className="w-full bg-[#002740] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/60 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[#CEA870] text-xs uppercase tracking-widest font-medium block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="••••••••"
                  className="w-full bg-[#002740] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#CEA870]/60 transition-colors pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#CEA870] transition-colors">
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[#CEA870] text-xs uppercase tracking-widest font-medium block mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="••••••••"
                  className={`w-full bg-[#002740] border rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors pr-12 ${
                    form.confirm && form.password !== form.confirm
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-white/10 focus:border-[#CEA870]/60"
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#CEA870] transition-colors">
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {form.confirm && form.password !== form.confirm && (
                <p className="text-red-400 text-xs mt-1.5">Passwords do not match</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="button"
              className="w-full bg-[#CEA870] text-[#002740] font-semibold py-3 rounded-xl hover:bg-[#CEA870]/90 active:scale-95 transition-all duration-300 tracking-widest text-sm uppercase mt-2"
            >
              Create Account
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-600 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-[#CEA870] hover:underline">Sign in</a>
          </p>
        </div>

        {/* Back */}
        <div className="flex justify-center mt-6">
          <a href="/" className="text-gray-600 text-xs hover:text-[#CEA870] transition-colors flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </a>
        </div>

      </div>
    </main>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}
