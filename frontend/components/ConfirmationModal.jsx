// components/ConfirmationModal.js
import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Image,
} from "react-native";
import Colors from "../constants/Colors";

export default function ConfirmationModal({
  message,
  visible,
  onConfirm,
  onCancel,
  loader,
  button,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Image
            source={require("../assets/images/memeCats/sideEyeCat2.png")}
            style={styles.noReelsImage}
          />
          <Text style={styles.modalText}>{message}</Text>
          {button ? (
            <TouchableOpacity
              style={styles.newConfirmButton}
              onPressIn={() => handlePressIn(scaleAnim)}
              onPressOut={() => handlePressOut(scaleAnim)}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>{button}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPressIn={() => handlePressIn(scaleAnim)}
                onPressOut={() => handlePressOut(scaleAnim)}
                onPress={onConfirm}
              >
                {/* <Text style={styles.buttonText}>Yes</Text> */}
                {loader ? (
                  <ActivityIndicator size="large" color={Colors.white} />
                ) : (
                  <Text style={styles.buttonText}>Yes</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPressIn={() => handlePressIn(scaleAnim)}
                onPressOut={() => handlePressOut(scaleAnim)}
                onPress={onCancel}
              >
                <Text style={styles.noButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          )}
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
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
    alignItems: "center",
    transform: [{ scale: 0.9 }],
  },
  modalText: {
    fontSize: 25,
    marginBottom: 30,
    fontFamily: "Regular",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  noReelsImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
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
  cancelButton: {
    padding: 10,
    borderRadius: 10,
    width: 100,
    borderWidth: 2,
    borderColor: Colors.red,
  },
  buttonText: {
    color: Colors.white,
    textAlign: "center",
    fontFamily: "Bold",
    fontSize: 20,
  },

  noButtonText: {
    color: Colors.black,
    textAlign: "center",
    fontFamily: "Bold",
    fontSize: 20,
  },
});
