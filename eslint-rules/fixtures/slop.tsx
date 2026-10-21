// Deliberately sloppy baseline: what an unguided AI landing page looks like.
// Kept as "before" evidence for the lint rules and callouts. Do not fix.

const features = [
  { icon: "🚀", title: "Lightning Fast", body: "Blazing fast performance that scales with your business." },
  { icon: "🔒", title: "Secure by Default", body: "Enterprise-grade security you can trust." },
  { icon: "✨", title: "AI-Powered", body: "Harness the power of AI to supercharge your workflow." },
];

const testimonials = [
  { name: "Sarah Johnson", role: "CEO, TechCorp", quote: "This product completely transformed how we work. Highly recommend!" },
  { name: "Michael Chen", role: "CTO, StartupXYZ", quote: "Absolutely game-changing. We saved 10x the time." },
];

export default function SlopDraft() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="bg-white text-gray-900">
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-32 text-center text-white">
        <h1 style={{ fontFamily: "Inter, sans-serif" }} className="text-6xl font-extrabold">
          Supercharge Your Workflow 🚀
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl opacity-90">
          The all-in-one platform that empowers teams to unlock their full potential and take
          their business to the next level.
        </p>
        <button className="mt-10 rounded-full bg-white px-8 py-4 font-semibold text-purple-600 shadow-xl">
          Get Started Free ✨
        </button>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-4xl font-bold">Everything you need 🎯</h2>
        <div className="mt-12 rounded-3xl bg-gray-50 p-8 shadow-lg">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white p-6 shadow-md">
                <div className="rounded-xl bg-purple-100 p-4 text-3xl">{f.icon}</div>
                <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-gray-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-24">
        <h2 className="text-center text-4xl font-bold">Loved by 10,000+ teams ❤️</h2>
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white p-6 shadow-md">
              <p className="text-gray-700">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 font-semibold">{t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 px-6 py-24 text-center text-white">
        <h2 className="text-4xl font-bold">Ready to get started? 🎉</h2>
        <p className="mt-4">
          Questions? Email hello@example.com or call (555) 123-4567.
        </p>
      </section>
    </div>
  );
}
