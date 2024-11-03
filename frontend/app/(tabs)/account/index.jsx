// pages/account/index.js
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Video } from "expo-av";
import { useSelector, useDispatch } from "react-redux";
import {
  storeId,
  storeName,
  storeEmail,
  storeProfileImage,
  storeReels,
} from "../../../store/user";
import AntDesign from "@expo/vector-icons/AntDesign";
import { BACKEND_URL } from "../../../env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../../constants/Colors";
import ConfirmationModal from "../../../components/ConfirmationModal";

export default function AccountScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isModalVisible, setModalVisible] = useState(false);
  const [reelToDelete, setReelToDelete] = useState(null);
  const [refreshReels, setRefreshReels] = useState(0);
  const { name, email, profileImage, reels } = user;

  const handleDeleteReel = async () => {
    if (!reelToDelete) return;
    try {
      const response = await fetch(`${BACKEND_URL}/deleteReel`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, reelId: reelToDelete }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert("Error during Reel deletion", errorData.message, [
          { text: "OK" },
        ]);
        console.log("Error deleting reel:", errorData.message);
        return;
      }

      const data = await response.json();

      setRefreshReels(refreshReels + 1);
    } catch (err) {
      console.error("Error in deleteReel function:", err);
      Alert.alert("An error occurred", "Unable to delete the reel.");
    } finally {
      setReelToDelete(null); // Clear the reel ID
      setModalVisible(false); // Hide the modal
    }
  };

  const confirmDeleteReel = (reelId) => {
    setReelToDelete(reelId);
    setModalVisible(true);
  };

  const logout = async () => {
    await AsyncStorage.setItem("name", "");
    dispatch(storeId(""));
    dispatch(storeName(""));
    dispatch(storeEmail(""));
    dispatch(storeProfileImage(""));
    dispatch(storeReels([]));
    router.push("../../");
  };

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const email = await AsyncStorage.getItem("email");
        const response = await fetch(`${BACKEND_URL}/getUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        dispatch(storeReels(data.user.reels || []));
      } catch (err) {
        console.log(err);
      }
    };
    loadAllData();
  }, [refreshReels]);

  return (
    <View style={styles.container}>
      <ConfirmationModal
        visible={isModalVisible}
        onConfirm={handleDeleteReel}
        onCancel={() => setModalVisible(false)}
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>Account</Text>
        <TouchableOpacity onPress={logout}>
          <AntDesign name="logout" size={27} color="red" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfoContainer}>
        <Image
          source={{
            uri:
              profileImage ||
              "https://static-00.iconduck.com/assets.00/cat-symbol-icon-256x256-jqp15brc.png",
          }}
          style={styles.profileImage}
        />
        <View style={styles.profileDetails}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.reelCount}>Total Reels: {reels?.length}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => router.push("../account/createReel")}
          style={styles.btnBox}
        >
          <Text style={styles.btnText}>Create Reel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("../account/editProfile")}
          style={styles.btnBox}
        >
          <Text style={styles.btnText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("../account/savedReel")}
          style={styles.btnBox}
        >
          <Image
            style={{ width: 30, height: "100%" }}
            source={{
              uri: "https://cdn.iconscout.com/icon/free/png-256/free-save-logo-icon-download-in-svg-png-gif-file-formats--instagram-social-media-brand-filled-line-pack-logos-icons-2724646.png?f=webp&w=256",
            }}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>Reels</Text>
      <FlatList
        data={reels}
        numColumns={2}
        keyExtractor={(item) => item._id}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightPink,
    padding: 20,
  },
  header: {
    backgroundColor: Colors.lightPink,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.darkText,
    textAlign: "center",
  },
  profileInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: Colors.darkPink,
    borderWidth: 3,
    marginRight: 15,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  iconDesign: {
    backgroundColor: "lightgrey",
    padding: 5,
    borderRadius: 100,
  },
  profileDetails: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.darkText,
    marginBottom: 5,
  },

  email: {
    fontSize: 18,
    color: Colors.subtleText,
    marginBottom: 5,
  },
  reelCount: {
    fontSize: 18,
    color: Colors.darkPink,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.darkPink,
    borderRadius: 5,
    padding: 10,
    width: "40%",
    alignItems: "center",
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
  btnBox: {
    backgroundColor: Colors.red,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    height: 44,
  },
  btnText: {
    fontFamily: "Regular",
    fontSize: 20,
    textAlign: "center",
    color: Colors.white,
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
    borderRadius: 10,
  },
  reelVideo: {
    width: "100%",
    height: 230,
    borderRadius: 10,
  },
  likeCount: {
    fontSize: 14,
    color: Colors.darkPink,
  },
});
