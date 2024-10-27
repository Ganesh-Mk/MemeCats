import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Leaderboard = () => {
  return (
    <View style={styles.container}>
      <Text>Leaderboard Screen</Text>
    </View>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
