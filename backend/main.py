import os
import sqlite3
from contextlib import closing
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DATABASE_FILE = "shelf.db"

app = FastAPI(
    title="Live Shelf Map API",
    description="Backend API for the Live Shelf Map project",
    version="1.0.0",
)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://live-shelf-map.vercel.app",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SensorUpdate(BaseModel):
    A1: Optional[bool] = None
    A2: Optional[bool] = None
    A3: Optional[bool] = None
    B1: Optional[bool] = None
    B2: Optional[bool] = None
    B3: Optional[bool] = None


def get_connection():
    connection = sqlite3.connect(DATABASE_FILE)
    connection.row_factory = sqlite3.Row
    return connection


def create_database():
    with closing(get_connection()) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS shelf_slots (
                slot_id TEXT PRIMARY KEY,
                book_id TEXT,
                book_name TEXT,
                occupied INTEGER NOT NULL
            )
            """
        )

        count = connection.execute(
            "SELECT COUNT(*) AS total FROM shelf_slots"
        ).fetchone()["total"]

        if count == 0:
            starter_slots = [
                ("A1", "BOOK001", "Python Basics", 1),
                ("A2", "BOOK002", "Database Systems", 1),
                ("A3", None, None, 0),
                ("B1", "BOOK003", "Operating Systems", 1),
                ("B2", None, None, 0),
                ("B3", "BOOK004", "Java Programming", 1),
            ]

            connection.executemany(
                """
                INSERT INTO shelf_slots (slot_id, book_id, book_name, occupied)
                VALUES (?, ?, ?, ?)
                """,
                starter_slots,
            )

        connection.commit()


@app.on_event("startup")
def startup():
    create_database()


def slot_to_dict(slot):
    return {
        "slot_id": slot["slot_id"],
        "book_id": slot["book_id"],
        "book_name": slot["book_name"],
        "occupied": bool(slot["occupied"]),
    }


@app.get("/")
def home():
    return {
        "message": "Live Shelf Map API is running",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/shelf")
def get_shelf():
    with closing(get_connection()) as connection:
        slots = connection.execute(
            "SELECT * FROM shelf_slots ORDER BY slot_id"
        ).fetchall()

    return [slot_to_dict(slot) for slot in slots]


@app.get("/books")
def get_books():
    with closing(get_connection()) as connection:
        books = connection.execute(
            """
            SELECT * FROM shelf_slots
            WHERE book_name IS NOT NULL
            ORDER BY slot_id
            """
        ).fetchall()

    return [slot_to_dict(book) for book in books]


@app.get("/books/search")
def search_book(q: str):
    with closing(get_connection()) as connection:
        book = connection.execute(
            """
            SELECT * FROM shelf_slots
            WHERE LOWER(book_name) LIKE LOWER(?)
            LIMIT 1
            """,
            (f"%{q}%",),
        ).fetchone()

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    return slot_to_dict(book)


@app.get("/shelf/empty")
def get_empty_slots():
    with closing(get_connection()) as connection:
        empty_slots = connection.execute(
            """
            SELECT * FROM shelf_slots
            WHERE occupied = 0
            ORDER BY slot_id
            """
        ).fetchall()

    return [slot_to_dict(slot) for slot in empty_slots]


@app.post("/shelf/update")
def update_shelf(sensor_data: SensorUpdate):
    updates = sensor_data.model_dump(exclude_none=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="Send at least one slot update.",
        )

    with closing(get_connection()) as connection:
        for slot_id, occupied in updates.items():
            if occupied:
                connection.execute(
                    """
                    UPDATE shelf_slots
                    SET occupied = 1
                    WHERE slot_id = ?
                    """,
                    (slot_id,),
                )
            else:
                connection.execute(
                    """
                    UPDATE shelf_slots
                    SET occupied = 0, book_id = NULL, book_name = NULL
                    WHERE slot_id = ?
                    """,
                    (slot_id,),
                )

        connection.commit()

    return {
        "message": "Shelf status updated successfully",
        "updated_slots": updates,
    }
