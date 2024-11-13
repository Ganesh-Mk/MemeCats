import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  Pressable,
  Text,
  Alert,
  Touchable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Video } from "expo-av";
import { BACKEND_URL } from "../../../env";
import { useSelector } from "react-redux";
import BottomOverlay from "../../../components/BottomOverlay";
import RightOverlay from "../../../components/RightOverlay";
import CommentsOverlay from "../../../components/CommentsOverlay";
import PlayPauseIcon from "../../../components/Icons/PlayPauseIcon";

const { height: screenHeight } = Dimensions.get("window");
const viewabilityConfig = {
  itemVisiblePercentThreshold: 50,
};

const Reels = () => {
  const reelReducer = useSelector((state) => state.reel);
  const user = useSelector((state) => state.user);
  const videoRefs = useRef([]);

  const [data, setData] = useState([]);
  const [muted, setMuted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [paused, setPaused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function getData() {
    const response = await fetch(`${BACKEND_URL}/getAllReels`);
    const data = await response.json();
    setData(data.allReels);
  }

  useEffect(() => {
    getData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (currentIndex !== null) {
      if (reelReducer.refreshTogglePlayPause === true) {
        togglePlay(currentIndex);
      } else {
        togglePause(currentIndex);
      }
    }
  }, [reelReducer]);

  const toggleMute = useCallback(() => {
    setMuted((prevMuted) => !prevMuted);
  }, []);

  const togglePlayPause = (index) => {
    const videoRef = videoRefs.current[index];
    if (videoRef) {
      if (paused && reelReducer.refreshTogglePlayPause) {
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
      setPaused(false);
    }
  };

  const togglePause = (index) => {
    const videoRef = videoRefs.current[index];
    if (videoRef) {
      videoRef.pauseAsync();
      setPaused(true);
    }
  };

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems, changed }) => {
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
          setPaused(false);
          setCurrentIndex(nextPlayingIndex);
        }
      }
    },
    [currentIndex, videoRefs, setPaused]
  );

  const handleReelLiked = async (reel) => {
    reel.totalLikes += 1;
    reel.dailyLikes += 1;
    "Reel Liked : ", reel.totalLikes;

    const response = await fetch(`${BACKEND_URL}/updateReelLikes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reelId: reel._id,
        userId: user.id,
        totalLikes: reel.totalLikes,
        dailyLikes: reel.dailyLikes,
        isLiked: true,
      }),
    });
  };
  const handleReelLikeRemoved = async (reel) => {
    reel.totalLikes -= 1;
    reel.dailyLikes -= 1;

    const response = await fetch(`${BACKEND_URL}/updateReelLikes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reelId: reel._id,
        userId: user.id,
        totalLikes: reel.totalLikes,
        dailyLikes: reel.dailyLikes,
        isLiked: false,
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

      if (!response.ok) {
        Alert.alert("Reel Not Saved", " Your reel has not been saved", [
          { text: "OK" },
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openCommentsModal = (item) => {
    console.log("Open Comments Modal");
  };

  const closeCommentsModal = () => {
    console.log("Close Comments Modal");
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

        <PlayPauseIcon paused={paused} />
      </Pressable>

      <BottomOverlay
        profileImage={item.user.profileImage}
        name={item.user.name}
        desc={item.desc}
      />

      <RightOverlay
        handleReelLiked={() => handleReelLiked(item)}
        handleReelLikeRemoved={() => handleReelLikeRemoved(item)}
        handleReelSave={() => handleReelSave(item._id)}
        openCommentsModal={handleReelComments}
        toggleMute={toggleMute}
        muted={muted}
        reel={item}
        index={index}
      />

      <CommentsOverlay
        onCommentPress={() => handleReelComments(item)}
        onCommentClose={closeCommentsModal}
      />
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `${item._id}-${index}`}
      renderItem={renderItem}
      snapToInterval={screenHeight * 1.0}
      decelerationRate="fast"
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={handleViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      contentContainerStyle={styles.contentContainerStyle}
      refreshing={refreshing} // Add this
      onRefresh={onRefresh}
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
    height: "100%",
  },
  overlay: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  contentContainerStyle: {
    padding: 0,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 20,
    left: 10,
  },
});
