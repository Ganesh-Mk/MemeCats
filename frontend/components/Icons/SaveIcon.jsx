import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../../env";

const SaveIcon = ({ reel, handleReelSaved }) => {
  const user = useSelector((state) => state.user);
  const [saved, setSaved] = useState(false);

  const getUserData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/getUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });

      if (response.ok) {
        const data = await response.json();

        // Safely access savedReels from the response
        const savedReelIds = data.savedReels?.map((reel) => reel._id);

        if (reel && savedReelIds) {
          const isReelSaved = savedReelIds.includes(reel._id);
          setSaved(isReelSaved);
        }
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  };

  useEffect(() => {
    getUserData();
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
    } catch (error) {
      console.error("Error deleting reel:", error);
    }
  };

  const handlePress = async () => {
    const newSavedState = !saved;
    setSaved(newSavedState);

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
