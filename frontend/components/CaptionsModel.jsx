import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import Colors from "../constants/Colors";
import { BACKEND_URL } from "../env";
import ConfirmationModal from "./ConfirmationModal";

export default function CaptionsModel({ visible, onSelect, closeModel }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [captions, setCaptions] = useState([]);
  const [desc, setDesc] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible]);

  const handlePressIn = (anim) => {
    Animated.spring(anim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (anim) => {
    Animated.spring(anim, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleAI = async () => {
    setLoader(true);
    try {
      const response = await fetch(`${BACKEND_URL}/getAIResponse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: desc,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCaptions(data.captions);
      } else {
        Alert.alert("Upload Failed", data.message, [{ text: "OK" }]);
      }
    } catch (error) {
      setModalVisible(true);
      setModalMessage(
        "AI is stuck in traffic! Free model struggles, Try again later!"
      );
    } finally {
      setLoader(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <ConfirmationModal
        visible={isModalVisible}
        message={modalMessage}
        button={"Oh Alright!"}
        catImage={"okCat"}
        onConfirm={() => setModalVisible(false)}
      />
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <TouchableOpacity onPress={closeModel} style={styles.closeButton}>
            <Image
              source={require("../assets/images/cancelIcon.png")}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Generate AI Captions</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="What's cat doing?"
              value={desc}
              multiline={true}
              onChangeText={setDesc}
            />
            <TouchableOpacity onPress={handleAI} style={styles.aiBox}>
              {loader ? (
                <ActivityIndicator color={Colors.darkBlue} size={30} />
              ) : (
                <Image
                  source={require("../assets/images/gemini.png")}
                  style={styles.image}
                />
              )}
              <Text style={styles.aiText} onPress={handleAI}>
                Generate
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={styles.captionsContainer}>
              {captions &&
                captions?.map((caption, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(caption);
                      closeModel();
                    }}
                    key={caption}
                    style={styles.captionContainer}
                  >
                    <Text style={styles.captionText}>{caption}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  closeIcon: {
    height: 40,
    width: 40,
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    zIndex: 10,
  },
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

  modalContainer: {
    width: "90%",
    maxHeight: "90%",
    padding: 20,
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
    alignItems: "center",
    transform: [{ scale: 0.9 }],
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
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
  textContainer: {
    borderColor: Colors.red,
    borderWidth: 2,
  },
  modalText: {
    fontSize: 25,
    fontFamily: "Regular",
    textAlign: "center",
  },
  moreButton: {
    padding: 10,
    backgroundColor: Colors.red,
    borderRadius: 10,
    width: "100%",
  },
  moreButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  confirmButton: {
    padding: 10,
    backgroundColor: Colors.red,
    borderRadius: 10,
    width: 100,
  },
  newConfirmButton: {
    padding: 10,
    backgroundColor: Colors.red,
    borderRadius: 10,
    width: "100%",
  },
  captionsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    flex: 1,
  },
  captionContainer: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    width: "100%",
    gap: 10,
    borderColor: Colors.darkBlue,
  },
  captionText: {
    color: Colors.black,
    textAlign: "start",
    fontFamily: "Regular",
    fontSize: 20,
  },
});
