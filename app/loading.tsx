export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-white/40">
          Harrison Ministries
        </p>

        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
          Carter & Tori
        </h1>

        <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />

        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-white/50">
          His Burden. Our Mission.
        </p>
      </div>
    </div>
  );
}