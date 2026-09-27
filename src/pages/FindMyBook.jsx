import { useState } from "react";
import { searchBook } from "../api";

export default function FindMyBook() {
  const [query, setQuery] = useState("");
  const [book, setBook] = useState(null);
  const [message, setMessage] = useState("");

  async function findBook() {
    if (!query.trim()) {
      setBook(null);
      setMessage("Please enter a book name.");
      return;
    }

    try {
      const result = await searchBook(query);
      setBook(result);
      setMessage("");
    } catch {
      setBook(null);
      setMessage("Book not found.");
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-3xl font-bold text-slate-900">Find My Book</h2>

      <p className="mt-2 text-slate-600">
        Search for a book to find its shelf location.
      </p>

      <div className="mt-6 flex gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") findBook();
          }}
          placeholder="Example: Python Basics"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
        />

        <button
          onClick={findBook}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {book && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm font-bold text-emerald-700">BOOK FOUND</p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {book.book_name}
          </h3>

          <p className="mt-3 text-slate-700">
            Location: <strong>Slot {book.slot_id}</strong>
          </p>

          <p className="text-slate-700">Book ID: {book.book_id}</p>
        </div>
      )}

      {message && (
        <p className="mt-6 rounded-xl bg-rose-50 p-4 text-rose-700">
          {message}
        </p>
      )}
    </div>
  );
}