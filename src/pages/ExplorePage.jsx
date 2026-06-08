import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaces, fetchCountries } from '../store/slices/placeSlice';
import { fetchVisitedIds, toggleVisit } from '../store/slices/visitSlice';
import PlaceCard from '../components/ui/PlaceCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import API from '../utils/api';
import toast from 'react-hot-toast';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
} from 'lucide-react';

const categories = [
  { key: '', label: 'All', icon: '🌐' },
  { key: 'country', label: 'Countries', icon: '🌍' },
  { key: 'state', label: 'States', icon: '🏛️' },
  { key: 'city', label: 'Cities', icon: '🏙️' },
  { key: 'wonder', label: 'Wonders', icon: '✨' },
  { key: 'fort', label: 'Forts', icon: '🏰' },
  { key: 'landmark', label: 'Landmarks', icon: '📍' },
];

const categoryIcons = {
  country: '🌍',
  state: '🏛️',
  city: '🏙️',
  wonder: '✨',
  fort: '🏰',
  landmark: '📍',
};

const ExplorePage = () => {
  const dispatch = useDispatch();
  const { places, total, page, pages, loading } = useSelector((state) => state.places);
  const { visitedIds, toggleLoading } = useSelector((state) => state.visits);
  const { countries } = useSelector((state) => state.places);

  const [activeCategory, setActiveCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Regional Nested Explorers states
  const [exploringState, setExploringState] = useState(null);
  const [statePlaces, setStatePlaces] = useState([]);
  const [stateLoading, setStateLoading] = useState(false);

  const [exploringCity, setExploringCity] = useState(null);
  const [cityPlaces, setCityPlaces] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);

  const [exploringCountry, setExploringCountry] = useState(null);
  const [countryPlaces, setCountryPlaces] = useState([]);
  const [countryLoading, setCountryLoading] = useState(false);

  const loadPlaces = useCallback(() => {
    const params = { page: currentPage, limit: 24 };
    if (activeCategory) params.category = activeCategory;
    if (selectedCountry) params.country = selectedCountry;
    if (searchQuery) params.search = searchQuery;
    dispatch(fetchPlaces(params));
  }, [dispatch, currentPage, activeCategory, selectedCountry, searchQuery]);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  useEffect(() => {
    dispatch(fetchVisitedIds());
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setCurrentPage(1);
  };

  const handleToggle = async (placeId) => {
    try {
      const result = await dispatch(toggleVisit({ placeId })).unwrap();
      toast.success(result.message);
      loadPlaces();
    } catch (err) {
      toast.error(err || 'Failed to toggle visit');
    }
  };

  // State selection handler
  const handleExploreState = async (state) => {
    setExploringState(state);
    setStateLoading(true);
    try {
      const { data } = await API.get('/places', { params: { state: state.name, limit: 100 } });
      setStatePlaces(data.places || []);
    } catch (err) {
      toast.error('Failed to load places for this state');
    } finally {
      setStateLoading(false);
    }
  };

  // City selection handler
  const handleExploreCity = async (city) => {
    setExploringCity(city);
    setCityLoading(true);
    try {
      const { data } = await API.get('/places', { params: { city: city.name, limit: 100 } });
      setCityPlaces(data.places || []);
    } catch (err) {
      toast.error('Failed to load attractions for this city');
    } finally {
      setCityLoading(false);
    }
  };

  // Country selection handler
  const handleExploreCountry = async (country) => {
    setExploringCountry(country);
    setCountryLoading(true);
    try {
      const { data } = await API.get('/places', { params: { country: country.name, limit: 150 } });
      setCountryPlaces(data.places || []);
    } catch (err) {
      toast.error('Failed to load regions for this country');
    } finally {
      setCountryLoading(false);
    }
  };

  // Calculations for State progress
  const activeStatePlaces = statePlaces.filter((p) => p.category !== 'state' && p.category !== 'city' && p.category !== 'country');
  const visitedStatePlaces = activeStatePlaces.filter((p) => visitedIds.includes(p._id));
  const visitedStateCount = visitedStatePlaces.length;
  const totalStateCount = activeStatePlaces.length;
  const statePercentage = totalStateCount > 0 ? Math.round((visitedStateCount / totalStateCount) * 100) : 0;

  // Calculations for City progress
  const activeCityPlaces = cityPlaces.filter((p) => p.category !== 'city' && p.category !== 'state' && p.category !== 'country');
  const visitedCityPlaces = activeCityPlaces.filter((p) => visitedIds.includes(p._id));
  const visitedCityCount = visitedCityPlaces.length;
  const totalCityCount = activeCityPlaces.length;
  const cityPercentage = totalCityCount > 0 ? Math.round((visitedCityCount / totalCityCount) * 100) : 0;

  // Calculations for Country progress
  const activeCountryPlaces = countryPlaces.filter((p) => p.category !== 'country' && p.category !== 'state' && p.category !== 'city');
  const visitedCountryPlaces = activeCountryPlaces.filter((p) => visitedIds.includes(p._id));
  const visitedCountryCount = visitedCountryPlaces.length;
  const totalCountryCount = activeCountryPlaces.length;
  const countryPercentage = totalCountryCount > 0 ? Math.round((visitedCountryCount / totalCountryCount) * 100) : 0;

  // Reusable nested explorer modal content
  const renderNestedExplorer = ({ entity, entityPlaces, activeEntityPlaces, isLoading, visitedCount, totalCount, percentage, entityType }) => (
    <div className="space-y-5">
      <div className="relative h-44 w-full rounded-lg overflow-hidden border border-zinc-200">
        <img
          src={entity.imageUrl || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80"}
          alt={entity.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
            📍 {entity.country || entity.continent}
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">
            {entity.name}
          </h3>
        </div>
      </div>

      <p className="text-sm text-zinc-500 leading-relaxed bg-zinc-50 p-4 rounded-lg border border-zinc-100">
        {entity.description || `Explore the destinations across ${entity.name}!`}
      </p>

      {/* Progress */}
      <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-zinc-600">{entityType} Progress</span>
          <span className="text-sm font-semibold text-zinc-900">
            {percentage}% ({visitedCount} / {totalCount})
          </span>
        </div>
        <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-600 to-accent-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-zinc-900">
          Destinations in {entity.name}
        </h4>

        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner text="Loading..." />
          </div>
        ) : activeEntityPlaces.length === 0 ? (
          <div className="text-center py-8 bg-zinc-50 rounded-lg border border-zinc-100">
            <p className="text-sm text-zinc-400">No attractions registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {activeEntityPlaces.map((item) => {
              const isItemVisited = visitedIds.includes(item._id);
              return (
                <div
                  key={item._id}
                  onClick={() => handleToggle(item._id)}
                  className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    isItemVisited
                      ? 'bg-zinc-50 border-zinc-300'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 border border-zinc-200">
                        {categoryIcons[item.category] || '📍'} {item.category}
                      </span>
                      {item.city && (
                        <span className="text-xs text-zinc-400">
                          🏙️ {item.city}
                        </span>
                      )}
                      {item.state && !item.city && (
                        <span className="text-xs text-zinc-400">
                          🏛️ {item.state}
                        </span>
                      )}
                    </div>
                    <h5 className="text-sm font-medium text-zinc-900 truncate">{item.name}</h5>
                  </div>

                  <button
                    className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      isItemVisited
                        ? 'bg-primary-600 text-white'
                        : 'bg-zinc-100 text-zinc-300 hover:text-zinc-600 hover:bg-zinc-200 border border-zinc-200'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full pb-12 animate-fade-in">
      {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 tracking-tight">Explore Places</h1>
          <p className="text-zinc-500">
            Browse and mark your travel checklist. Found{' '}
            <span className="text-zinc-900 font-semibold">{total}</span> locations.
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6 !p-4 animate-slide-up">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-zinc-100 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search + Country */}
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search places..."
                className="input-field !pl-10 !pr-10"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <select
                value={selectedCountry}
                onChange={handleCountryChange}
                className="input-field !pl-10 appearance-none min-w-[180px] cursor-pointer"
              >
                <option value="">All Countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner text="Loading places..." />
        ) : places.length === 0 ? (
          <div className="card text-center py-16">
            <Search className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-zinc-500 mb-2">
              No places found
            </h3>
            <p className="text-sm text-zinc-400">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <>
            {/* Place Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8 animate-stagger">
              {places.map((place) => (
                <PlaceCard
                  key={place._id}
                  place={place}
                  isVisited={visitedIds.includes(place._id)}
                  onToggle={handleToggle}
                  isToggling={toggleLoading === place._id}
                  onExploreState={handleExploreState}
                  onExploreCity={handleExploreCity}
                  onExploreCountry={handleExploreCountry}
                />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary !px-2.5 !py-2 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                  let pageNum;
                  if (pages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pages - 2) {
                    pageNum = pages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-md text-sm font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'bg-zinc-100 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                  disabled={currentPage === pages}
                  className="btn-secondary !px-2.5 !py-2 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      {/* 🏛️ NESTED STATE EXPLORER MODAL */}
      <Modal
        isOpen={!!exploringState}
        onClose={() => setExploringState(null)}
        title={exploringState ? `Explore ${exploringState.name}` : ''}
        maxWidth="max-w-3xl"
      >
        {exploringState && renderNestedExplorer({
          entity: exploringState,
          entityPlaces: statePlaces,
          activeEntityPlaces: activeStatePlaces,
          isLoading: stateLoading,
          visitedCount: visitedStateCount,
          totalCount: totalStateCount,
          percentage: statePercentage,
          entityType: 'State Exploration',
        })}
      </Modal>

      {/* 🏙️ NESTED CITY EXPLORER MODAL */}
      <Modal
        isOpen={!!exploringCity}
        onClose={() => setExploringCity(null)}
        title={exploringCity ? `Explore ${exploringCity.name}` : ''}
        maxWidth="max-w-3xl"
      >
        {exploringCity && renderNestedExplorer({
          entity: exploringCity,
          entityPlaces: cityPlaces,
          activeEntityPlaces: activeCityPlaces,
          isLoading: cityLoading,
          visitedCount: visitedCityCount,
          totalCount: totalCityCount,
          percentage: cityPercentage,
          entityType: 'City Exploration',
        })}
      </Modal>

      {/* 🌍 NESTED COUNTRY EXPLORER MODAL */}
      <Modal
        isOpen={!!exploringCountry}
        onClose={() => setExploringCountry(null)}
        title={exploringCountry ? `Explore ${exploringCountry.name}` : ''}
        maxWidth="max-w-3xl"
      >
        {exploringCountry && renderNestedExplorer({
          entity: exploringCountry,
          entityPlaces: countryPlaces,
          activeEntityPlaces: activeCountryPlaces,
          isLoading: countryLoading,
          visitedCount: visitedCountryCount,
          totalCount: totalCountryCount,
          percentage: countryPercentage,
          entityType: 'Country Exploration',
        })}
      </Modal>
    </div>
  );
};

export default ExplorePage;
