import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import { Link } from "expo-router";

const Entrance = () => {
  return (
    <View style={styles.loginScreen}>
      <Image
        source={require("../assets/gif/happyCat.gif")}
        style={styles.image}
      />

      <Text style={styles.welcomeText}>Welcome, Hooman!</Text>
      <Text style={styles.subText}>
        Get ready for a pawsome ride through the funniest, sassiest cat memes
        ever
      </Text>
      <Link href="./(screens)/loginOrSingup" style={styles.btnBox}>
        <Text style={styles.btnText}>Let's Get Started 😻</Text>
      </Link>
    </View>
  );
};

export default Entrance;

const styles = StyleSheet.create({
  loginScreen: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.pink,
    height: "100%",
    // padding: "2rem",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  likes: {
    fontSize: 16,
    color: "gray",
  },
  video: {
    width: "100%",
    height: 250,
    marginVertical: 10,
  },
  commentContainer: {
    marginTop: 10,
  },
  commentName: {
    fontWeight: "bold",
  },
  commentText: {
    color: "gray",
  },
  welcomeText: {
    fontSize: 50,
    fontFamily: "Bold",
    textAlign: "center",
  },
  subText: {
    fontSize: 20,
    fontFamily: "Regular",
    textAlign: "center",
    marginTop: 20,
    color: Colors.black,
  },
  image: {
    width: 320,
    height: 320,
    color: Colors.black,
  },
  btnBox: {
    backgroundColor: Colors.red,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    marginTop: 50,
  },
  btnText: {
    fontFamily: "Bold",
    fontSize: 25,
    color: Colors.white,
  },
});
