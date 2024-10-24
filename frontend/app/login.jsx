import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";
import { Link } from "expo-router";

const images = {
  login: require("../assets/gif/kissCat.gif"),
  email: require("../assets/gif/sleepingCat.gif"),
  password: require("../assets/gif/popCat.gif"),
};

const Screen = () => {
  const [focusedField, setFocusedField] = useState("login");

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.imageContainer}>
          <Image source={images[focusedField]} style={styles.image} />
        </View>

        <Text style={styles.headText}>Meow In</Text>
        <Text style={styles.subText}>Login To Your Account</Text>

        <TextInput
          placeholder="Your Email 🐱"
          placeholderTextColor={Colors.gray}
          style={styles.input}
          keyboardType="email-address"
          onFocus={() => setFocusedField("email")}
        />

        <TextInput
          placeholder="Your Password 🙀"
          placeholderTextColor={Colors.gray}
          style={styles.input}
          secureTextEntry
          onFocus={() => setFocusedField("password")}
        />

        <Link href="./tabs" style={styles.btnBox}>
          <Text style={styles.btnText}>Submit Meow!</Text>
        </Link>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Screen;

const styles = StyleSheet.create({
  screen: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.pink,
    height: "100%",
    padding: "2rem",
  },
  keyboardAvoidingView: {
    flex: 1,
    marginTop: 50,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  imageContainer: {
    width: 300,
    height: 200,
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headText: {
    fontSize: 50,
    fontFamily: "Bold",
    textAlign: "center",
  },
  subText: {
    fontSize: 20,
    fontFamily: "Regular",
    textAlign: "center",
    marginVertical: 10,
    color: Colors.black,
    marginBottom: 40,
  },
  input: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 10,
    width: 300,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontFamily: "Regular",
    fontSize: 18,
    color: Colors.black,
    textAlign: "center",
  },
  btnBox: {
    marginTop: 20,
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
