import { useEffect, useState, useRef, useCallback } from "react";
import { getProducts } from "../services/productService";
import {
  Package,
  Search,
  RefreshCw,
  LayoutGrid,
  TrendingUp,
  Boxes,
  IndianRupee,
  Tag,
  ChevronRight,
  Zap,
  AlertCircle,
  ShoppingBag,
  X,
} from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatNumber = (n) => new Intl.NumberFormat("en-IN").format(n);

const getInventoryHealth = (quantity) => {
  if (quantity <= 0) return { label: "Out of Stock", color: "text-red-400", bg: "bg-red-400/10", ring: "ring-red-500/30" };
  if (quantity < 10) return { label: "Critical", color: "text-orange-400", bg: "bg-orange-400/10", ring: "ring-orange-500/30" };
  if (quantity < 50) return { label: "Low Stock", color: "text-yellow-400", bg: "bg-yellow-400/10", ring: "ring-yellow-500/30" };
  return { label: "In Stock", color: "text-emerald-400", bg: "bg-emerald-400/10", ring: "ring-emerald-500/30" };
};

const CATEGORY_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-indigo-500 to-blue-600",
];

const getCategoryGradient = (category = "") => {
  const index = Math.abs(
    category.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  ) % CATEGORY_GRADIENTS.length;
  return CATEGORY_GRADIENTS[index];
};

const getCategoryIcon = (category = "") => {
  const lower = category.toLowerCase();
  if (lower.includes("electron")) return "💻";
  if (lower.includes("cloth") || lower.includes("fashion") || lower.includes("wear")) return "👕";
  if (lower.includes("food") || lower.includes("grocery")) return "🍎";
  if (lower.includes("book") || lower.includes("edu")) return "📚";
  if (lower.includes("sport") || lower.includes("fitness")) return "⚡";
  if (lower.includes("home") || lower.includes("furni")) return "🏠";
  if (lower.includes("beauty") || lower.includes("health")) return "✨";
  if (lower.includes("toy") || lower.includes("game")) return "🎮";
  return "📦";
};

// ─── Animated Counter ────────────────────────────────────────────────────────

function AnimatedCounter({ target, prefix = "", suffix = "", duration = 1200 }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return (
    <span>
      {prefix}{typeof target === "number" && target > 9999
        ? formatNumber(value)
        : value}{suffix}
    </span>
  );
}

// ─── Floating Particles ──────────────────────────────────────────────────────

function FloatingParticles() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * -20,
    opacity: Math.random() * 0.3 + 0.05,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            animation: `float ${p.duration}s ${p.delay}s infinite ease-in-out alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          100% { transform: translateY(-40px) translateX(20px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease forwards; }
        .animate-slide-down { animation: slideDown 0.4s ease forwards; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); }
        .refresh-spin { animation: spin-slow 0.7s linear; }
      `}</style>
    </div>
  );
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-xl bg-white/10" />
        <div className="w-16 h-6 rounded-full bg-white/10" />
      </div>
      <div className="w-3/4 h-5 rounded bg-white/10 mb-2" />
      <div className="w-1/2 h-4 rounded bg-white/10 mb-5" />
      <div className="flex gap-2">
        <div className="w-20 h-6 rounded-full bg-white/10" />
        <div className="w-20 h-6 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, gradient, delay = 0 }) {
  return (
    <div
      className="animate-fade-in relative group bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden card-hover cursor-default"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* gradient glow */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20 mb-4`}>
          <Icon size={20} className="text-white" />
        </div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
      </div>

      {/* bottom gradient line */}
      <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${gradient} opacity-40 group-hover:opacity-70 transition-opacity`} />
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, index }) {
  const health = getInventoryHealth(product.quantity);
  const gradient = getCategoryGradient(product.category);
  const icon = getCategoryIcon(product.category);

  return (
    <div
      className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 card-hover animate-fade-in overflow-hidden cursor-default"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* ambient glow on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl pointer-events-none`} />

      {/* top row */}
      <div className="flex items-start justify-between mb-5">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shadow-lg`}>
          {icon}
        </div>
        <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ring-1 ${health.bg} ${health.color} ${health.ring}`}>
          {health.label}
        </span>
      </div>

      {/* name */}
      <h3 className="text-base font-semibold text-white leading-snug mb-1 group-hover:text-slate-100 transition-colors">
        {product.productName}
      </h3>

      {/* category */}
      <p className="text-xs text-slate-500 mb-5 flex items-center gap-1">
        <Tag size={11} />
        {product.category}
      </p>

      {/* price + qty */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r ${gradient} text-white shadow-sm`}>
          <IndianRupee size={11} />
          {formatNumber(product.price)}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/8 text-slate-300 ring-1 ring-white/10">
          <Boxes size={11} />
          {formatNumber(product.quantity)} units
        </span>
      </div>

      {/* hover accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-b-2xl`} />
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar({ search, onSearch, onRefresh, isRefreshing, productCount }) {
  const [now, setNow] = useState(new Date());
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dateStr = now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <header className="sticky top-0 z-50 animate-slide-down">
      <div className="bg-slate-950/80 backdrop-blur-xl border-b border-white/8 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5 mr-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg" style={{ animation: "pulse-ring 2.5s infinite" }}>
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight hidden sm:block">
              Inventra
            </span>
          </div>

          {/* Search */}
          <div className={`flex-1 max-w-md relative transition-all duration-300 ${focused ? "scale-[1.01]" : ""}`}>
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500/60 focus:border-violet-500/40 transition-all"
            />
            {search && (
              <button onClick={() => onSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Date/time */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[11px] font-medium text-slate-300">{timeStr}</span>
              <span className="text-[10px] text-slate-600">{dateStr}</span>
            </div>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? "refresh-spin" : ""} />
              <span className="hidden sm:block">Refresh</span>
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-[12px] font-bold text-white shadow-lg ring-2 ring-violet-500/30">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ isFiltered, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
        <ShoppingBag size={28} className="text-slate-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">
        {isFiltered ? "No products match your search" : "No products yet"}
      </h3>
      <p className="text-sm text-slate-600 mb-6 text-center max-w-xs">
        {isFiltered
          ? "Try a different keyword or clear the search filter."
          : "Add products to your inventory to see them here."}
      </p>
      {isFiltered && (
        <button
          onClick={onClear}
          className="px-4 py-2 text-sm font-medium rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors"
        >
          Clear Search
        </button>
      )}
    </div>
  );
}

// ─── Error State ─────────────────────────────────────────────────────────────

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
        <AlertCircle size={28} className="text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">Failed to load products</h3>
      <p className="text-sm text-slate-600 mb-6 text-center max-w-xs">
        Could not connect to the server. Check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 transition-colors"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const fetchProducts = useCallback(async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      else setLoading(true);

      setError(false);
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(false);
  }, [fetchProducts]);

  const filtered = products.filter((p) =>
  (p.productName || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);

  // Derived stats
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalQty = products.reduce((sum, p) => sum + p.quantity, 0);
  const uniqueCategories = new Set(products.map((p) => p.category)).size;

  const stats = [
    {
      icon: LayoutGrid,
      label: "Total Products",
      value: <AnimatedCounter target={products.length} />,
      sub: `${filtered.length} visible`,
      gradient: "from-violet-500 to-indigo-600",
      delay: 0,
    },
    {
      icon: Tag,
      label: "Categories",
      value: <AnimatedCounter target={uniqueCategories} />,
      sub: "Distinct types",
      gradient: "from-cyan-500 to-blue-600",
      delay: 80,
    },
    {
      icon: Boxes,
      label: "Total Inventory",
      value: <AnimatedCounter target={totalQty} />,
      sub: "Units in stock",
      gradient: "from-emerald-500 to-teal-600",
      delay: 160,
    },
    {
      icon: TrendingUp,
      label: "Inventory Value",
      value: formatCurrency(totalValue),
      sub: "At current prices",
      gradient: "from-rose-500 to-pink-600",
      delay: 240,
    },
  ];

  return (
    <div className="min-h-screen bg-[#080b14] text-white relative">

      {/* Background */}
      <FloatingParticles />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-700/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-700/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-700/10 rounded-full blur-[90px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Navbar */}
      <Navbar
        search={search}
        onSearch={setSearch}
        onRefresh={() => fetchProducts(true)}
        isRefreshing={isRefreshing}
        productCount={products.length}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">

        {/* Hero */}
        <section className="pt-14 pb-12 animate-fade-in">
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase tracking-widest">
              <Zap size={10} />
              Live Dashboard
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Product{" "}
            <span
              className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Intelligence
            </span>
            <br className="hidden sm:block" />
            {" "}Dashboard
          </h1>
          <p className="text-slate-500 text-base max-w-lg">
            Real-time inventory visibility across your entire product catalog — powered by Spring Boot and React.
          </p>
        </section>

        {/* Stats */}
        {!loading && !error && (
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </section>
        )}

        {/* Section Header */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <Package size={18} className="text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
                Products
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-500">
                {filtered.length}
              </span>
            </div>
            {search && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Filtering for</span>
                <span className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/20 font-medium">
                  "{search}"
                </span>
                <button onClick={() => setSearch("")} className="ml-1 text-slate-600 hover:text-slate-400 transition-colors">
                  <X size={13} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <ErrorState onRetry={() => fetchProducts(false)} />
        ) : filtered.length === 0 ? (
          <EmptyState isFiltered={!!search} onClear={() => setSearch("")} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductDashboard;
