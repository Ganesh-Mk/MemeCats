import React from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import store from "../store/store.js";

const RootLayout = () => {
  useFonts({
    Thin: require("../assets/fonts/Outfit-ExtraLight.ttf"),
    Regular: require("../assets/fonts/Outfit-Regular.ttf"),
    Bold: require("../assets/fonts/Outfit-Bold.ttf"),
  });

  return (
    <Provider store={store}>
      <Toast />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(screens)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
};

export default RootLayout;
