import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/95 p-10 text-slate-900 shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-600">
          ChatApp Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Welcome to ChatApp
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
          This is a simple placeholder dashboard for the chat application.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm font-medium">
          <Link
            href="/login"
            className="rounded-full bg-slate-950 px-5 py-3 text-white transition hover:bg-cyan-600"
          >
            Back to login
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-slate-200 px-5 py-3 text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700"
          >
            Go to signup
          </Link>
        </div>
      </section>
    </main>
  );
}