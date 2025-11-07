import { useState, useEffect, use } from "react";
import { Button, View, Text, TextInput,TouchableOpacity, StyleSheet, Alert, Pressable, ScrollView } from "react-native";
import { Colors } from "../utils/colors";
import { FontAwesome5 } from '@expo/vector-icons';
import HouseCard from "../modules/houseCard";
import Header from "../modules/header";

export default function HomeScreen({ navigation }) {


    return (
        <View style={{flex:1}}>
            <Header title="Home" />
            <View style={styles.mainContainer}>
                <ScrollView style={styles.cardContainer}>
                    <HouseCard></HouseCard>
                </ScrollView>
                <View style={styles.overlay}>
                    <Pressable style={styles.roundButton} onPress={navigation.navigate("Map")}>
                        <FontAwesome5 name="map" size={25}  solid={false} color="white" style={styles.icon}/>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 2,
        paddingTop: 20,
        backgroundColor: Colors.background,
    },
    cardContainer: {
        width: "100%",
        overflow: "visible",
    },
    roundButton: {
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
    overlay: {
        ...StyleSheet.absoluteFillObject, 
        justifyContent: "flex-end", 
        alignItems: "flex-end",
        padding: 20, 
    }
})