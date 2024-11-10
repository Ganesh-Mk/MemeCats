import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { Link, router } from "expo-router";
import CatButton from "../../components/CatButton";

const LoginOrSignup = () => {
  return (
    <View style={styles.screen}>
      <Image
        source={require("../../assets/gif/huhCat.gif")}
        style={styles.image}
      />

      <CatButton
        fontFamily={"Bold"}
        fontSize={25}
        text="Meow Up"
        onPress={() => router.push("../(screens)/signup")}
      />

      <Text style={styles.subText}>-- OR --</Text>

      <CatButton
        fontFamily={"Bold"}
        fontSize={25}
        text="Meow In"
        onPress={() => router.push("../(screens)/login")}
      />
    </View>
  );
};

export default LoginOrSignup;

const styles = StyleSheet.create({
  screen: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.pink,
    height: "100%",
    padding: 20,
  },

  subText: {
    fontSize: 20,
    fontFamily: "Regular",
    textAlign: "center",
    marginVertical: 20,
    color: Colors.black,
  },
  image: {
    width: 320,
    height: 320,
    color: Colors.black,
    marginBottom: 40,
    marginLeft: 30,
  },

  btnBox: {
    backgroundColor: Colors.red,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    width: 300,
    textAlign: "center",
  },
  btnText: {
    fontFamily: "Bold",
    fontSize: 25,
    color: Colors.white,
  },
});
