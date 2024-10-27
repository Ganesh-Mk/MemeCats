import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import Colors from "../../../constants/Colors";

const AccountScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Account Screen</Text>
      <Link href={"../account/createReel"} style={styles.btn}>
        Create Reel
      </Link>
      <Link href={"../account/editReel"} style={styles.btn}>
        Edit Reel
      </Link>
      <Link href={"../account/editProfile"} style={styles.btn}>
        Edit Profile
      </Link>
      <Link href={"../account/savedReel"} style={styles.btn}>
        Saved Reel
      </Link>
      <Link href={"../../../"} style={styles.btn}>
        Log out
      </Link>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pink,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btn: {
    backgroundColor: Colors.red,
    padding: 10,
    color: Colors.white,
    borderRadius: 10,
    fontFamily: "Regular",
    fontSize: 20,
  },
});
