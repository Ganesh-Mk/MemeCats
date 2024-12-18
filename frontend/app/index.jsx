import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { Link, router } from "expo-router";
import { useDispatch } from "react-redux";
import {
  storeId,
  storeName,
  storeEmail,
  storeProfileImage,
  storeReels,
  storeRefreshUser,
} from "../store/user.js";
import { setRefreshTogglePlayPause } from "../store/reel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CatButton from "../components/CatButton";
import { Audio } from "expo-av";

const Entrance = () => {
  const dispatch = useDispatch();
  const [sound, setSound] = useState(null);
  const [loader, setLoader] = useState(false);

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setSound(null);
    }
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/audio/happy-happy-cat.mp3"),
      { shouldPlay: true, isLooping: true }
    );
    setSound(sound);
    await sound.playAsync();
  };

  async function autoLogin() {
    setLoader(true);
    const name = await AsyncStorage.getItem("name");
    if (name === "" || name === null || name === undefined) {
      dispatch(setRefreshTogglePlayPause(false));
      playSound();
    } else {
      stopSound();
      setTimeout(() => router.push("./(tabs)/account"), 0);
      dispatch(storeId(await AsyncStorage.getItem("id")));
      dispatch(storeName(await AsyncStorage.getItem("name")));
      dispatch(storeEmail(await AsyncStorage.getItem("email")));
      dispatch(storeProfileImage(await AsyncStorage.getItem("profileImage")));
      dispatch(storeReels(await AsyncStorage.getItem("reels")));
      dispatch(storeRefreshUser(0));
    }
    setLoader(false);
  }

  useEffect(() => {
    autoLogin();
  }, []);

  return (
    <View style={styles.loginScreen}>
      {loader ? (
        <ActivityIndicator size="large" color={Colors.red} />
      ) : (
        <>
          <Image
            source={require("../assets/gif/happyCat.gif")}
            style={styles.image}
          />

          <Text style={styles.welcomeText}>Welcome, Hooman!</Text>
          <Text style={styles.subText}>
            Get ready for a pawsome ride through the funniest, sassiest cat
            memes ever
          </Text>

          <CatButton
            text="Let's Get Started 😻"
            fontFamily={"Bold"}
            fontSize={25}
            onPress={() => {
              stopSound();
              router.push("./(screens)/loginOrSingup");
            }}
          />
        </>
      )}
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
    padding: 20,
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
    marginVertical: 20,
    marginBottom: 50,
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
