export default function ShelfGrid({ slots }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {slots.map((slot) => (
        <div
          key={slot.slot_id}
          className={`rounded-2xl border p-6 shadow-sm ${
            slot.occupied
              ? "border-emerald-200 bg-emerald-50"
              : "border-rose-200 bg-rose-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">
              Slot {slot.slot_id}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                slot.occupied
                  ? "bg-emerald-600 text-white"
                  : "bg-rose-600 text-white"
              }`}
            >
              {slot.occupied ? "OCCUPIED" : "EMPTY"}
            </span>
          </div>

          <p className="mt-4 text-slate-700">
            {slot.book_name || "No book in this slot"}
          </p>

          {slot.book_id && (
            <p className="mt-1 text-sm text-slate-500">
              ID: {slot.book_id}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}