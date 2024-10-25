import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import Colors from "../../constants/Colors";

const AccountScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Account Screen</Text>
      <Link style={styles.btn} href="./subScreens/editProfie">
        Edit Profile
      </Link>
      <Link style={styles.btn} href="./subScreens/editPost">
        Edit Post
      </Link>
      <Link style={styles.btn} href="./subScreens/createPost">
        Create Post
      </Link>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pink,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btn: {
    backgroundColor: Colors.red,
    padding: 10,
    color: Colors.white,
    borderRadius: 10,
    fontFamily: "Regular",
    fontSize: 20,
  },
});
