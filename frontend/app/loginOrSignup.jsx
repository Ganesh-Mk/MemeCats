import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import { Link } from "expo-router";

const LoginOrSignupScreen = () => {
  return (
    <View style={styles.screen}>
      <Image
        source={require("../assets/gif/huhCat.gif")}
        style={styles.image}
      />

      <Link href="./signup" style={styles.btnBox}>
        <Text style={styles.btnText}>Meow Up</Text>
      </Link>
      <Text style={styles.subText}>OR</Text>
      <Link href="./login" style={styles.btnBox}>
        <Text style={styles.btnText}>Meow In</Text>
      </Link>
    </View>
  );
};

export default LoginOrSignupScreen;

const styles = StyleSheet.create({
  screen: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.pink,
    height: "100%",
    padding: "2rem",
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
