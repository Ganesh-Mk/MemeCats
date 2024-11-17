// components/VideoModal.js
import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Video } from "expo-av";
import CatButton from "./CatButton";
import Colors from "../constants/Colors";

export default function VideoModal({
  visible,
  onClose,
  videoUrl,
  profileImage,
  name,
  dailyLikes,
  totalLikes,
  description,
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <ScrollView>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
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
            <Video
              source={{ uri: videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode="contain"
              shouldPlay
              onError={(error) => console.log("Video error:", error)}
            />

            {/* Likes */}
            <View style={styles.likesContainer}>
              <Text style={styles.likes}>💖 {dailyLikes}</Text>
              <Text style={styles.likes}>💞 {totalLikes}</Text>
            </View>

            {/* Description */}
            <ScrollView style={styles.descriptionContainer}>
              <Text style={styles.description}>{description}</Text>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
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
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    height: "95%",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.darkText,
    marginLeft: 5,
    width: 130,
    flexWrap: "wrap",
  },
  cancelIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  video: {
    width: "100%",
    height: 400,
    borderRadius: 10,
    marginBottom: 15,
    borderRadius: 10,
  },
  likesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 15,
  },
  likes: {
    fontSize: 16,
    color: Colors.darkPink,
  },
  descriptionContainer: {
    width: "100%",
    marginBottom: 5,
    height: 200,
    textAlign: "center",
  },
  description: {
    fontSize: 18,

    fontFamily: "Regular",
    color: Colors.darkText,
    marginBottom: 15,
    textAlign: "center",
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.red,
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Bold",
  },
});
