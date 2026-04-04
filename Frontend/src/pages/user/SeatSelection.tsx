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

interface GroupedBlock {
  blockName: string;
  categoryName: string;
  categoryPrice: number | null;
  rows: { rowNumber: number; seats: Seat[] }[];
}

// ─── Helper: group flat seats by block → row ──────────────────────────────────

const groupSeats = (seats: Seat[], layoutBlocks: any[] = []): GroupedBlock[] => {
  const blockMap = new Map<string, Map<number, Seat[]>>();
  for (const seat of seats) {
    if (!blockMap.has(seat.block)) blockMap.set(seat.block, new Map());
    const rowMap = blockMap.get(seat.block)!;
    if (!rowMap.has(seat.row)) rowMap.set(seat.row, []);
    rowMap.get(seat.row)!.push(seat);
  }
  // Build blocks, then sort by price ascending:
  // cheapest at top (far from stage) → most expensive at bottom (near stage)
  const blocks = Array.from(blockMap.entries()).map(([blockName, rowMap]) => {
    const lb = layoutBlocks.find(
      (b: any) => (b.blockName || b.blocName)?.toUpperCase() === blockName.toUpperCase()
    );
    return {
      blockName,
      categoryName: lb?.category?.name ?? "",
      categoryPrice: lb?.category?.price ?? null,
      rows: Array.from(rowMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([rowNumber, rowSeats]) => ({
          rowNumber,
          seats: [...rowSeats].sort((a, b) => a.column - b.column),
        })),
    };
  });

  // Sort: highest price at top (far from stage) → lowest price at bottom (near stage/screen)
  blocks.sort((a, b) => {
    const priceA = a.categoryPrice ?? 0;
    const priceB = b.categoryPrice ?? 0;
    return priceB - priceA;
  });

  return blocks;
};

// ─── Seat Button ──────────────────────────────────────────────────────────────

interface SeatBtnProps {
  seat: Seat;
  isSelected: boolean;
  onClick: (id: string, status: string) => void;
}

const SeatBtn = ({ seat, isSelected, onClick }: SeatBtnProps) => {
  const col = String(seat.column).padStart(2, "0");

  let cls = "";
  if (seat.status === "BOOKED") {
    cls = "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed";
  } else if (seat.status === "HELD") {
    cls = "bg-amber-50 border-amber-400 text-amber-600 cursor-not-allowed";
  } else if (isSelected) {
    cls = "bg-green-500 border-green-500 text-white shadow-md scale-105";
  } else {
    cls =
      "bg-white border-gray-300 text-gray-600 hover:border-green-400 hover:bg-green-50 hover:text-green-700 cursor-pointer";
  }

  return (
    <button
      id={`seat-${seat._id}`}
      aria-label={`Seat ${seat.block}-${seat.row}-${seat.column} ${seat.status}`}
      title={`${seat.block}-${seat.row}-${seat.column}`}
      disabled={seat.status !== "AVAILABLE"}
      onClick={() => onClick(seat._id, seat.status)}
      className={`w-8 h-8 rounded border text-[10px] font-bold transition-all duration-150 select-none flex items-center justify-center ${cls}`}
    >
      {col}
    </button>
  );
};

// ─── Block Section ────────────────────────────────────────────────────────────

interface BlockSectionProps {
  block: GroupedBlock;
  selectedSeats: string[];
  onSeatClick: (id: string, status: string) => void;
}

const BlockSection = ({ block, selectedSeats, onSeatClick }: BlockSectionProps) => {
  // Figure out aisle position: split after ~40% of columns
  const maxCols = Math.max(...block.rows.map((r) => r.seats.length), 1);
  const aisleAfter = Math.floor(maxCols * 0.35); // aisle after this many seats

  const priceLabel = block.categoryPrice !== null ? `₹${block.categoryPrice}` : "";
  const nameLabel = block.categoryName || `Block ${block.blockName}`;
  const header = [priceLabel, nameLabel.toUpperCase()].filter(Boolean).join("  ");

  return (
    <div className="mb-2">
      {/* Category header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-bold text-gray-500 tracking-widest whitespace-nowrap px-2">
          {header}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-1.5 items-center">
        {block.rows.map((row) => {
          const left = row.seats.slice(0, aisleAfter);
          const right = row.seats.slice(aisleAfter);
          return (
            <div key={row.rowNumber} className="flex items-center gap-2 w-full justify-center">
              {/* Left seats */}
              <div className="flex gap-1">
                {left.map((seat) => (
                  <SeatBtn
                    key={seat._id}
                    seat={seat}
                    isSelected={selectedSeats.includes(seat._id)}
                    onClick={onSeatClick}
                  />
                ))}
              </div>
              {/* Aisle gap */}
              <div className="w-6" />
              {/* Right seats */}
              <div className="flex gap-1">
                {right.map((seat) => (
                  <SeatBtn
                    key={seat._id}
                    seat={seat}
                    isSelected={selectedSeats.includes(seat._id)}
                    onClick={onSeatClick}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Legend ───────────────────────────────────────────────────────────────────

const Legend = () => (
  <div className="flex flex-wrap items-center justify-center gap-6 pt-6 mt-4 border-t border-gray-100">
    {[
      { label: "Available", cls: "border-gray-300 bg-white" },
      { label: "Selected",  cls: "border-green-500 bg-green-500" },
      { label: "Held",      cls: "border-amber-400 bg-amber-50" },
      { label: "Sold",      cls: "border-gray-200 bg-gray-200" },
    ].map((item) => (
      <div key={item.label} className="flex items-center gap-1.5">
        <div className={`w-5 h-5 rounded border-2 ${item.cls}`} />
        <span className="text-[11px] text-gray-500 font-medium">{item.label}</span>
      </div>
    ))}
  </div>
);

// ─── Stage graphic ────────────────────────────────────────────────────────────

const Stage = () => (
  <div className="flex flex-col items-center mt-10 mb-2">
    <div
      className="w-[60%] h-10 rounded-b-[50%] bg-gradient-to-b from-gray-200 to-gray-100 border border-gray-200 flex items-center justify-center"
    >
      <span className="text-[10px] font-bold text-gray-400 tracking-[0.3em] uppercase">Stage</span>
    </div>
  </div>
);

// ─── Online Pass Card ─────────────────────────────────────────────────────────

const OnlinePassCard = ({ price }: { price: number }) => (
  <div className="flex flex-col items-center justify-center py-20 px-8 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
    <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6">
      <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">Virtual Experience Pass</h3>
    <p className="text-gray-400 max-w-xs mb-8 text-sm leading-relaxed">
      Watch live from anywhere. Full HD streaming with multi-device access.
    </p>
    <div className="px-8 py-4 bg-indigo-50 rounded-xl border border-indigo-100">
      <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Price</p>
      <p className="text-3xl font-black text-indigo-600">₹{price}</p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

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

  // Group flat seat array
  const groupedBlocks = useMemo<GroupedBlock[]>(() => {
    const seats: Seat[] = event?.seats ?? [];
    const layoutBlocks: any[] =
      event?.SeatLayout?.blocks ??
      event?.seatLayout?.blocks ??
      event?.seatLayoutDetails?.blocks ??
      event?.layout?.blocks ??
      [];
    return groupSeats(seats, layoutBlocks);
  }, [event]);

  const handleSeatClick = (seatId: string, status: string) => {
    if (status !== "AVAILABLE") return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const selectedSeatDetails = useMemo(() => {
    const all = groupedBlocks.flatMap((b) => b.rows.flatMap((r) => r.seats));
    return selectedSeats.map((sid) => all.find((s) => s._id === sid)).filter(Boolean) as Seat[];
  }, [selectedSeats, groupedBlocks]);

  // ── All hooks MUST be called before any early returns ────────────────────
  const isOnlineMode = event?.eventType === "ONLINE" || bookingType === "online";
  const canCheckout = isOnlineMode || selectedSeats.length > 0;

  // Total price calculated from category prices or flat event price
  const totalPrice = useMemo(() => {
    if (isOnlineMode) return event?.price ?? 0;
    return selectedSeatDetails.reduce((sum, seat) => {
      const block = groupedBlocks.find((b) => b.blockName === seat.block);
      return sum + (block?.categoryPrice ?? 0);
    }, 0);
  }, [isOnlineMode, selectedSeatDetails, groupedBlocks, event]);

  // Guards — after all hooks
  if (loading) return <LoadingSpinner />;
  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4">

        {/* ── Top bar ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
              <span className="hover:text-gray-600 cursor-pointer" onClick={() => navigate("/")}>Home</span>
              <span>/</span>
              <span className="text-gray-600 font-medium">Seat Selection</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-800">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-semibold">
                {event.eventType}
              </span>
              {event.location?.address && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {event.location.address}
                </span>
              )}
            </div>
          </div>

          {/* HYBRID toggle */}
          {event.eventType === "HYBRID" && (
            <div className="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
              {(["physical", "online"] as const).map((type) => (
                <button
                  key={type}
                  id={`booking-type-${type}`}
                  onClick={() => setBookingType(type)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    bookingType === type
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {type === "physical" ? "In-Person" : "Online Pass"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Main grid ───────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Seat map ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            {!isOnlineMode ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-x-auto">
                {groupedBlocks.length === 0 ? (
                  <p className="text-center text-gray-400 py-16 text-sm">No seats found for this event.</p>
                ) : (
                  <div className="space-y-8 min-w-[480px]">
                    {groupedBlocks.map((block) => (
                      <BlockSection
                        key={block.blockName}
                        block={block}
                        selectedSeats={selectedSeats}
                        onSeatClick={handleSeatClick}
                      />
                    ))}
                  </div>
                )}

                {/* Stage */}
                <Stage />

                {/* Legend */}
                <Legend />
              </div>
            ) : (
              <OnlinePassCard price={event.price ?? 0} />
            )}
          </div>

          {/* ── Booking Summary ────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Booking Summary
              </h2>

              {/* Seat list */}
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {isOnlineMode ? (
                  <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Online Pass</p>
                      <p className="text-xs text-gray-400">Multi-device streaming</p>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">₹{event.price}</span>
                  </div>
                ) : selectedSeatDetails.length > 0 ? (
                  selectedSeatDetails.map((seat) => {
                    const block = groupedBlocks.find((b) => b.blockName === seat.block);
                    return (
                      <div key={seat._id} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg group">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            {seat.block}-{seat.row}-{String(seat.column).padStart(2, "0")}
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            {block?.categoryName || `Block ${seat.block}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {block?.categoryPrice !== null && (
                            <span className="text-sm font-bold text-gray-600">
                              ₹{block?.categoryPrice}
                            </span>
                          )}
                          <button
                            onClick={() => handleSeatClick(seat._id, "AVAILABLE")}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                            title="Remove"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Click a seat to select it</p>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                    {isOnlineMode ? "Total" : `${selectedSeats.length} seat${selectedSeats.length !== 1 ? "s" : ""} · Total`}
                  </span>
                  <span className="text-xl font-black text-gray-800">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button
                id="checkout-btn"
                disabled={!canCheckout}
                onClick={() =>
                  navigate(`/checkout/${event.id || event._id}`, {
                    state: { selectedSeats, bookingType, totalPrice },
                  })
                }
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                  canCheckout
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md hover:shadow-lg"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>

              {/* Payment note */}
              <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
                <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure & encrypted payment
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
