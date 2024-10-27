import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";
import { router } from "expo-router";

const images = {
  login: require("../../assets/gif/kissCat.gif"),
  email: require("../../assets/gif/sleepingCat.gif"),
  password: require("../../assets/gif/popCat.gif"),
};

const Login = () => {
  const [focusedField, setFocusedField] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");

  const handleSubmit = async () => {
    router.push("../(tabs)/reels");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("../(tabs)/reels");
        console.log(data.user);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

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
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Your Password 🙀"
          placeholderTextColor={Colors.gray}
          style={styles.input}
          secureTextEntry
          onFocus={() => setFocusedField("password")}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btnBox} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.btnText}>Submit Meow!</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

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