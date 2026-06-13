import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyVisits } from '../store/slices/visitSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Map as MapIcon, Plane, Calendar, User } from 'lucide-react';

// Pre-defined palette for stamps to make them look distinct and authentic
const stampColors = [
  '#E53E3E', '#DD6B20', '#38A169', '#3182CE', '#805AD5', '#D53F8C', '#718096', '#2C7A7B'
];

const Stamp = ({ country, date, index }) => {
  const color = stampColors[index % stampColors.length];
  const rotation = (index * 47) % 30 - 15; // Random-ish rotation between -15 and +15
  
  return (
    <div 
      className="relative flex flex-col items-center justify-center p-4 border-[3px] border-dashed rounded-full w-36 h-36 opacity-80 mix-blend-multiply"
      style={{ 
        borderColor: color, 
        color: color,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div className="absolute inset-2 border-[1.5px] border-solid rounded-full opacity-60" style={{ borderColor: color }}></div>
      <Plane className="w-6 h-6 mb-1 opacity-80" />
      <span className="font-bold text-lg uppercase tracking-wider text-center leading-tight truncate w-full px-2" style={{ fontFamily: 'monospace' }}>
        {country}
      </span>
      <span className="text-[10px] font-bold mt-1 tracking-widest opacity-80">
        ARRIVED
      </span>
      <span className="text-[11px] font-semibold mt-0.5 tracking-wider" style={{ fontFamily: 'monospace' }}>
        {new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
      </span>
    </div>
  );
};

const PassportPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { visits, loading } = useSelector((state) => state.visits);

  useEffect(() => {
    dispatch(fetchMyVisits());
  }, [dispatch]);

  if (loading && visits.length === 0) {
    return <div className="flex justify-center items-center py-32"><LoadingSpinner text="Locating Passport..." /></div>;
  }

  // Calculate unique countries visited
  const countryStamps = [];
  const countryMap = new Map();

  visits.forEach(visit => {
    if (visit.status !== 'visited') return;
    const place = visit.place;
    if (!place) return;

    let countryName = '';
    if (place.category === 'country') {
      countryName = place.name;
    } else if (place.country) {
      countryName = place.country;
    }

    if (countryName && !countryMap.has(countryName)) {
      countryMap.set(countryName, true);
      countryStamps.push({
        name: countryName,
        date: visit.visitedAt || visit.createdAt
      });
    }
  });

  return (
    <div className="w-full pb-12 animate-fade-in flex justify-center">
      {/* The Passport Booklet */}
      <div className="w-full max-w-4xl bg-[#1e2430] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row relative min-h-[600px] border border-zinc-800">
        
        {/* Binder Crease (Center) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-transparent via-black/30 to-transparent z-10 pointer-events-none shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"></div>

        {/* Left Page (Profile Info) */}
        <div className="flex-1 bg-[#F9F6EE] p-8 md:p-12 relative overflow-hidden flex flex-col">
          {/* Passport background watermark */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
            <MapIcon className="w-[150%] h-[150%]" />
          </div>

          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h2 className="text-[#1A365D] font-bold tracking-widest uppercase text-xl mb-1" style={{ fontFamily: 'serif' }}>TravelTracker</h2>
              <h3 className="text-zinc-500 font-semibold tracking-wider text-xs uppercase">Official Digital Passport</h3>
            </div>
            <div className="w-16 h-20 border border-[#1A365D] rounded-sm flex items-center justify-center bg-white shadow-sm p-1">
               {/* User Avatar Placeholder */}
               <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-300">
                 <User className="w-8 h-8" />
               </div>
            </div>
          </div>

          <div className="space-y-6 relative z-10 flex-1">
            <div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Explorer Name</p>
              <p className="text-xl font-bold text-zinc-900" style={{ fontFamily: 'monospace' }}>{user?.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Passport ID</p>
              <p className="text-lg font-bold text-zinc-900 uppercase" style={{ fontFamily: 'monospace' }}>
                TT-{user?._id?.substring(0, 8)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Date of Issue</p>
              <p className="text-lg font-bold text-zinc-900 flex items-center gap-2" style={{ fontFamily: 'monospace' }}>
                <Calendar className="w-4 h-4 text-zinc-400" />
                {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-dashed border-zinc-300 relative z-10">
             <div className="flex justify-between items-center">
               <div>
                 <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Countries Explored</p>
                 <p className="text-3xl font-black text-[#1A365D]">{countryStamps.length}</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Rank</p>
                 <p className="text-lg font-bold text-[#ED8936] uppercase" style={{ fontFamily: 'monospace' }}>
                   {user?.explorerRank || 'Novice'}
                 </p>
               </div>
             </div>
          </div>
        </div>

        {/* Right Page (Stamps) */}
        <div className="flex-1 bg-[#FDFBF7] p-8 md:p-12 relative overflow-hidden flex flex-col">
          {/* Stamps Background Texture */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A365D 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          <h3 className="text-center text-zinc-300 font-bold tracking-[0.5em] uppercase text-sm mb-8">Visas & Stamps</h3>

          {countryStamps.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 opacity-60">
              <Plane className="w-12 h-12 mb-4" />
              <p className="text-center font-medium max-w-[200px]">Your pages are empty. Time to book a flight!</p>
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-2 gap-4 place-items-center auto-rows-max relative z-10">
              {countryStamps.map((stamp, index) => (
                <Stamp key={stamp.name} country={stamp.name} date={stamp.date} index={index} />
              ))}
            </div>
          )}
          
          <div className="mt-auto pt-8 flex justify-between items-center text-zinc-300">
             <span className="text-xs font-bold font-mono">P &lt; 2</span>
             <span className="text-xs font-bold font-mono">TRAVELTRACKER &gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PassportPage;
