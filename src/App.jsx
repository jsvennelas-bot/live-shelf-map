import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LiveShelf from "./pages/LiveShelf";
import FindMyBook from "./pages/FindMyBook";
import EmptySlots from "./pages/EmptySlots";

const linkStyle = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold ${
    isActive
      ? "bg-blue-600 text-white"
      : "text-slate-700 hover:bg-slate-100"
  }`;

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 p-4">
          <h1 className="mr-auto text-xl font-bold text-slate-900">
            Live Shelf Map
          </h1>

          <NavLink className={linkStyle} to="/">
            Dashboard
          </NavLink>

          <NavLink className={linkStyle} to="/shelf">
            Live Shelf
          </NavLink>

          <NavLink className={linkStyle} to="/find-book">
            Find My Book
          </NavLink>

          <NavLink className={linkStyle} to="/empty-slots">
            Empty Slots
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl p-4 sm:p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/shelf" element={<LiveShelf />} />
          <Route path="/find-book" element={<FindMyBook />} />
          <Route path="/empty-slots" element={<EmptySlots />} />
        </Routes>
      </main>
    </div>
  );
}