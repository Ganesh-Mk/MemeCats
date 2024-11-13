import React, { useState, useEffect } from "react";
import Svg, { G, Path } from "react-native-svg";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "../../env";
import { useSelector } from "react-redux";

const SaveIcon = ({ reel, handleReelSaved }) => {
  const user = useSelector((state) => state.user);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      const storedSaveStatus = await AsyncStorage.getItem(`saved_${reel._id}`);
      if (storedSaveStatus === "true") {
        setSaved(true);
      }
    };

    checkSavedStatus();
  }, [reel._id]);

  const handleDeleteReel = async (reelId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/deleteSavedReel`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reelId, userId: user.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete saved reel");
      }

      // Optionally, update local state or UI after deleting
    } catch (error) {
      console.error("Error deleting reel:", error);
    }
  };

  const handlePress = async () => {
    const newSavedState = !saved;
    setSaved(newSavedState);

    await AsyncStorage.setItem(`saved_${reel._id}`, newSavedState.toString());

    if (newSavedState) {
      handleReelSaved();
    } else {
      handleDeleteReel(reel._id);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      {saved ? (
        <Image
          source={require("../../assets/images/save-instagram (2).png")}
          style={styles.button}
        />
      ) : (
        <Image
          source={require("../../assets/images/save-instagram (1).png")}
          style={styles.button}
        />
      )}
      {saved ? (
        <Text style={styles.savedText}>Saved</Text>
      ) : (
        <Text style={styles.savedText}>Save</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    width: 30,
    height: 30,
  },
  savedText: {
    textAlign: "center",
    fontFamily: "Regular",
    color: "white",
    fontSize: 12,
  },
});

export default SaveIcon;
