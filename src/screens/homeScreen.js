import { useState, useEffect, use } from "react";
import { Button, View, Text, TextInput,TouchableOpacity, StyleSheet, Alert, Pressable, ScrollView } from "react-native";
import { saveUserPrefs, loadUserPrefs, removeUserPrefs } from "../utils/storage";
import { Colors } from "../utils/colors";
import { FontAwesome5 } from '@expo/vector-icons';
import HouseCard from "../modules/houseCard";

export default function HomeScreen({ navigation }) {
    const [name, setName] = useState("");

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
        <View style={styles.mainContainer}>
        <ScrollView style={styles.cardContainer}>
                <HouseCard></HouseCard>
       
        </ScrollView>
             <Pressable style={styles.roundButton} onPress={()=>navigation.navigate("Map")}>
                    <FontAwesome5 name="map" size={25}  solid={false} color="white" style={styles.icon}/>
            </Pressable>
            </View>
    )
}

const styles = StyleSheet.create(
    {
        mainContainer: {
            flex: 1,
            backgroundColor: Colors.background,

        },
        cardContainer: {
            width: "100%",
            marginTop: 20,
        },
    
        roundButton: {
            position: "absolute",
            top: 590,
            left: 314,
            borderRadius: 60,
            backgroundColor: Colors.peach,
            alignItems: "center",
            justifyContent:"center",
            width: 70,
            height: 70,
            marginBottom: 20,
            zIndex: 999,
            // Shadow for iOS
            shadowColor: '#686868ff',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.6,
            shadowRadius: 20,
            // Shadow for Android
            elevation: 5,
    },
       
  
    }




)