// src/utils/db.js

import { openDatabaseAsync } from "expo-sqlite";
import Papa from "papaparse";


// import * as FileSystem from "expo-file-system";
// import * as SQLite from "expo-sqlite";


let dbPromise;

export function getDb() {
    if (!dbPromise) dbPromise = openDatabaseAsync("houses.db");
    return dbPromise;
}

export async function resetHouses() {
    const db = await getDb();
    await db.runAsync("DELETE FROM transition_houses;");
}

async function fetchCSVFromGoogleSheet() {
    
    try {
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSRZJnz3ZN4CI3mDE8_QM-FGWZqkfQIJg_KKwe_MMgToPQq9WyQ--uySVrrglfVdLExZemztj5Xexn/pub?gid=0&single=true&output=csv";
        const response = await fetch(url);
        const csvText = await response.text();
        
        const parsed = Papa.parse(csvText, { header: true }).data;
        
        const db = await getDb();

        await resetHouses();
        
        for (const row of parsed) {
            await db.runAsync(
                `INSERT INTO transition_houses (
          city, program, organization, phone, toll_free_phone, text,
          email, website, type, note, availability
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    row.city || "",
                    row.program || "",
                    row.organization || "",
                    row.phone || "",
                    row.toll_free_phone || "",
                    row.text || "",
                    row.email || "",
                    row.website || "",
                    row.type || "",
                    row.note || "",
                    row.availability || "",
                ]
            );
        }

        console.log("CSV imported successfully!");
    } catch (e) {
        console.warn("Error fetching CSV:", e);
    }
}


export async function initHousesTable() {
    const db = await getDb();

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transition_houses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT,
      program TEXT,
      organization TEXT,
      phone TEXT,
      toll_free_phone TEXT,
      text TEXT,
      email TEXT,
      website TEXT,
      type TEXT,
      note TEXT,
      availability TEXT
    );
  `);
    await fetchCSVFromGoogleSheet();
};

export async function fetchHouses() {
    const db = await getDb();
    return db.getAllAsync("SELECT * FROM transition_houses ORDER BY city;");
}

export async function insertHouse(house) {
    const db = await getDb();
    await db.runAsync(
        `INSERT INTO transition_houses (
      city, program, organization, phone, toll_free_phone, text,
      email, website, type, note, availability
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
            house.city || "",
            house.program || "",
            house.organization || "",
            house.phone || "",
            house.toll_free_phone || "",
            house.text || "",
            house.email || "",
            house.website || "",
            house.type || "",
            house.note || "",
            house.availability || "",
        ]
    );
}


