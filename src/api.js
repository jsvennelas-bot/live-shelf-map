import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export async function getShelf() {
  const response = await API.get("/shelf");
  return response.data;
}
export async function getEmptySlots() {
  const response = await API.get("/shelf/empty");
  return response.data;
}
/* Temporary data still used by the other pages */
export const demoSlots = [
  {
    slot_id: "A1",
    book_id: "BOOK001",
    book_name: "Python Basics",
    occupied: true,
  },
  {
    slot_id: "A2",
    book_id: "BOOK002",
    book_name: "Database Systems",
    occupied: true,
  },
  {
    slot_id: "A3",
    book_id: null,
    book_name: null,
    occupied: false,
  },
  {
    slot_id: "B1",
    book_id: "BOOK003",
    book_name: "Operating Systems",
    occupied: true,
  },
  {
    slot_id: "B2",
    book_id: null,
    book_name: null,
    occupied: false,
  },
  {
    slot_id: "B3",
    book_id: "BOOK004",
    book_name: "Java Programming",
    occupied: true,
  },
];
export async function searchBook(query) {
  const response = await API.get("/books/search", {
    params: { q: query },
  });

  return response.data;
}
export default API;