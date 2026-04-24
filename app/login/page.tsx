import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/95 p-8 text-slate-900 shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-600">
            ChatApp
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-600">
            Dummy login page for ChatApp.
          </p>
        </div>

        <form className="mt-8 space-y-4">
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white transition hover:bg-cyan-600"
          >
            Login
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <Link
            className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 font-medium text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100"
            href="/signup"
          >
            Go to signup
          </Link>
          <Link
            className="inline-flex rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            href="/"
          >
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}