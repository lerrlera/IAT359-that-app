import React, { useRef } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "../utils/colors";

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Search location",
  isFocused,
  setIsFocused,
}) {
  const inputRef = useRef(null);

  return (
    <Pressable
      style={[
        styles.container,
        { borderColor: isFocused ? Colors.brown : "white" },
        { backgroundColor: isFocused ? "#FEF9F7" : "white" },
      ]}
      onPress={() => inputRef.current?.focus()}
    >
      {/* Magnifier search icon */}
      <FontAwesome5
        name="search"
        size={18}
        color={Colors.peach}
        style={styles.icon}
      />

      {/* Search input */}
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.grey}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {/* X button appears when soemthing is typed in the bar */}
      {value?.length > 0 && (
        <Pressable
            onPress={() => onChangeText("")}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // this extends touch area for X
        >
          <FontAwesome5
            name="times"
            size={18}
            solid={false}
            color={Colors.peach}
            style={styles.icon}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 100,
    padding: 17,
    margin: 15,
    marginTop: 20,
    position: "absolute",
    // Shadow for iOS
    shadowColor: "#585858ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    // Shadow for Android
    elevation: 5,
    zIndex: 10,
  },
  input: { flex: 1 },
  icon: { paddingLeft: 6, paddingRight: 8 },
});
