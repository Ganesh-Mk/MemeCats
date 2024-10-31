import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import Colors from "../../../constants/Colors";
import { Video } from "expo-av";
import { useSelector, useDispatch } from "react-redux";
import {
  storeName,
  storeEmail,
  storeProfileImage,
  storeReels,
} from "../../../store/user";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

const AccountScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { name, email, profileImage, reels } = user;

  const logout = () => {
    dispatch(storeName(""));
    dispatch(storeEmail(""));
    dispatch(storeProfileImage(""));
    dispatch(storeReels([]));
    router.push("../../../");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Account</Text>
        <TouchableOpacity onPress={logout}>
          <AntDesign name="logout" size={27} color={Colors.red} />
        </TouchableOpacity>
      </View>
      {/* Profile Info */}
      <View style={styles.profileInfoContainer}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
        <View style={styles.profileDetails}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.reelCount}>Total Reels: {reels.length}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => router.push("../account/createReel")}
          style={styles.btnBox}
        >
          <Text style={styles.btnText}>Create Reel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("../account/editProfile")}
          style={styles.btnBox}
        >
          <Text style={styles.btnText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("../account/savedReel")}
          style={styles.btnBox}
        >
          <Image
            style={{ width: 30, height: "100%" }}
            source={{
              uri: "https://cdn.iconscout.com/icon/free/png-256/free-save-logo-icon-download-in-svg-png-gif-file-formats--instagram-social-media-brand-filled-line-pack-logos-icons-2724646.png?f=webp&w=256",
            }}
          />
        </TouchableOpacity>
      </View>

      {/* Reel Grid */}
      <Text style={styles.headerText}>Reels</Text>
      <FlatList
        data={reels}
        numColumns={2}
        keyExtractor={(item) => item.dateAndTime}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.reelContainer}>
            <Video
              source={{ uri: item.reelVideoUrl }}
              style={styles.reelVideo}
              useNativeControls
              resizeMode="contain"
            />
            <Text style={styles.likeCount}>👍 {item.totalLikes} Likes</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.reelGrid}
      />
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightPink,
    padding: 20,
  },
  header: {
    backgroundColor: Colors.lightPink,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.darkText,
    textAlign: "center",
  },
  profileInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: Colors.darkPink,
    borderWidth: 3,
    marginRight: 15,
  },
  profileDetails: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.darkText,
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: Colors.subtleText,
    marginBottom: 5,
  },
  reelCount: {
    fontSize: 18,
    color: Colors.darkPink,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.darkPink,
    borderRadius: 5,
    padding: 10,
    width: "40%",
    alignItems: "center",
  },
  btnBox: {
    backgroundColor: Colors.red,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  btnText: {
    fontFamily: "Regular",
    fontSize: "5vw",
    textAlign: "center",
    color: Colors.white,
  },
  reelGrid: {
    paddingTop: 20,
  },
  reelContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: Colors.lightGrey,
    alignItems: "center",
    padding: 10,
  },
  reelVideo: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  likeCount: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.darkPink,
  },
});
