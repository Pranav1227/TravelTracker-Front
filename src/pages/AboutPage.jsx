import { HiGlobeAmericas, HiMapPin, HiTrophy, HiSparkles, HiShieldCheck } from 'react-icons/hi2';

const AboutPage = () => {
  const steps = [
    {
      icon: <HiMapPin className="w-5 h-5" />,
      title: "1. Log Your Adventures",
      desc: "Mark off countries, cities, states, historic forts, and the 7 Wonders of the World that you have explored.",
    },
    {
      icon: <HiTrophy className="w-5 h-5" />,
      title: "2. Unlock Achievements",
      desc: "Climb through 5 badge tiers (Bronze to Legendary) as you expand your footprint across the globe.",
    },
    {
      icon: <HiSparkles className="w-5 h-5" />,
      title: "3. Share Hidden Gems",
      desc: "Discover local secrets and upload them. Earn recognition when admins verify your gem submissions.",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Hero Section */}
        <div className="text-center py-12 border-b border-zinc-100">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-950 text-white mb-6 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-white"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
            About TravelTracker
          </h1>
          <p className="text-base md:text-lg text-zinc-500 max-w-xl mx-auto leading-relaxed">
            Your personal digital scratch map. Log visits, uncover local hidden gems, and level up your global exploration.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3 flex items-center gap-2">
              <HiGlobeAmericas className="w-5 h-5 text-zinc-700" /> Our Mission
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We believe that exploration changes perspective. Our mission is to encourage conscious global and local travel by gamifying the experience and building a community-driven database of authentic, verified spots.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3 flex items-center gap-2">
              <HiShieldCheck className="w-5 h-5 text-zinc-700" /> Community Built
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              TravelTracker is built for travelers, by travelers. Every hidden gem is crowdsourced from the community and vetted by local moderators to maintain high quality recommendations and information.
            </p>
          </div>
        </div>

        {/* How It Works (Informative Step-by-Step) */}
        <div className="py-12 border-b border-zinc-100">
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="card relative hover:border-zinc-300 transition-colors duration-200">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-zinc-900 text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-12">
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What is a Hidden Gem?",
                a: "A Hidden Gem is a unique, off-the-beaten-path destination submitted by users (like secluded beaches, ancient local ruins, or scenic lookouts) that is not traditionally packed with commercial tourism.",
              },
              {
                q: "How do I earn badges?",
                a: "Badges are earned by logging visits in the 'Explore' tab. The more countries, cities, and landmarks you verify, the faster you progress from Bronze towards Legendary status.",
              },
              {
                q: "Can I log any custom place?",
                a: "You can submit any new custom location via the 'Hidden Gems' tab. Once reviewed and approved by an admin, it becomes visible to all explorers and logs automatically in your history.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-zinc-50 border border-zinc-100">
                <h4 className="text-sm font-semibold text-zinc-900 mb-1.5">{faq.q}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
