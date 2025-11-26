// src/utils/db.js

import { openDatabaseAsync } from "expo-sqlite";
import Papa from "papaparse";


// import * as FileSystem from "expo-file-system";
// import * as SQLite from "expo-sqlite";


let dbPromise;

// openDatabaseAsync = creates/open database w/ the specified parameters
// returns db oject that can be used for executing sql queries. 
export function getDb() {
    if (!dbPromise) dbPromise = openDatabaseAsync("houses.db");
    return dbPromise;
}

// db.runAsync(sql, params?) run INSERT/DELETE/UPDATE. 
export async function resetHouses() {
    const db = await getDb();
    await db.runAsync("DELETE FROM transition_houses;");
}


// Fetches the raw CSV data from the Google Sheet URL 
// and uses the papaparse library to parse it into an array of objects.
async function fetchCSVFromGoogleSheet() {
    
    try {
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSRZJnz3ZN4CI3mDE8_QM-FGWZqkfQIJg_KKwe_MMgToPQq9WyQ--uySVrrglfVdLExZemztj5Xexn/pub?gid=0&single=true&output=csv";
        const response = await fetch(url);
        const csvText = await response.text();
        
        const parsed = Papa.parse(csvText, { header: true }).data;
        
        const db = await getDb();

        await resetHouses();
        
        // Iterates through the parsed CSV data. 
        // Then, use db.runAsync(sql, params?) to run INSERT sql query for each row.
        // This populates database table. 
        // in lecture example: db.runAsync("INSERT INTO my_notes (note) VALUES (?);", [note])
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
    // database schema = blueprint / structure of a database
    // defines how data's organized and how relationships among data are managed.
    // create table using CREATE TABLE sqlite statement.
    // lecture example: CREATE TABLE IF NOT EXISTS my_notes
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
    // uses db.getAllAsync() to run SELECT sql query to get rows. 
    // This fetches all records from the table, ordered by city. 
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


