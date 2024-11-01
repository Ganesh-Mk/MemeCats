import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AccountScreensLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="createReel" options={{ title: "Create New Reel" }} />
      <Stack.Screen name="editReel" options={{ title: "Edit Cat Reel" }} />
      <Stack.Screen
        name="editProfile"
        options={{ title: "Edit Cat Profile" }}
      />
      <Stack.Screen name="savedReel" options={{ title: "Saved Reels" }} />
    </Stack>
  );
};

export default AccountScreensLayout;

const styles = StyleSheet.create({});
