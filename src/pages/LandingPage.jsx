import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HiGlobeAmericas,
  HiMapPin,
  HiTrophy,
  HiSparkles,
  HiChartBar,
  HiArrowRight,
  HiCheckCircle,
  HiUserPlus,
  HiMap,
} from 'react-icons/hi2';

const features = [
  {
    icon: <HiMapPin className="w-6 h-6" />,
    title: 'Track Your Visits',
    description:
      'Log every country, city, state, wonder, and fort you explore. Watch your world map fill up.',
  },
  {
    icon: <HiTrophy className="w-6 h-6" />,
    title: 'Earn Badges',
    description:
      'Unlock bronze, silver, gold, platinum, and legendary badges as you explore more of the world.',
  },
  {
    icon: <HiSparkles className="w-6 h-6" />,
    title: 'Discover Hidden Gems',
    description:
      'Submit undiscovered places and get them verified by our community admins for special rewards.',
  },
  {
    icon: <HiChartBar className="w-6 h-6" />,
    title: 'View Your Stats',
    description:
      "See detailed exploration statistics — how much of the world you've covered across every category.",
  },
];

const steps = [
  {
    icon: <HiUserPlus className="w-7 h-7" />,
    title: 'Create Account',
    description: 'Sign up in seconds and set up your explorer profile.',
    number: '01',
  },
  {
    icon: <HiMap className="w-7 h-7" />,
    title: 'Log Your Visits',
    description: "Browse places and check off the ones you've visited.",
    number: '02',
  },
  {
    icon: <HiTrophy className="w-7 h-7" />,
    title: 'Earn Rewards',
    description: 'Unlock badges and climb the explorer leaderboard.',
    number: '03',
  },
];

const stats = [
  { label: 'Countries', value: '195+', icon: '🌍' },
  { label: 'Cities', value: '500+', icon: '🏙️' },
  { label: 'Wonders', value: '50+', icon: '🏛️' },
  { label: 'Forts', value: '100+', icon: '🏰' },
];

const LandingPage = ({ onAuthOpen }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      onAuthOpen('signup');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center pt-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-sm font-medium mb-8 animate-fade-in">
            <HiGlobeAmericas className="w-4 h-4" />
            Your Personal Travel Explorer
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-zinc-900 leading-tight mb-6 animate-slide-up tracking-tight">
            Track Your World{' '}
            <span className="text-zinc-400">Adventures</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Log every place you visit, earn badges for your achievements, and
            discover hidden gems around the globe.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={handleGetStarted} className="btn-primary text-base !px-8 !py-3.5 flex items-center gap-2">
              Get Started Free
              <HiArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (user) navigate('/explore');
                else onAuthOpen('login');
              }}
              className="btn-secondary text-base !px-8 !py-3.5"
            >
              Explore Places
            </button>
          </div>

          {/* Floating Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-20 max-w-3xl mx-auto animate-stagger">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="card text-center hover:border-zinc-300 transition-colors"
              >
                <span className="text-xl block mb-1">{stat.icon}</span>
                <div className="text-xl font-bold text-zinc-900">{stat.value}</div>
                <div className="text-xs text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">Everything You Need</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              A complete toolkit for the modern explorer — track, compete, and discover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-stagger">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card group hover:border-zinc-300 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center"
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">How It Works</h2>
            <p className="text-zinc-500 max-w-lg mx-auto">
              Getting started is simple. Three easy steps to begin your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-stagger">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative text-center">
                <div className="card hover:border-zinc-300 transition-all duration-200">
                  {/* Number */}
                  <div className="text-3xl font-black text-zinc-200 mb-4">
                    {step.number}
                  </div>
                  {/* Icon */}
                  <div className="w-12 h-12 mx-auto rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="card !p-12 border-zinc-200">
            <HiGlobeAmericas className="w-10 h-10 text-zinc-400 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-4 tracking-tight">
              Ready to Start Exploring?
            </h2>
            <p className="text-zinc-500 mb-8 max-w-lg mx-auto">
              Join thousands of explorers tracking their adventures. Sign up now
              and start logging your world journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleGetStarted}
                className="btn-primary text-base !px-8 !py-3.5 flex items-center gap-2"
              >
                <HiCheckCircle className="w-5 h-5" />
                Create Free Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
