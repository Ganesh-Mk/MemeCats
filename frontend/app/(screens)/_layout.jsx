import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ScreensLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="signup" options={{ headerTitle: "New Hooman!" }} />
      <Stack.Screen
        name="loginOrSingup"
        options={{ headerTitle: "Sign Up or Sign In?" }}
      />
      <Stack.Screen
        name="login"
        options={{ headerTitle: "Welcome Back Hooman!" }}
      />
    </Stack>
  );
};

export default ScreensLayout;

const styles = StyleSheet.create({});
