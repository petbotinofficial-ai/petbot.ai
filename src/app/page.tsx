export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-16 text-slate-950">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold tracking-[0.2em] text-emerald-700 uppercase">
          Petbot
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
          The Petbot website is ready.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
          This foundation is ready for the future customer experience and the
          Petbot administration dashboard.
        </p>
        <div className="mt-8 inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
          Next.js, TypeScript, Tailwind CSS, and ESLint are configured.
        </div>
      </section>
    </main>
  );
}
