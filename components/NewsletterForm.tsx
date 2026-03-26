"use client";

export default function NewsletterForm() {
  return (
    <form
      className="flex flex-col sm:flex-row gap-0 max-w-md w-full lg:w-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="votre@email.com"
        className="flex-1 bg-[#1A1A1A] border border-white/10 text-white placeholder-white/20 text-sm font-medium px-5 py-3.5 outline-none focus:border-[#FF5C00]/60 transition-colors duration-200 sm:min-w-[260px]"
      />
      <button
        type="submit"
        className="bg-[#FF5C00] hover:bg-white hover:text-[#0A0A0A] text-white font-black text-xs uppercase tracking-[0.2em] px-7 py-3.5 transition-all duration-300 whitespace-nowrap"
      >
        S&apos;abonner
      </button>
    </form>
  );
}
