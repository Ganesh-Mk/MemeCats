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
  signup: require("../assets/gif/dancingCat.gif"),
  name: require("../assets/gif/wishingCat.gif"),
  email: require("../assets/gif/sleepingCat.gif"),
  password: require("../assets/gif/popCat.gif"),
};

const SignupScreen = () => {
  const [focusedField, setFocusedField] = useState("signup");

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.imageContainer}>
          <Image source={images[focusedField]} style={styles.image} />
        </View>

        <Text style={styles.headText}>Meow Up</Text>
        <Text style={styles.subText}>Create New Account</Text>

        <TextInput
          placeholder="Your Cat Name 😻"
          placeholderTextColor={Colors.gray}
          style={styles.input}
          onFocus={() => setFocusedField("name")}
        />

        <TextInput
          placeholder="Your Email 🐱"
          placeholderTextColor={Colors.gray}
          style={styles.input}
          keyboardType="email-address"
          onFocus={() => setFocusedField("email")}
        />

        <TextInput
          placeholder="New Password 🙀"
          placeholderTextColor={Colors.gray}
          style={styles.input}
          secureTextEntry
          onFocus={() => setFocusedField("password")}
        />

        <Link href="./login" style={styles.btnBox}>
          <Text style={styles.btnText}>Submit Meow!</Text>
        </Link>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

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
    justifyContent: "center",
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
