// components/VideoModal.js
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import { Video } from "expo-av";
import Colors from "../constants/Colors";
import { Path, Svg } from "react-native-svg";

export default function VideoModal({
  visible,
  onClose,
  videoUrl,
  profileImage,
  name,
  commentsCount,
  dailyLikes,
  totalLikes,
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
              <Text style={styles.name}>{name}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Image
                style={styles.cancelIcon}
                source={require("../assets/images/cancelIcon.png")}
              />
            </TouchableOpacity>
          </View>

          {/* Video Section */}

          {!hasError ? (
            <Video
              source={{ uri: videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode="contain"
              shouldPlay
              onError={() => setHasError(true)}
            />
          ) : (
            <View style={styles.errorTextContainer}>
              <Text style={styles.errorText}>Something went wrong!</Text>
              <Text style={[styles.errorText, { marginTop: 10 }]}>
                Restart app
              </Text>
            </View>
          )}

          {/* Likes and Comments */}
          {/* <View style={styles.likesContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Svg
                height={30}
                width={45}
                viewBox="0 0 512 512"
                xmlSpace="preserve"
              >
                <Path
                  d="M474.655,74.503C449.169,45.72,413.943,29.87,375.467,29.87c-30.225,0-58.5,12.299-81.767,35.566 c-15.522,15.523-28.33,35.26-37.699,57.931c-9.371-22.671-22.177-42.407-37.699-57.931c-23.267-23.267-51.542-35.566-81.767-35.566 c-38.477,0-73.702,15.851-99.188,44.634C13.612,101.305,0,137.911,0,174.936c0,44.458,13.452,88.335,39.981,130.418 c21.009,33.324,50.227,65.585,86.845,95.889c62.046,51.348,123.114,78.995,125.683,80.146c2.203,0.988,4.779,0.988,6.981,0 c2.57-1.151,63.637-28.798,125.683-80.146c36.618-30.304,65.836-62.565,86.845-95.889C498.548,263.271,512,219.394,512,174.936 C512,137.911,498.388,101.305,474.655,74.503z"
                  fill="transparent"
                  stroke="white"
                  strokeWidth="50"
                />
              </Svg>
              <Text style={styles.likes}>{totalLikes}</Text>
            </View>

            <Text style={styles.likes}>💬 {commentsCount}</Text>
          </View> */}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: Dimensions.get("window").height * 0.939,
  },
  errorTextContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontFamily: "Regular",
    fontSize: 16,
    textAlign: "center",
    color: Colors.white,
  },
  modalContainer: {
    backgroundColor: Colors.darkTransparent,
    borderRadius: 10,
    width: "90%",
    maxWidth: 400,
    height: "95%",
    alignItems: "center",
    position: "relative",
  },
  header: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    flexWrap: "wrap",
    width: 170,
    color: Colors.white,
  },
  cancelIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  likesContainer: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 1,
  },
  likes: {
    fontSize: 20,
    fontFamily: "Regular",
    color: Colors.white,
    textAlign: "center",
  },
});
