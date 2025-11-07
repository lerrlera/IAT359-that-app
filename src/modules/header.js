import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../utils/colors";

export default function Header({ title = "Header" }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,              
    backgroundColor: Colors.peach, 
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,          
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,            
  },
  title: {
    fontSize: 18,
    marginTop:27,
    fontWeight: "bold",
    color: "white",
  },
});
