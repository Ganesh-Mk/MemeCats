import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Home = () => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Link href={"../home/settings"} style={styles.btn}>
        Settings
      </Link>
      <Link href={"../home/edit"} style={styles.btn}>
        Edit
      </Link>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
