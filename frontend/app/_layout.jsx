import React from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";

const RootLayout = () => {
  useFonts({
    Thin: require("../assets/fonts/Outfit-ExtraLight.ttf"),
    Regular: require("../assets/fonts/Outfit-Regular.ttf"),
    Bold: require("../assets/fonts/Outfit-Bold.ttf"),
  });

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;
