import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Svg, Path } from "react-native-svg";

const CatButton = ({ text }) => {
  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.9}>
      <View style={styles.innerContainer}>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={styles.icon}
        >
          <Path
            d="M8 13V9m-2 2h4m5-2v.001M18 12v.001m4-.334v5.243a3.09 3.09 0 0 1-5.854 1.382L16 18a3.618 3.618 0 0 0-3.236-2h-1.528c-1.37 0-2.623.774-3.236 2l-.146.292A3.09 3.09 0 0 1 2 16.91v-5.243A6.667 6.667 0 0 1 8.667 5h6.666A6.667 6.667 0 0 1 22 11.667Z"
            fill="none"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </Svg>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    backgroundColor: "black",
    opacity: 0.9,
    padding: 2,
    marginVertical: 10,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: "#B931FC",
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default CatButton;
