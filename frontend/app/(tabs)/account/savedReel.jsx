import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Video } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { BACKEND_URL } from "../../../env";
import { useSelector } from "react-redux";

const SavedReel = ({ email }) => {
  const [savedReels, setSavedReels] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/getUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.user) {
          setSavedReels(data.user.saveReels);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [email, user.email]);

  const confirmDeleteReel = (reelId) => {
    Alert.alert(
      "Unsave Reel",
      "Are you sure you want to remove this reel from save collection?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleDeleteReel(reelId),
        },
      ],
      { cancelable: false }
    );
  };

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
        throw new Error("Failed to delete save reel");
      }

      setSavedReels((prevReels) =>
        prevReels.filter((reel) => reel._id !== reelId)
      );
      console.log(`Reel with ID: ${reelId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting reel:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Saved Reels</Text>
      <FlatList
        data={savedReels}
        numColumns={2}
        keyExtractor={(item, index) => `SavedReel-${index}`}
        contentContainerStyle={styles.reelGrid}
        renderItem={({ item }) => (
          <View style={styles.reelWrapper}>
            <TouchableOpacity style={styles.reelContainer}>
              <Video
                source={{ uri: item.reelUrl }}
                style={styles.reelVideo}
                useNativeControls
                resizeMode="contain"
              />
              <View style={styles.reelButtonsBox}>
                <Text style={styles.likeCount}>💖 {item.totalLikes}</Text>
                <TouchableOpacity onPress={() => confirmDeleteReel(item._id)}>
                  <AntDesign name="delete" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default SavedReel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightPink,
    padding: 20,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.darkText,
    textAlign: "center",
    marginBottom: 20,
  },
  reelWrapper: {
    width: "50%",
    padding: 5,
  },
  reelGrid: {
    paddingTop: 20,
  },
  reelContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: Colors.lightGrey,
    alignItems: "center",
    padding: 5,
  },
  reelVideo: {
    width: "100%",
    height: 230,
    borderRadius: 10,
  },
  reelButtonsBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
    width: "100%",
    paddingHorizontal: 15,
  },
  likeCount: {
    fontSize: 14,
    color: Colors.darkPink,
  },
});
