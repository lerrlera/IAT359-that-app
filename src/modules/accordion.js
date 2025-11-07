import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from "../utils/colors";


export default function Accordion({ title, children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setIsExpanded(!isExpanded)} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <FontAwesome5
            name={isExpanded ? "chevron-up" : "chevron-down"} // arrow changes on toggle
            size={18}
            color={Colors.peach}
        />
    </Pressable>
    {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.peach,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "white",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    padding: 15,
    paddingTop:0,
    backgroundColor: "white",
  },
});
