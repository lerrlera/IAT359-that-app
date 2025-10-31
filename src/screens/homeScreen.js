import { useState, useEffect } from "react";
import { Button, View, Text, TextInput,TouchableOpacity, StyleSheet, Alert } from "react-native";
import { saveUserPrefs, loadUserPrefs, removeUserPrefs } from "../utils/storage";
import { Colors } from "../utils/colors";
import { FontAwesome } from '@expo/vector-icons';



export default function HomeScreen({ navigation }) {
    const [name, setName] = useState("");
    const [query, setQuery] = useState("");


    useEffect(() => {
        (async() => {
            const prefs = await loadUserPrefs();
            if (prefs?.name) setName(prefs.name);
        })()
    }, []);

    const handleSubmit = async() => {
        if (name.trim()) {
            await saveUserPrefs(name.trim());

            navigation.navigate("Welcome", { userName: name.trim()});
        } else {
            Alert.alert("Missing info");
        }
    }

    return (

        <View style={styles.container}>
            <View style={styles.searchContainer}>
            <FontAwesome name="search" size={18} color="#888" style={styles.icon} />
            <TextInput style={styles.searchBar} placeholder="Search for location" placeholderTextColor={Colors.grey}value={query} onChangeText={setQuery}></TextInput>
            <FontAwesome name="location-arrow" size={20} color="gray" style={styles.icon} />

            </View>
           
        </View>

        

    )
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: Colors.background,
        },
        searchContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 100,
            padding: 15,
            backgroundColor: "white",
            position: "relative",
            // Shadow for iOS
            shadowColor: '#696969ff',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            // Shadow for Android
            elevation: 5,
        },
        searchBar: {
            flex:1,

        },
        icon: {
            marginRight: 8,
            position: "fixed",
            zIndex: 2,
  },
  
    }




)