import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Video } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { BACKEND_URL } from "../../../env";
import { useSelector } from "react-redux";
import ConfirmationModal from "../../../components/ConfirmationModal";
import VideoModal from "../../../components/VideoModel";
import { Path, Svg } from "react-native-svg";

const SavedReel = ({ email }) => {
  const [savedReels, setSavedReels] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);
  const [reelIdToDelete, setReelIdToDelete] = useState(null);
  const [selectedReel, setSelectedReel] = useState(null); // Store selected user details
  const [hasError, setHasError] = useState(false);

  const user = useSelector((state) => state.user);
  const fetchUser = async () => {
    setLoader(true);
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
        setLoader(false);
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [email, user.email]);

  const openModal = (reel) => {
    setSelectedReel(reel);
    setVideoModalVisible(true);
  };

  const closeModal = () => {
    setVideoModalVisible(false);
  };

  const confirmDeleteReel = (reelId) => {
    setReelIdToDelete(reelId);
    setModalVisible(true);
    setModalMessage(
      "Are you sure you want to remove this reel from saved reels?"
    );
  };

  const onConfirmAction = async () => {
    setButtonLoader(true);
    await handleDeleteReel(reelIdToDelete);
    setButtonLoader(false);
    setModalVisible(false);
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
    } catch (error) {
      console.error("Error deleting reel:", error);
    }
  };

  return (
    <View style={styles.container}>
      {selectedReel && (
        <VideoModal
          visible={videoModalVisible}
          onClose={closeModal}
          videoUrl={selectedReel.reelUrl}
          profileImage={selectedReel.user.profileImage}
          name={selectedReel.user.name}
          dailyLikes={selectedReel.dailyLikes}
          totalLikes={selectedReel.totalLikes}
          description={selectedReel.desc}
        />
      )}
      {savedReels.length !== 0 && (
        <View style={styles.headerContainer}>
          <Image
            source={require("../../../assets/images/memeCats/likeCat.png")}
            style={styles.likeCat}
          />
          <Text style={styles.headerText}>Meow-ments You've Saved</Text>
        </View>
      )}

      {loader ? (
        <ActivityIndicator
          size="large"
          style={{ marginTop: 20 }}
          color={Colors.lightPink}
        />
      ) : savedReels.length === 0 ? (
        <View style={styles.noReelsContainer}>
          <Image
            source={require("../../../assets/images/memeCats/logo.png")}
            style={styles.noReelsImage}
          />
          <Text style={styles.noReelsText}>No saved reels</Text>
          <Text style={styles.noReelsText}>Hooman!</Text>
        </View>
      ) : (
        <FlatList
          data={savedReels}
          numColumns={2}
          keyExtractor={(item, index) => `SavedReel-${index}`}
          contentContainerStyle={styles.reelGrid}
          refreshing={loader}
          onRefresh={() => fetchUser()}
          renderItem={({ item }) => {
            return (
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
                      onError={() => setHasError(true)}
                    />
                  ) : (
                    <View style={styles.errorTextContainer}>
                      <Text style={styles.errorText}>
                        Something went wrong!
                      </Text>
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
                    <TouchableOpacity
                      onPress={() => confirmDeleteReel(item._id)}
                    >
                      <AntDesign name="delete" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
      <ConfirmationModal
        visible={isModalVisible}
        message={modalMessage}
        loader={buttonLoader}
        onConfirm={() => onConfirmAction()}
        onCancel={() => setModalVisible(false)}
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
    paddingTop: 10,
  },
  headerText: {
    fontSize: 25,
    fontFamily: "Regular",
    marginBottom: 10,
    textAlign: "center",
  },
  reelWrapper: {
    width: "50%",
    padding: 5,
  },
  reelGrid: {
    paddingTop: 20,
  },
  noReelsImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  likeCat: {
    height: 130,
    width: 130,
    resizeMode: "contain",
  },
  noReelsContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  noReelsText: {
    fontFamily: "Bold",
    fontSize: 20,
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
