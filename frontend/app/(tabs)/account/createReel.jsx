import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../../constants/Colors"; // Assuming the theme colors are defined here
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../../../env";
import { router } from "expo-router";

const CreateReel = () => {
  const user = useSelector((state) => state.user);
  const [media, setMedia] = useState(null);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to pick image or video
  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setMedia(result.assets[0].uri);
    }
  };

  // Handle share button
  const handleShare = async () => {
    setMedia(
      "https://videos.pexels.com/video-files/6568032/6568032-hd_1920_1080_30fps.mp4"
    );

    if (!media || !desc) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/createReel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          reelUrl: media,
          desc: desc,
        }),
      });

      const data = await response.json();
      console.log("Success:", data.message);
      setLoading(false);

      router.push("../account");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>
          "Let's make some pawsome content!"
        </Text>

        {/* Media Preview */}
        {media ? (
          <Image
            source={{ uri: media }}
            resizeMode="contain"
            style={styles.mediaPreview}
          />
        ) : (
          <TouchableOpacity
            onPress={pickMedia}
            style={styles.selectMediaButton}
          >
            <Text style={styles.selectMediaText}>Choose Image or Video</Text>
          </TouchableOpacity>
        )}
        {media && (
          <TouchableOpacity
            onPress={pickMedia}
            style={styles.selectMediaButtonShort}
          >
            <Text style={styles.selectMediaText}>
              Choose other Image or Video
            </Text>
          </TouchableOpacity>
        )}

        {/* desc Textarea */}
        <TextInput
          placeholder="Write a catchy caption..."
          value={desc}
          onChangeText={setDesc}
          multiline
          style={styles.descInput}
          placeholderTextColor={Colors.subtleText}
        />

        {/* Share Button */}
        <TouchableOpacity
          onPress={handleShare}
          style={styles.shareButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.shareButtonText}>Share</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateReel;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.lightPink,
    alignItems: "center",
  },
  container: {
    backgroundColor: Colors.lightPink,
    padding: 20,
    alignItems: "center",
    overflow: "scroll",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.darkText,
    marginBottom: 20,
    textAlign: "center",
  },
  selectMediaButton: {
    backgroundColor: Colors.darkPink,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    minHeight: 400,
    width: "100%",
    backgroundColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center",
  },
  selectMediaButtonShort: {
    backgroundColor: "lightgrey",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  selectMediaText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  mediaPreview: {
    width: "100%",
    height: 400,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "contain",
  },
  descInput: {
    width: "100%",
    backgroundColor: Colors.lightGrey,
    color: Colors.darkText,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: "top",
    height: 100,
    marginBottom: 20,
    border: "2px solid lightgrey",
  },
  shareButton: {
    backgroundColor: Colors.red,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  shareButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
