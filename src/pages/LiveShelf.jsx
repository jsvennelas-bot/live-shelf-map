import { useEffect, useState } from "react";
import { getShelf } from "../api";
import ShelfGrid from "../components/ShelfGrid";

export default function LiveShelf() {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");

  async function loadShelf() {
    try {
      const data = await getShelf();
      setSlots(data);
      setError("");
    } catch {
      setError("Unable to load live shelf data.");
    }
  }

  useEffect(() => {
    loadShelf();

    const interval = setInterval(loadShelf, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900">Live Shelf</h2>

      <p className="mt-2 mb-8 text-slate-600">
        Shelf status refreshes automatically every three seconds.
      </p>

      {error && (
        <p className="mb-4 rounded-xl bg-rose-50 p-4 text-rose-700">
          {error}
        </p>
      )}

      <ShelfGrid slots={slots} />
    </div>
  );
}