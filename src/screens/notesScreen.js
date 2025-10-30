import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native-reanimated/lib/typescript/Animated";
import { initNotesTable, fetchNotes, insertNote, removeNote, resetNotes } from "../utils/db";

export default function NotesScreen() {
    const [note, setNote] = useState("");
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        (async () => {
            try {
                //initialize notes
                //get notes
            } catch (e) {
                console.warn("DB init/load error", e)
                Alert.alert("Database error", String(e));
            } finally {
                setLoading(false);
            }
        })();
    },[]);

    const loadNotes = async() => {
        const rows = await fetchNotes();
        setNotes(rows || []); 
    };

    const onAdd = async () => {
        const trimmed = note.trim();
        if (!trimmed) {
            Alert.alert("Empty note", "Type something first, please.");
            return;
        }
        try {
            await insertNote(trimmed);
            setNote("");
            await loadNotes();
        } catch (e) {
            console.warn("Error inserting or loading.", e);
        }
    };
    
    const onDelete = async (id)=> {
        try {
            await removeNote(id);
            await loadNotes();
        } catch (e) {
            console.warn("Error deleting", e);
        }
    }

    const onReset = async ()=> {
        try {
            await resetNotes();
            await loadNotes();
        } catch (e) {
            console.warn("Error resetting", e);
        }
    }
}
