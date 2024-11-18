import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import {
  storeName,
  storeEmail,
  storeProfileImage,
  storeReels,
  storeId,
} from "../../store/user";
import { BACKEND_URL } from "../../env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Ionicons } from "@expo/vector-icons";
import CatButton from "../../components/CatButton";

const Login = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const router = useRouter();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setModalVisible(true);
      setModalMessage("You dumb! Fill all the fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("../(tabs)/reels");

        dispatch(storeId(data.user._id));
        dispatch(storeName(data.user.name));
        dispatch(storeEmail(data.user.email));
        dispatch(storeProfileImage(data.user.profileImage));
        dispatch(storeReels(data.user.reels));

        try {
          await AsyncStorage.clear();
          await AsyncStorage.setItem("id", data.user._id);
          await AsyncStorage.setItem("name", data.user.name);
          await AsyncStorage.setItem("email", data.user.email);
          await AsyncStorage.setItem("profileImage", data.user.profileImage);
          await AsyncStorage.setItem("reels", JSON.stringify(data.user.reels));
        } catch (error) {
          console.error("Error saving data on login", error);
        }
      } else {
        setModalVisible(true);
        setModalMessage("Email or password is wrong hooman! ");
      }
    } catch (error) {
      console.error("Network Error:", error);
      setModalVisible(true);
      setModalMessage("Something went wrong, Check your internet connection!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <ConfirmationModal
        visible={isModalVisible}
        message={modalMessage}
        button={"Oh Okay"}
        onConfirm={() => setModalVisible(false)}
      />
      <View style={styles.screen}>
        <Image
          source={require("../../assets/gif/dancingCat.gif")}
          style={styles.image}
        />

        <Text style={styles.headText}>Meow In</Text>
        <Text style={styles.subText}>Log in to your account</Text>

        <TextInput
          placeholder="Your Email 🐱"
          placeholderTextColor={Colors.gray}
          style={styles.input}
          keyboardType="email-address"
          onChangeText={setEmail}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="New Password 🙀"
            placeholderTextColor={Colors.gray}
            style={styles.input}
            secureTextEntry={secureTextEntry}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={toggleSecureTextEntry}
            style={styles.eyeButton}
          >
            <Ionicons
              name={secureTextEntry ? "eye-off" : "eye"}
              size={24}
              color={Colors.gray}
            />
          </TouchableOpacity>
        </View>

        <CatButton
          fontFamily={"Bold"}
          loading={loading}
          text="Submit Meow!"
          fontSize={25}
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.pink,
    padding: 20,
    paddingTop: 210,
  },
  image: {
    width: 250,
    height: 320,
    marginBottom: 40,
    resizeMode: "contain",
    position: "absolute",
    top: -120,
  },
  headText: {
    fontSize: 50,
    fontFamily: "Bold",
    textAlign: "center",
    color: Colors.darkBlue,
  },
  subText: {
    fontSize: 20,
    fontFamily: "Regular",
    textAlign: "center",
    color: Colors.black,
    marginBottom: 40,
  },
  inputContainer: {
    position: "relative",
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
    fontSize: 20,
    color: Colors.black,
    textAlign: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 20,
    top: 25,
    opacity: 0.4,
    transform: [{ translateY: -12 }],
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
  },
  btnText: {
    fontFamily: "Bold",
    fontSize: 25,
    textAlign: "center",
    color: Colors.white,
  },
});
