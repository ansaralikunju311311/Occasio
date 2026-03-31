import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Seat {
  _id: string;
  block: string;
  row: number;
  column: number;
  status: "AVAILABLE" | "HELD" | "BOOKED";
}

/** Grouped structure built from the flat seat array */
interface GroupedBlock {
  blockName: string;
  rows: {
    rowNumber: number;
    seats: Seat[];
  }[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BLOCK_ACCENT_COLORS: Record<number, { glow: string; dot: string; header: string }> = {
  0: {
    glow: "rgba(99,102,241,0.12)",
    dot: "bg-indigo-500",
    header: "from-indigo-600 to-violet-700",
  },
  1: {
    glow: "rgba(16,185,129,0.12)",
    dot: "bg-emerald-500",
    header: "from-emerald-500 to-teal-700",
  },
  2: {
    glow: "rgba(244,63,94,0.12)",
    dot: "bg-rose-500",
    header: "from-rose-500 to-pink-700",
  },
  3: {
    glow: "rgba(251,191,36,0.12)",
    dot: "bg-amber-400",
    header: "from-amber-400 to-orange-600",
  },
  4: {
    glow: "rgba(14,165,233,0.12)",
    dot: "bg-sky-500",
    header: "from-sky-500 to-blue-700",
  },
  5: {
    glow: "rgba(192,38,211,0.12)",
    dot: "bg-fuchsia-500",
    header: "from-fuchsia-500 to-purple-800",
  },
};

const getAccent = (idx: number) =>
  BLOCK_ACCENT_COLORS[idx % Object.keys(BLOCK_ACCENT_COLORS).length];

// ─── Helper: group flat seat array into block→row hierarchy ──────────────────

const groupSeats = (seats: Seat[]): GroupedBlock[] => {
  const blockMap = new Map<string, Map<number, Seat[]>>();

  for (const seat of seats) {
    if (!blockMap.has(seat.block)) blockMap.set(seat.block, new Map());
    const rowMap = blockMap.get(seat.block)!;
    if (!rowMap.has(seat.row)) rowMap.set(seat.row, []);
    rowMap.get(seat.row)!.push(seat);
  }

  // Sort blocks alphabetically, rows & columns numerically
  const grouped: GroupedBlock[] = Array.from(blockMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([blockName, rowMap]) => ({
      blockName,
      rows: Array.from(rowMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([rowNumber, rowSeats]) => ({
          rowNumber,
          seats: [...rowSeats].sort((a, b) => a.column - b.column),
        })),
    }));

  return grouped;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SeatButtonProps {
  seat: Seat;
  isSelected: boolean;
  blockIdx: number;
  onClick: (id: string, status: string) => void;
}

const SeatButton = ({ seat, isSelected, blockIdx, onClick }: SeatButtonProps) => {
  const label = `${seat.block}-${seat.row}-${seat.column}`;
  const accent = getAccent(blockIdx);

  const colorClasses = (() => {
    if (seat.status === "BOOKED") {
      return "bg-red-950/60 border-red-800/40 text-red-700/60 cursor-not-allowed opacity-60";
    }
    if (seat.status === "HELD") {
      return "bg-amber-950/60 border-amber-600/40 text-amber-500/80 cursor-not-allowed opacity-80";
    }
    // AVAILABLE
    if (isSelected) {
      return "bg-white border-white text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.4)] scale-110 z-20";
    }
    return "bg-slate-900/60 border-white/8 text-slate-400 hover:border-white/30 hover:text-white hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)] hover:bg-slate-800/60";
  })();

  return (
    <button
      id={`seat-${seat._id}`}
      aria-label={`Seat ${label} – ${seat.status}`}
      onClick={() => onClick(seat._id, seat.status)}
      disabled={seat.status !== "AVAILABLE"}
      title={label}
      className={`relative min-w-[3.8rem] h-11 rounded-2xl border font-black text-[10px] transition-all duration-300 transform select-none px-1.5 active:scale-90 leading-tight ${colorClasses}`}
    >
      <span className="block truncate">{label}</span>

      {/* Status indicator dot */}
      {seat.status === "AVAILABLE" && !isSelected && (
        <span
          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${accent.dot} opacity-50 blur-[1px]`}
        />
      )}
    </button>
  );
};

// ─── Legend ───────────────────────────────────────────────────────────────────

const Legend = () => (
  <div className="mt-24 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-10">
    {[
      {
        label: "Available",
        cls: "bg-slate-800/80 border-white/10",
        text: "text-slate-400",
      },
      {
        label: "Selected",
        cls: "bg-white border-white shadow-[0_0_10px_white]",
        text: "text-white",
      },
      {
        label: "Held",
        cls: "bg-amber-950/60 border-amber-600/40",
        text: "text-amber-400",
      },
      {
        label: "Booked",
        cls: "bg-red-950/60 border-red-700/40",
        text: "text-red-400",
      },
    ].map((item) => (
      <div key={item.label} className="flex items-center gap-2.5">
        <div className={`w-5 h-5 rounded-lg border-2 ${item.cls}`} />
        <span className={`text-[10px] font-black uppercase tracking-widest ${item.text}`}>
          {item.label}
        </span>
      </div>
    ))}
  </div>
);

// ─── Block Panel ──────────────────────────────────────────────────────────────

interface BlockPanelProps {
  block: GroupedBlock;
  blockIdx: number;
  selectedSeats: string[];
  onSeatClick: (id: string, status: string) => void;
}

const BlockPanel = ({ block, blockIdx, selectedSeats, onSeatClick }: BlockPanelProps) => {
  const accent = getAccent(blockIdx);
  const totalSeats = block.rows.reduce((sum, r) => sum + r.seats.length, 0);
  const availableSeats = block.rows
    .flatMap((r) => r.seats)
    .filter((s) => s.status === "AVAILABLE").length;

  return (
    <div className="relative group perspective-1000">
      {/* Ambient glow on hover */}
      <div
        className="absolute -inset-10 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
        style={{ background: accent.glow }}
      />

      <div className="relative z-10 space-y-10 transition-transform duration-700 group-hover:scale-[1.005]">
        {/* Block Header */}
        <div className="flex items-end justify-between border-b border-white/5 pb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className={`w-3.5 h-3.5 rounded-full ${accent.dot} shadow-lg`} />
              <h3 className="text-3xl font-black text-white tracking-tighter">
                Block {block.blockName}
              </h3>
            </div>
            <div className="flex items-center gap-2 ml-6">
              <span className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest border border-white/5">
                {availableSeats} / {totalSeats} seats available
              </span>
            </div>
          </div>

          {/* Row count badge */}
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            {block.rows.length} row{block.rows.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Rows */}
        <div className="flex flex-col items-center gap-6 py-8 px-4 rounded-[3rem] group-hover:bg-white/[0.01] border border-transparent group-hover:border-white/5 transition-all duration-700">
          {block.rows.map((row) => (
            <div
              key={row.rowNumber}
              className="flex items-center gap-6 w-full justify-between max-w-5xl"
            >
              {/* Left row label */}
              <span className="w-14 shrink-0 text-[10px] font-black text-slate-700 text-center uppercase tracking-tighter opacity-60">
                R-{row.rowNumber}
              </span>

              {/* Seats */}
              <div className="flex flex-wrap justify-center gap-3 flex-1">
                {row.seats.map((seat, colIdx) => (
                  <SeatButton
                    key={seat._id}
                    seat={seat}
                    isSelected={selectedSeats.includes(seat._id)}
                    blockIdx={blockIdx}
                    onClick={onSeatClick}
                  />
                ))}
              </div>

              {/* Right row label */}
              <span className="w-14 shrink-0 text-[10px] font-black text-slate-700 text-center uppercase tracking-tighter opacity-60">
                R-{row.rowNumber}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingType, setBookingType] = useState<"physical" | "online">("physical");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/eventDetails/${id}`);
        setEvent(response.data.events);
      } catch {
        toast.error("Failed to load event details");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id, navigate]);

  // ── Group the flat seats array ───────────────────────────────────────────
  const groupedBlocks = useMemo<GroupedBlock[]>(() => {
    const seats: Seat[] = event?.seats ?? [];
    return groupSeats(seats);
  }, [event]);

  // ── Seat selection logic ─────────────────────────────────────────────────
  const handleSeatClick = (seatId: string, status: string) => {
    if (status !== "AVAILABLE") return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  // ── Derive selected seat details for summary ────────────────────────────
  const selectedSeatDetails = useMemo(() => {
    const all = groupedBlocks.flatMap((b) => b.rows.flatMap((r) => r.seats));
    return selectedSeats
      .map((sid) => all.find((s) => s._id === sid))
      .filter(Boolean) as Seat[];
  }, [selectedSeats, groupedBlocks]);

  // ── Guards ───────────────────────────────────────────────────────────────
  if (loading) return <LoadingSpinner />;
  if (!event) return null;

  // ONLINE events always show the online pass view.
  // HYBRID events respect the bookingType toggle.
  // OFFLINE events always show the physical seat layout.
  const isOnlineMode =
    event.eventType === "ONLINE" || bookingType === "online";
  const canCheckout = isOnlineMode || selectedSeats.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-16 px-6 relative overflow-hidden font-sans">
      {/* ── Background ambient blobs ─────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:700ms]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-emerald-600/5 blur-[120px] rounded-full animate-pulse [animation-delay:1000ms]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── Page Header ────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
              <span
                className="hover:text-white cursor-pointer transition-colors"
                onClick={() => navigate("/")}
              >
                Home
              </span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-indigo-400">Seat Selection</span>
            </nav>

            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black border border-indigo-500/20 uppercase tracking-tighter">
                {event.eventType} Event
              </span>
              {event.location?.address && (
                <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location.address}
                </div>
              )}
            </div>
          </div>

          {/* Booking type toggle – shown for HYBRID events */}
          {event.eventType === "HYBRID" && (
            <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-3xl">
              {(["physical", "online"] as const).map((type) => (
                <button
                  key={type}
                  id={`booking-type-${type}`}
                  onClick={() => setBookingType(type)}
                  className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 capitalize ${bookingType === type
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)]"
                      : "text-slate-400 hover:text-white"
                    }`}
                >
                  {type === "physical" ? "In-Person" : "Online Pass"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Main grid ──────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-4 gap-12">
          {/* ── Seating Area ─────────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-12">
            {!isOnlineMode ? (
              <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-10 md:p-20 shadow-2xl">
                {/* Stage graphic */}
                <div className="relative mb-28 flex flex-col items-center">
                  <div className="w-[85%] h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent rounded-full shadow-[0_4px_30px_rgba(99,102,241,0.6)]" />
                  <div className="w-[80%] h-28 bg-gradient-to-b from-indigo-500/5 to-transparent blur-3xl rounded-[50%] -mt-10 opacity-60" />
                  <div className="absolute -top-12 flex flex-col items-center">
                    <div className="px-6 py-1.5 rounded-full bg-slate-900 border border-white/10 shadow-2xl mb-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">
                        Central Stage
                      </span>
                    </div>
                  </div>
                </div>

                {/* Blocks */}
                {groupedBlocks.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest">
                      No seats available for this event.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-28">
                    {groupedBlocks.map((block, idx) => (
                      <BlockPanel
                        key={block.blockName}
                        block={block}
                        blockIdx={idx}
                        selectedSeats={selectedSeats}
                        onSeatClick={handleSeatClick}
                      />
                    ))}
                  </div>
                )}

                <Legend />
              </div>
            ) : (
              /* Online pass card */
              <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-12 md:p-24 text-center">
                <div className="w-32 h-32 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-indigo-500/20 relative group">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full group-hover:scale-125 transition-transform duration-500" />
                  <svg className="w-16 h-16 text-indigo-400 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-4xl font-black text-white mb-6">Virtual Experience Pass</h3>
                <p className="text-slate-400 max-w-sm mx-auto mb-12 text-lg font-light leading-relaxed">
                  Join the global audience and catch every moment live from the best seat in your house.
                </p>
                <div className="inline-flex flex-col p-8 bg-black/40 rounded-[2rem] border border-white/5 backdrop-blur-xl">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Streaming Access</p>
                  <p className="text-5xl font-black text-white tracking-tighter">${event.price}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar Summary ───────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Summary
                </h3>

                {/* Selected seat list */}
                <div className="space-y-4 mb-10 max-h-[280px] overflow-y-auto pr-1">
                  {isOnlineMode ? (
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                      <div>
                        <p className="text-white font-bold">Online Pass</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          1× Multi-device access
                        </p>
                      </div>
                      <span className="text-indigo-400 font-black">${event.price}</span>
                    </div>
                  ) : selectedSeatDetails.length > 0 ? (
                    selectedSeatDetails.map((seat) => (
                      <div
                        key={seat._id}
                        className="flex justify-between items-center group"
                      >
                        <div>
                          <p className="text-white font-bold text-sm">
                            Seat {seat.block}-{seat.row}-{seat.column}
                          </p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Block {seat.block}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSeatClick(seat._id, "AVAILABLE")}
                          className="text-red-500/60 hover:text-red-400 transition-colors"
                          title="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                        <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </div>
                      <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
                        Select your seats
                      </p>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-6 border-t border-white/10 flex justify-between items-center mb-8">
                  <span className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                    {isOnlineMode ? "Pass" : `${selectedSeats.length} seat${selectedSeats.length !== 1 ? "s" : ""}`}
                  </span>
                  <span className="text-3xl font-black text-white tracking-tighter">
                    {isOnlineMode ? `$${event.price}` : `${selectedSeats.length} selected`}
                  </span>
                </div>

                {/* CTA */}
                <button
                  id="checkout-btn"
                  disabled={!canCheckout}
                  onClick={() =>
                    navigate(`/checkout/${event.id}`, {
                      state: { selectedSeats, bookingType },
                    })
                  }
                  className={`w-full py-5 rounded-[1.5rem] font-bold text-base transition-all duration-300 relative group ${canCheckout
                      ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-[0_20px_50px_-15px_rgba(79,70,229,0.5)] hover:shadow-[0_30px_60px_-12px_rgba(79,70,229,0.6)] hover:-translate-y-1.5 active:scale-95"
                      : "bg-slate-800/50 text-slate-700 border border-white/5 cursor-not-allowed"
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Checkout Now
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-3 px-4 py-3 bg-white/[0.02] rounded-2xl border border-white/5">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Secured Encryption Payment
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
