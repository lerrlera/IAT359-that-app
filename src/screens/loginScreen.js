import { useState, useEffect } from "react";
import { Button, View, Text, TextInput,TouchableOpacity, StyleSheet, Alert } from "react-native";
import { saveUserPrefs, loadUserPrefs, removeUserPrefs } from "../utils/storage";


export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

   
    return (
        <View>
            <Text>Welcome</Text>
            <Text>Sign in to manage your transition house availability and information.</Text>
            <TextInput placeholder="Name" placeholderTextColor="black" value={name} onChangeText={setName}></TextInput>

            <View style={styles.colorRow}>
                {colors.map((c)=>(
                    <TouchableOpacity
                    key={c}
                    onPress={() => setSelectedColor(c)}
                    style={[styles.colorSwatch, { backgroundColor: c, borderWidth: selectedColor === c ? 3 : 1 }]}
/>
                ))}
            </View>
            <Button title="Submit" onPress={handleSubmit}/>
        </View>

    )
}

const styles = StyleSheet.create(
    {
       
    }



)