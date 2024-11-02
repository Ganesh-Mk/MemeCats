import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../../constants/Colors";
import { storeName, storeProfileImage } from "../../../store/user";
import { BACKEND_URL } from "../../../env";
import { router } from "expo-router";

const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const [name, setName] = useState(user.name);
  const [profileImage, setProfileImage] = useState(user.profileImage || "");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Request permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "You need to grant permission to access your photos."
        );
      }
    };
    requestPermissions();
  }, []);

  const handleEditProfile = async () => {
    setLoading(true);

    // Prepare the form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", user.email);
    if (profileImage) {
      // Attach image with required metadata for React Native
      formData.append("profileImage", {
        uri: profileImage,
        name: "profileImage.jpg",
        type: "image/jpeg",
      });
    }

    try {
      const response = await fetch(`${BACKEND_URL}/editProfile`, {
        method: "PATCH",
        body: formData, // Pass formData directly as the body
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(storeName(name));
        dispatch(storeProfileImage(data.user.profileImage));
        Alert.alert("Success", data.message);
        router.push("../account");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Aftre pick: ", result);
    //Aftre pick:  {"assets": [{"assetId": null, "base64": null, "duration": null, "exif": null, "fileName": "b9f61571-458c-4d9d-9fe4-57e18bb01d3d.jpeg", "fileSize": 57525, "height": 405, "mimeType": "image/jpeg", "rotation": null, "type": "image", "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540ganeshmk%252Ffrontend/ImagePicker/b9f61571-458c-4d9d-9fe4-57e18bb01d3d.jpeg", "width": 540}], "canceled": false}

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Get the image URI from the selected result
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Purr-fect your profile, hooman!</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{
            uri: profileImage || "https://example.com/defaultProfileImage.jpg",
          }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity
        style={styles.btnBox}
        onPress={handleEditProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.btnText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: "center",
    marginBottom: 60,
    backgroundColor: "#ccc", // Fallback color if the image doesn't load
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 70,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  btnBox: {
    backgroundColor: Colors.red,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
  },
});
