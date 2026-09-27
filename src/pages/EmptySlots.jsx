import { useEffect, useState } from "react";
import { getEmptySlots } from "../api";

export default function EmptySlots() {
  const [emptySlots, setEmptySlots] = useState([]);

  async function loadEmptySlots() {
    try {
      const data = await getEmptySlots();
      setEmptySlots(data);
    } catch {
      setEmptySlots([]);
    }
  }

  useEffect(() => {
    loadEmptySlots();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900">Empty Slots</h2>

      <p className="mt-2 text-slate-600">
        These shelf locations are currently available.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {emptySlots.map((slot) => (
          <div
            key={slot.slot_id}
            className="rounded-2xl border border-rose-200 bg-rose-50 p-6"
          >
            <h3 className="text-2xl font-bold text-slate-900">
              Slot {slot.slot_id}
            </h3>

            <p className="mt-2 text-rose-700">
              This shelf slot is empty.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}