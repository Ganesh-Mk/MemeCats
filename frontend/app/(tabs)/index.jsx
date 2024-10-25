import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

const Index = () => {
  return (
    <View style={styles.container}>
      <Text>Reels Screen</Text>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pink,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
