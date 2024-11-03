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
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { BACKEND_URL } from "../../../env";
import { storeReels, storeRefreshUser } from "../../../store/user.js";
import { Image } from "react-native";
import { Video } from "expo-av";
import { router } from "expo-router";

export default function CreateReel() {
  const [media, setMedia] = useState(null); // holds the image or video URI
  const [isUploading, setIsUploading] = useState(false);
  const [desc, setDesc] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const pickMedia = async () => {
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
    if (!media)
      return Alert.alert("Error", "Please select a media first.", {
        text: "OK",
      });

    setIsUploading(true);
    let formData = new FormData();
    console.log("user.id: ", user);
    formData.append("user", user.id); // Add title to formData
    formData.append("description", desc); // Add description to formData
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
        dispatch(storeReels(data.reel)); // Store in Redux if needed
        dispatch(storeRefreshUser());
        router.push("../account");
      } else {
        Alert.alert("Upload Failed", data.message, [{ text: "OK" }]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload media.", [{ text: "OK" }]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Hey Hooman, make me famous! 🐱</Text>

      {media ? (
        <Video
          source={{ uri: media.uri }}
          style={{ width: 300, height: 300 }}
          useNativeControls
          resizeMode="contain"
        />
      ) : (
        <>
          <View style={{ width: 300, height: 300, backgroundColor: "#ccc" }}>
            <Text style={{ fontSize: 24, textAlign: "center", marginTop: 100 }}>
              No Media Selected
            </Text>
          </View>
        </>
      )}

      <TouchableOpacity onPress={pickMedia} style={styles.pickMediaBtn}>
        <Text style={styles.pickMediaText}>Select Video/Reel</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Add a description"
        value={desc}
        onChangeText={setDesc}
      />

      <TouchableOpacity onPress={uploadMedia} style={styles.uploadBtn}>
        {isUploading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <Text style={styles.uploadText}>Upload</Text>
        )}
      </TouchableOpacity>
    </View>
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
    fontSize: 32,
    fontWeight: "bold",
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
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#fff",
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
