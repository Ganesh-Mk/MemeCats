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
import { storeReels } from "../../../store/user";
import { Image } from "react-native";
import { Video } from "expo-av";

export default function CreateReel() {
  const [media, setMedia] = useState(null); // holds the image or video URI
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const pickMedia = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need media permission to upload.");
      return;
    }

    // Pick image or video
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    console.log("result", result);

    // Check if media is not canceled and get the URI
    if (!result.canceled) {
      const selectedMedia = result.assets[0];
      setMedia({
        uri: selectedMedia.uri,
        type: selectedMedia.type, // This will be "image" or "video"
      });
      console.log("Media selected:", selectedMedia.uri, selectedMedia.type);
    }

    console.log("Media selected:", media);
  };

  const uploadMedia = async () => {
    if (!media) return Alert.alert("Error", "Please select a media first.");

    setIsUploading(true);
    let formData = new FormData();
    formData.append("file", {
      uri: media,
      type: media.endsWith(".mp4") ? "video/mp4" : "image/jpeg",
      name: `reel.${media.endsWith(".mp4") ? "mp4" : "jpg"}`,
    });

    try {
      const response = await fetch(`${BACKEND_URL}/api/reels`, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        dispatch(storeReels(data.reel)); // Store in Redux if needed
        Alert.alert("Upload Success", "Reel uploaded successfully!");
      } else {
        Alert.alert("Upload Failed", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload media.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickMedia} style={styles.pickMediaBtn}>
        <Text style={styles.pickMediaText}>Pick Image/Video</Text>
      </TouchableOpacity>

      {media &&
        (media.type === "video" ? (
          <Video
            source={{ uri: media.uri }}
            style={{ width: 300, height: 300 }}
            useNativeControls
            resizeMode="contain"
          />
        ) : (
          <Image
            source={{ uri: media.uri }}
            style={{ width: 300, height: 300 }}
          />
        ))}

      <TouchableOpacity onPress={uploadMedia} style={styles.uploadBtn}>
        <Text style={styles.uploadText}>Upload</Text>
      </TouchableOpacity>

      {isUploading && <ActivityIndicator size="large" color={Colors.primary} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  pickMediaBtn: {
    backgroundColor: Colors.black,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  pickMediaText: { color: "#fff", fontSize: 16 },
  preview: {
    width: 800,
    height: 300,
    marginVertical: 20,
    border: "2px solid black",
  },
  uploadBtn: {
    backgroundColor: Colors.black,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  uploadText: { color: "white", fontSize: 16 },
});
