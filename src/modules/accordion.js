import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "../utils/colors";

export default function Accordion({ title, children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.wrapper}>

      {/* HEADER */}
      <Pressable 
        onPress={() => setIsExpanded(!isExpanded)}
        style={[
          styles.header,
          isExpanded && styles.headerOpen
        ]}
      >
        <Text style={styles.title}>{title}</Text>

        <View style={styles.iconBubble}>
          <FontAwesome5
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={15}
            color={Colors.peach}
          />
        </View>
      </Pressable>

      {/* CONTENT */}
      {isExpanded && (
        <View style={styles.contentBox}>
          {children}
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
  },

  // CLOSED header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 16,
    backgroundColor: "#ffffffff",        // light lavender
    borderWidth: 1,
    borderColor: Colors.peach,            // thin lavender border
    borderRadius: 12,
  },

  // OPEN header (top stays rounded, bottom becomes square)
  headerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.peach,
  },

  iconBubble: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },

  // OPEN content box
  contentBox: {
    backgroundColor: "#fcf2eeff",          // same tone as header
    borderWidth: 1,
    borderColor: Colors.peach,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
  },
});
