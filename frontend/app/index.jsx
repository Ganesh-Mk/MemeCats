import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link, Redirect } from "expo-router";

const index = () => {
  return (
    <View>
      <Text>index</Text>
      <Redirect href="./(tabs)/home" />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
