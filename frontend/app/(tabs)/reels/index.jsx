import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  Pressable,
  Text,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Video } from "expo-av";
import { BACKEND_URL } from "../../../env";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";

const { height: screenHeight } = Dimensions.get("window");
const viewabilityConfig = {
  itemVisiblePercentThreshold: 50,
};

const Reels = () => {
  const reelReducer = useSelector((state) => state.reel);
  const user = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [muted, setMuted] = useState(false);

  const videoRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [paused, setPaused] = useState(false);

  async function getData() {
    const response = await fetch(`${BACKEND_URL}/getAllReels`);
    const data = await response.json();
    setData(data.allReels);
  }

  useEffect(() => {
    getData();
  }, []);

  const toggleMute = (index) => {
    setMuted((prevMuted) => !prevMuted);
  };

  const togglePlayPause = (index) => {
    const videoRef = videoRefs.current[index];
    if (videoRef) {
      if (paused) {
        videoRef.playAsync();
      } else {
        videoRef.pauseAsync();
      }
      setPaused(!paused);
    }
  };

  const togglePlay = (index) => {
    const videoRef = videoRefs.current[index];
    if (videoRef) {
      videoRef.playAsync();
    }
  };
  const togglePause = (index) => {
    const videoRef = videoRefs.current[index];
    if (videoRef) {
      videoRef.pauseAsync();
    }
  };

  useEffect(() => {
    if (currentIndex !== null) {
      if (reelReducer.refreshTogglePlayPause === true) {
        togglePlay(currentIndex);
      } else {
        togglePause(currentIndex);
      }
      console.log("Inside toggle useEffect");
    }
  }, [reelReducer]);

  const handleViewableItemsChanged = ({ viewableItems, changed }) => {
    let nextPlayingIndex = null;
    changed.forEach((item) => {
      const videoRef = videoRefs.current[item.index];
      if (item.isViewable) {
        nextPlayingIndex = item.index;
      } else if (item.index === currentIndex && videoRef) {
        videoRef.stopAsync();
        setCurrentIndex(null);
      }
    });

    if (nextPlayingIndex !== null && nextPlayingIndex !== currentIndex) {
      const nextVideoRef = videoRefs.current[nextPlayingIndex];
      if (nextVideoRef) {
        nextVideoRef.playAsync();
        setPaused(false); // Ensure play state resets
        setCurrentIndex(nextPlayingIndex);
      }
    }
  };

  const handleReelLiked = async (reel) => {
    reel.totalLikes += 1;
    reel.dailyLikes += 1;
    console.log("Liked: ", reel.totalLikes);

    const response = await fetch(`${BACKEND_URL}/updateReelLikes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reelId: reel._id,
        totalLikes: reel.totalLikes,
        dailyLikes: reel.dailyLikes,
      }),
    });
  };

  const handleReelComments = async (reel) => {
    console.log("Comment on : ", reel);
  };
  const handleReelSave = async (reelId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/saveReel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reelId: reelId,
          userId: user.id,
        }),
      });

      if (response.ok) {
        Alert.alert("Reel Saved Successfully", " Your reel has been saved", [
          { text: "OK" },
        ]);
      } else {
        Alert.alert("Reel Not Saved", " Your reel has not been saved", [
          { text: "OK" },
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.container}>
      <Pressable onPress={() => togglePlayPause(index)} style={styles.overlay}>
        <Video
          ref={(ref) => {
            videoRefs.current[index] = ref;
          }}
          source={{ uri: item.reelUrl }}
          style={styles.video}
          useNativeControls={false}
          resizeMode="cover"
          isLooping
          shouldPlay={index === currentIndex && !paused}
          isMuted={muted}
        />
        {/* Bottom overlay items */}
        <View style={styles.bottomOverlay}>
          <Text style={styles.username}>@username</Text>
          <Text style={styles.description}>Description of the video...</Text>
        </View>

        {/* Right-side overlay items */}
        <View style={styles.rightOverlay}>
          <Pressable style={styles.iconButton}>
            <Icon
              name="heart"
              onPress={() => handleReelLiked(item)}
              size={30}
              color="white"
            />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Icon
              name="comment"
              onPress={() => handleReelComments(item)}
              size={30}
              color="white"
            />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Icon
              name="save"
              onPress={() => handleReelSave(item._id)}
              size={30}
              color="white"
            />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={() => toggleMute(index)}
          >
            <Icon
              name={muted ? "volume-off" : "volume-up"}
              size={30}
              color="white"
            />
          </Pressable>
        </View>
      </Pressable>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `${item._id}-${index}`}
      renderItem={renderItem}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}
      onViewableItemsChanged={handleViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
};

export default Reels;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: screenHeight,
    backgroundColor: "black",
  },
  video: {
    width: "100%",
    height: screenHeight,
  },
  overlay: {
    width: "100%",
    height: "100%",
  },
  contentContainerStyle: {
    alignItems: "center",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 20,
    left: 10,
  },
  username: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
  rightOverlay: {
    position: "absolute",
    right: 10,
    bottom: 100,
    alignItems: "center",
  },
  iconButton: {
    marginVertical: 10,
  },
});
