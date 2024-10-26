import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";
import * as ImagePicker from "expo-image-picker";

const defaultImage =
  "https://static-00.iconduck.com/assets.00/cat-symbol-icon-256x256-jqp15brc.png";

const EditProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  // Function to handle image picking
  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri; // Get the selected image URI
      setProfileImage(selectedImageUri);
    }
  };

  // Function to handle form submission
  // Function to handle form submission
  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", "ganesh@gmail.com");

    console.log("Profile Image without extract:", profileImage);

    if (profileImage) {
      const isBase64 = profileImage.startsWith("data:image/");
      if (isBase64) {
        // Append the Base64 image directly to the FormData
        formData.append("profileImage", profileImage);
      } else {
        const localUri = profileImage;
        const filename = localUri.split("/").pop();
        const type = `image/${filename.split(".").pop()}`;

        // Append the image file to the form data
        formData.append("profileImage", {
          uri: localUri,
          name: filename,
          type: type,
        });
      }
    } else {
      console.error("No image file selected.");
    }

    for (const [key, value] of formData.entries()) {
      if (key === "profileImage") {
        console.log(`${key}:`, value);
      } else {
        console.log(`${key}:`, value);
      }
    }

    try {
      const response = await fetch("http://localhost:5000/editProfile", {
        // Use your local IP here
        method: "PATCH",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data", // This may be optional; fetch should handle it.
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Profile updated successfully!");
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
        <TouchableOpacity
          onPress={handleImagePicker}
          style={styles.imageContainer}
        >
          <Image
            source={{ uri: profileImage || defaultImage }}
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <Text style={styles.headText}>Edit Profile</Text>
        <Text style={styles.subText}>Update Your Information</Text>

        <TextInput
          placeholder="Your New Cat Name 😻"
          placeholderTextColor={Colors.gray}
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity
          style={styles.btnBox}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.btnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  screen: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.pink,
    height: "100%",
    padding: "2rem",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.red,
    marginBottom: 20,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headText: {
    fontSize: 50,
    fontFamily: "Bold",
    textAlign: "center",
  },
  subText: {
    fontSize: 20,
    fontFamily: "Regular",
    textAlign: "center",
    marginVertical: 10,
    color: Colors.black,
    marginBottom: 40,
  },
  input: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 10,
    width: 300,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontFamily: "Regular",
    fontSize: 18,
    color: Colors.black,
    textAlign: "center",
  },
  btnBox: {
    marginTop: 20,
    backgroundColor: Colors.red,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    width: 300,
    textAlign: "center",
  },
  btnText: {
    fontFamily: "Bold",
    fontSize: 25,
    color: Colors.white,
  },
});
