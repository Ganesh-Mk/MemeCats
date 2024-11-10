import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../../constants/Colors";
import { storeName, storeProfileImage } from "../../../store/user";
import { BACKEND_URL } from "../../../env";
import { router } from "expo-router";
import CatButton from "../../../components/CatButton";

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
          "You need to grant permission to access your photos.",
          [{ text: "OK" }]
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
        router.push("../account");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred", [
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.headerText}>Purr-fect your profile, hooman!</Text>

        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../../assets/images/memeCats/noProfileImage.png")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <CatButton
          text="Save Changes"
          loading={loading}
          onPress={handleEditProfile}
        />
      </View>
    </ScrollView>
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
    fontSize: 20,
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
