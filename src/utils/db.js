import Papa from "papaparse";
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs
} from "firebase/firestore";
import { db } from "./firebase.config";

// Cloud Firestore = flexible, scalable, non-sql cloud db.
// for mobile, web, server dev.
// keeps your data in sync across client apps thru real-time listeners.
// offers offline support for mobile & web so you can build responsive apps
// that work regardless of network latency / internet connectivity. 
// no-sql, document-oriented database. No tables/rows. 
// Data's stored in documents, which are organized into collections. 
// each document contains a set of key-value pairs. 
// all documents must be stored in collections. 
const FIRESTORE_COLLECTION = "transition_houses";

export async function resetHouses() {
    const collectionRef = collection(db, FIRESTORE_COLLECTION);

    // retrieves all documents from the collection (getDocs)
    const snapshot = await getDocs(collectionRef);

    // then at the same time, delete them (deleteDoc)
    // map function allows us to iterate through the elements in an array and also modify each element 
    const deletions = snapshot.docs.map((d) => deleteDoc(d.ref));

    // clear the cloud data. 
    await Promise.all(deletions);
    console.log("All house reset");
}

async function fetchCSVFromGoogleSheet() {
    let successCount = 0; // Initialize counter
    let errorCount = 0;   // Initialize counter

    try {
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSRZJnz3ZN4CI3mDE8_QM-FGWZqkfQIJg_KKwe_MMgToPQq9WyQ--uySVrrglfVdLExZemztj5Xexn/pub?gid=0&single=true&output=csv";
        const response = await fetch(url);
        const csvText = await response.text();
        const parsed = Papa.parse(csvText, { header: true }).data;
        await resetHouses();

        console.log("RAW CSV TEXT:\n", csvText);
        console.log("PARSED LENGTH:", parsed.length);

        console.log("🚀 fetchCSVFromGoogleSheet STARTED");
        console.log("Parsed content array:", parsed);

        // insert each row into firestore
        for (const row of parsed) {
            try {
                // this is a unique document reference (docRef)
                // docRef is created inside the collection.        
                const docRef = doc(collection(db, FIRESTORE_COLLECTION));

                // setDoc is used to insert the house data into Firestore. 
                await setDoc(docRef, {

                    city: row.city || "",
                    program: row.program || "",
                    organization: row.organization || "",
                    phone: row.phone || "",
                    toll_free_phone: row.toll_free_phone || "",
                    text: row.text || "",
                    email: row.email || "",
                    website: row.website || "",
                    type: row.type || "",
                    note: row.note || "",
                    availability: row.availability || "",
                });
                console.log("🌟 Imported one row:", row);
                successCount++; // Increment success counter
            } catch (e) {
                console.error("🔥 ERROR inserting row:", row);
                console.error(e);
                errorCount++; // Increment error counter
            }
        }

        console.log(`✅ CSV import complete. Success: ${successCount}, Failed: ${errorCount}`);

    } catch (e) {
        // This catch handles errors during fetch or CSV parsing
        console.error("❌ Error fetching or parsing CSV:", e);
    }
}


export async function initHousesTable() {
    // await resetHouses();
    console.log("initHousesTable CALLED");

    await fetchCSVFromGoogleSheet();
};

export async function fetchHouses() {
    const collectionRef = collection(db, FIRESTORE_COLLECTION);

    // retrieves all documents from the collection (getDocs)
    const snapshot = await getDocs(collectionRef);

    // returns all documents, iterates through the elements in an array. 
    // maps the results
    // combines the unique document id (d.id) with the document's fields (d.data())
    return snapshot.docs.map((d) => (
        {
            id: d.id,
            ...d.data()
        }
    ));
}


// inserts a single house object into Firestore.
export async function insertHouse(house) {
    // creates new document reference (docRef)
    const docRef = doc(collection(db, FIRESTORE_COLLECTION));
    
    // then writes the data using setDoc. 
    await setDoc(docRef, {
        city: house.city || "",
        program: house.program || "",
        organization: house.organization || "",
        phone: house.phone || "",
        toll_free_phone: house.toll_free_phone || "",
        text: house.text || "",
        email: house.email || "",
        website: house.website || "",
        type: house.type || "",
        note: house.note || "",
        availability: house.availability || "",
    });


}


