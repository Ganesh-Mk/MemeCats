import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ScreensLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="signup" />
      <Stack.Screen name="loginOrSingup" />
      <Stack.Screen name="login" />
    </Stack>
  );
};

export default ScreensLayout;

const styles = StyleSheet.create({});
