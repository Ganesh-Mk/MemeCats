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
  ActivityIndicator,
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
import { setRefreshTogglePlayPause } from "../../../store/reel";
import CatButton from "../../../components/CatButton";
import VideoModal from "../../../components/VideoModel";
import { Path, Svg } from "react-native-svg";

export default function AccountScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isModalVisible, setModalVisible] = useState(false);
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [reelToDelete, setReelToDelete] = useState(null);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [refreshReels, setRefreshReels] = useState(0);
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [reels, setReels] = useState([]);
  const [reelsLoader, setReelsLoader] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null); // Store selected user details

  const { email } = user;

  const handleDeleteReel = async (reelId) => {
    if (!reelId) return;

    setButtonLoader(true);
    try {
      const response = await fetch(`${BACKEND_URL}/deleteReel`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, reelId: reelId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert("Error during Reel deletion", errorData.message, [
          { text: "OK" },
        ]);
        return;
      }

      setRefreshReels(refreshReels + 1);
      setButtonLoader(false);
    } catch (err) {
      console.error("Error in deleteReel function:", err);
      Alert.alert("An error occurred", "Unable to delete the reel.");
    } finally {
      setReelToDelete(null);
      setModalVisible(false);
    }
  };

  const openModal = (reel) => {
    setSelectedReel(reel);
    setVideoModalVisible(true);
  };

  const closeModal = () => {
    setVideoModalVisible(false);
  };

  const confirmDeleteReel = (reelId) => {
    setReelToDelete(reelId);
    setModalMessage("Are you sure you want to delete this reel?");
    setOnConfirmAction(() => () => handleDeleteReel(reelId));
    setModalVisible(true);
  };

  const confirmLogout = () => {
    setModalMessage("Are you sure you want to logout?");
    setOnConfirmAction(() => logout); // Set confirm action to logout
    setModalVisible(true);
  };

  const logout = async () => {
    setButtonLoader(true);
    dispatch(setRefreshTogglePlayPause(false));
    await AsyncStorage.clear();
    dispatch(storeId(""));
    dispatch(storeName(""));
    dispatch(storeEmail(""));
    dispatch(storeProfileImage(""));
    dispatch(storeReels([]));
    setModalVisible(false);
    setButtonLoader(false);
    router.push("../../");
  };

  const loadAllData = async () => {
    setReelsLoader(true);
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
      setName(data.user.name);
      setProfileImage(data.user.profileImage);
      setReels(data.user.reels || []);
      dispatch(storeName(data.user.name));
      dispatch(storeProfileImage(data.user.profileImage));
      dispatch(storeReels(data.user.reels || []));
    } catch (err) {
      Alert.alert(
        "Error",
        "Unable to fetch user data! Check your internet connection",
        [{ text: "OK" }]
      );
    } finally {
      setReelsLoader(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [refreshReels]);

  return (
    <View style={styles.container}>
      {selectedReel && (
        <VideoModal
          visible={videoModalVisible}
          onClose={closeModal}
          videoUrl={selectedReel.reelUrl}
          profileImage={profileImage}
          name={name}
          comments={selectedReel.comments}
          dailyLikes={selectedReel.dailyLikes}
          totalLikes={selectedReel.totalLikes}
          description={selectedReel.desc}
        />
      )}
      <ConfirmationModal
        visible={isModalVisible}
        loader={buttonLoader}
        message={modalMessage}
        onConfirm={onConfirmAction}
        onCancel={() => setModalVisible(false)}
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>Account</Text>
        <TouchableOpacity onPress={confirmLogout}>
          <AntDesign name="logout" size={27} color="red" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfoContainer}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../../../assets/images/memeCats/noProfileImage.png")
          }
          style={styles.profileImage}
        />
        <View style={styles.profileDetails}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.reelCount}>Total Reels: {reels?.length}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CatButton
          text="Create Reel"
          onPress={() => router.push("../account/createReel")}
          width={130}
        />
        <CatButton
          text="Edit Profile"
          onPress={() => router.push("../account/editProfile")}
          width={130}
        />
        <TouchableOpacity
          onPress={() => router.push("../account/savedReel")}
          style={styles.btnBox}
        >
          <Image
            style={{ width: 20, height: "100%" }}
            source={require("../../../assets/images/save-instagram (2).png")}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>Reels</Text>

      {!reelsLoader && reels.length === 0 && (
        <View style={styles.noReelsContainer}>
          <Image
            source={require("../../../assets/images/memeCats/sideEyeCat1.gif")}
            style={styles.noReelsImage}
          />
          <Text style={styles.noReelsText}>Add new reels hooman!</Text>
        </View>
      )}
      <FlatList
        data={reels}
        numColumns={2}
        keyExtractor={(item, index) => `Account-reel-${index}`}
        contentContainerStyle={styles.reelGrid}
        refreshing={reelsLoader}
        onRefresh={() => loadAllData()}
        renderItem={({ item }) => (
          <View style={styles.reelWrapper}>
            <TouchableOpacity
              style={styles.reelContainer}
              onPress={() => openModal(item)}
            >
              {!hasError ? (
                <Video
                  source={{ uri: item.reelUrl }}
                  style={styles.reelVideo}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.errorTextContainer}>
                  <Text style={styles.errorText}>Something went wrong!</Text>
                  <Text style={[styles.errorText, { marginTop: 10 }]}>
                    Restart app
                  </Text>
                </View>
              )}
              <View style={styles.reelButtonsBox}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Svg
                    height={15}
                    width={20}
                    viewBox="0 0 512 512"
                    xmlSpace="preserve"
                  >
                    <Path
                      d="M474.655,74.503C449.169,45.72,413.943,29.87,375.467,29.87c-30.225,0-58.5,12.299-81.767,35.566 c-15.522,15.523-28.33,35.26-37.699,57.931c-9.371-22.671-22.177-42.407-37.699-57.931c-23.267-23.267-51.542-35.566-81.767-35.566 c-38.477,0-73.702,15.851-99.188,44.634C13.612,101.305,0,137.911,0,174.936c0,44.458,13.452,88.335,39.981,130.418 c21.009,33.324,50.227,65.585,86.845,95.889c62.046,51.348,123.114,78.995,125.683,80.146c2.203,0.988,4.779,0.988,6.981,0 c2.57-1.151,63.637-28.798,125.683-80.146c36.618-30.304,65.836-62.565,86.845-95.889C498.548,263.271,512,219.394,512,174.936 C512,137.911,498.388,101.305,474.655,74.503z"
                      fill={Colors.red}
                      stroke={Colors.red}
                      strokeWidth="50"
                    />
                  </Svg>
                  <Text style={styles.likes}>{item.totalLikes}</Text>
                </View>
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
  noReelsContainer: {
    height: "78%",
    alignItems: "center",
  },
  noReelsImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 50,
  },
  errorTextContainer: {
    width: "100%",
    height: 230,
    borderRadius: 10,
    backgroundColor: Colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontFamily: "Regular",
    fontSize: 16,
    textAlign: "center",
    color: Colors.black,
  },
  noReelsText: {
    fontSize: 20,
    fontFamily: "Bold",
    marginTop: 10,
    color: Colors.black,
    marginRight: 10,
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
    fontFamily: "Bold",
  },

  email: {
    fontSize: 18,
    color: Colors.subtleText,
    marginBottom: 5,
    fontFamily: "Regular",
  },
  reelCount: {
    fontSize: 18,
    fontFamily: "Regular",

    color: Colors.darkPink,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 5,
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
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000", // shadow effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    height: 44,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
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
