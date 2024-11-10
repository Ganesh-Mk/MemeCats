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
import CatButton from "../../../components/CatButton";

export default function CreateReel() {
  const [media, setMedia] = useState(null); // holds the image or video URI
  const [isUploading, setIsUploading] = useState(false);
  const [loaderSelecting, setLoaderSelecting] = useState(false);
  const [desc, setDesc] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

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
    console.log("Came inside uploadMedia");

    if (!media || !desc || media === null) {
      console.log("Came inside no media");
      Alert.alert("Upload Failed", "Please select media.", [{ text: "OK" }]);
      return;
    }

    console.log("Came inside yes media");

    setIsUploading(true);
    let formData = new FormData();
    console.log("user: ", user);
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.headerText}>Hey Hooman, make me famous! 🐱</Text>

        {loaderSelecting ? (
          <View style={styles.mediaBox}>
            <ActivityIndicator size="large" color={Colors.red} />
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

        <TextInput
          style={styles.input}
          placeholder="Add a description"
          value={desc}
          multiline={true}
          onChangeText={setDesc}
        />

        <CatButton
          text="Upload"
          loading={isUploading}
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
    height: 100,
    fontSize: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: "100%",
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
    fontSize: 20,
    fontWeight: "Regular",
    color: Colors.black,
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
