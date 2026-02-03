
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <h1 className="text-5xl font-bold tracking-tighter mb-4">SkillLink</h1>
      <p className="text-gray-500 text-lg mb-10">Learn skills by swapping skills.</p>

      <div className="flex flex-col w-full gap-4">
        <Link href="/auth" className="w-full py-4 bg-black text-white font-bold rounded-xl active:scale-95 transition-transform">
          Log in
        </Link>
        <Link href="/auth?signup=true" className="w-full py-4 bg-white text-black border border-black font-bold rounded-xl active:scale-95 transition-transform">
          Sign up
        </Link>
      </div>

      <div className="mt-12 text-xs text-gray-400">
        <p>Simple. Minimal. Connect.</p>
      </div>
    </div>
  );
}
