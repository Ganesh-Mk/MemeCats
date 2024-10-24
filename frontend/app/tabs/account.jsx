// (tabs)/account.jsx
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const AccountScreen = () => {
  return (
    <View>
      <Text>Account Screen</Text>
      <Link href="./subScreens/editProfie">Edit Profile</Link>
      <Link href="./subScreens/editPost">Edit Post</Link>
      <Link href="./subScreens/createPost">Create Post</Link>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({});
