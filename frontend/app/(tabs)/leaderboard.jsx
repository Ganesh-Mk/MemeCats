import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

const LeaderboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Leaderboard Screen</Text>
    </View>
  );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pink,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
