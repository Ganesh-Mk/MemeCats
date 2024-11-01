import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import store from "../store/store.js";
import { View, ActivityIndicator } from "react-native";

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Thin: require("../assets/fonts/Outfit-ExtraLight.ttf"),
    Regular: require("../assets/fonts/Outfit-Regular.ttf"),
    Bold: require("../assets/fonts/Outfit-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

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
