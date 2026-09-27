import { useEffect, useState } from "react";
import { getShelf } from "../api";
import ShelfGrid from "../components/ShelfGrid";

export default function Dashboard() {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");

  async function loadShelf() {
    try {
      const data = await getShelf();
      setSlots(data);
      setError("");
    } catch {
      setError("Unable to connect to the backend.");
    }
  }

  useEffect(() => {
    loadShelf();

    const interval = setInterval(loadShelf, 3000);

    return () => clearInterval(interval);
  }, []);

  const occupied = slots.filter((slot) => slot.occupied).length;
  const empty = slots.filter((slot) => !slot.occupied).length;

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>

      <p className="mt-2 text-slate-600">
        Live smart-library shelf monitoring.
      </p>

      {error && (
        <p className="mt-4 rounded-xl bg-rose-50 p-4 text-rose-700">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-blue-600 p-5 text-white">
          <p>Total Slots</p>
          <p className="mt-2 text-3xl font-bold">{slots.length}</p>
        </div>

        <div className="rounded-2xl bg-emerald-600 p-5 text-white">
          <p>Occupied Slots</p>
          <p className="mt-2 text-3xl font-bold">{occupied}</p>
        </div>

        <div className="rounded-2xl bg-rose-600 p-5 text-white">
          <p>Empty Slots</p>
          <p className="mt-2 text-3xl font-bold">{empty}</p>
        </div>
      </div>

      <h3 className="mt-10 mb-4 text-xl font-bold text-slate-900">
        Live Shelf Overview
      </h3>

      <ShelfGrid slots={slots} />
    </div>
  );
}