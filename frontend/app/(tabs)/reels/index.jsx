import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Reels = () => {
  return (
    <View style={styles.container}>
      <Text>Reels Screen</Text>
    </View>
  );
};

export default Reels;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
