import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { BACKEND_URL } from "../../../env";
import { storeReels, storeRefreshUser } from "../../../store/user.js";
import { Image } from "react-native";
import { Video } from "expo-av";
import { router } from "expo-router";
import CatButton from "../../../components/CatButton";
import CaptionsModel from "../../../components/CaptionsModel";

export default function CreateReel() {
  const [media, setMedia] = useState(null); // holds the image or video URI
  const [isUploading, setIsUploading] = useState(false);
  const [loaderSelecting, setLoaderSelecting] = useState(false);
  const [desc, setDesc] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isModalVisible, setModalVisible] = useState(false);

  const [buttonLoader, setButtonLoader] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const pickMedia = async () => {
    setLoaderSelecting(true);
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need media permission to upload.", [
        { text: "OK" },
      ]);
      return;
    }

    // Pick image or video
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    setLoaderSelecting(false);

    // Check if media is not canceled and get the URI
    if (!result.canceled) {
      const selectedMedia = result.assets[0];
      setMedia({
        uri: selectedMedia.uri,
        type: selectedMedia.type, // This will be "image" or "video"
      });
    }
  };

  const uploadMedia = async () => {
    if (!media || media === null) {
      Alert.alert("Upload Failed", "Please select media.", [{ text: "OK" }]);
      return;
    }

    setIsUploading(true);
    let formData = new FormData();
    formData.append("user", user.id); // Add title to formData
    formData.append("desc", desc); // Add description to formData
    formData.append("file", {
      uri: media.uri,
      type: media.type === "video" ? "video/mp4" : "image/jpeg",
      name: `reel.${media.type === "video" ? "mp4" : "jpg"}`,
    });

    try {
      const response = await fetch(`${BACKEND_URL}/createReel`, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        dispatch(storeReels(data.reel));
        dispatch(storeRefreshUser());
        router.push("../account");
      } else {
        Alert.alert("Upload Failed", data.message, [{ text: "OK" }]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload. Try smaller size media", [
        { text: "OK" },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  const onConfirmModel = () => {
    setModalVisible(false);
  };

  const openAIModel = async () => {
    setModalVisible(true);
  };

  const closeAIModel = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView>
      <CaptionsModel
        visible={isModalVisible}
        closeModel={closeAIModel}
        onSelect={(cap) => setDesc(cap)}
      />
      <View style={styles.container}>
        <Text style={styles.headerText}>Hey Hooman, make me famous! 🐱</Text>

        {loaderSelecting ? (
          <View style={styles.mediaBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.mediaText}>Opening Gallery</Text>
          </View>
        ) : media ? (
          <TouchableOpacity onPress={pickMedia}>
            <Video
              source={{ uri: media.uri }}
              style={{ width: 300, height: 300, marginBottom: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={pickMedia}>
            <View style={styles.mediaBox}>
              <Text style={styles.mediaText}>Select Reel</Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a caption..."
            value={desc}
            multiline={true}
            onChangeText={setDesc}
          />
          <TouchableOpacity onPress={openAIModel} style={styles.aiBox}>
            <Image
              source={require("../../../assets/images/gemini.png")}
              style={styles.aiIcon}
            />
            <Text style={styles.aiText}>AI Caption</Text>
          </TouchableOpacity>
        </View>

        <CatButton
          text="Upload"
          loading={isUploading}
          fontFamily={"Bold"}
          onPress={uploadMedia}
          width={"100%"}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 30,
    fontFamily: "Regular",
    marginBottom: 20,
    textAlign: "center",
  },
  pickMediaBtn: {
    backgroundColor: Colors.red,
    justifyContent: "center",
    padding: 15,
    width: "100%",
    marginVertical: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  pickMediaText: { color: "white", fontSize: 16 },
  inputContainer: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 15,
    flexDirection: "row",
    gap: 10,
  },
  aiBox: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 10,
    borderColor: Colors.lightBlue,
    borderWidth: 2,
  },
  aiIcon: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },

  aiText: {
    color: Colors.black,
    fontSize: 14,
    fontFamily: "Regular",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: "70%",
    backgroundColor: "#fff",
  },
  mediaBox: {
    width: 300,
    height: 300,
    backgroundColor: Colors.lightGrey,
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  mediaText: {
    fontSize: 18,
    fontFamily: "Regular",
    color: Colors.darkGrey,
  },
  uploadBtn: {
    backgroundColor: Colors.red,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  uploadText: { color: "#fff", fontSize: 16 },
});
