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
import Colors from "../../../constants/Colors";
import ActiveLikedIcon from "../../../components/Icons/ActiveLikedIcon";
import CommentModels from "../../../components/CommentModel";

const { height: screenHeight } = Dimensions.get("window");
const viewabilityConfig = {
  itemVisiblePercentThreshold: 50,
};

const Reels = () => {
  const reelReducer = useSelector((state) => state.reel);
  const user = useSelector((state) => state.user);
  const videoRefs = useRef([]);

  const [data, setData] = useState([]);
  const [errorReels, setErrorReels] = useState(new Set());
  const [muted, setMuted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [paused, setPaused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [reelsLoader, setReelsLoader] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [reelCommentId, setReelCommentId] = useState([]);
  const [commentsModelVisible, setCommentsModelVisible] = useState(false);
  let currentStart = 0;
  const FETCH_REELS_LIMIT = 5;

  async function getData() {
    setReelsLoader(true);

    const response = await fetch(
      `${BACKEND_URL}/getAllReels?start=${currentStart}&limit=${FETCH_REELS_LIMIT}`
    );
    const fetchData = await response.json();

    if (fetchData.allReels && fetchData.allReels.length > 0) {
      setData((prevReels) => [...prevReels, ...fetchData.allReels]);
      currentStart += FETCH_REELS_LIMIT; // Update the start for the next call
    } else {
      Alert.alert("No reels found", "Check your internet connection!", [
        { text: "ok" },
      ]);
    }

    setReelsLoader(false);
  }

  useEffect(() => {
    getData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setData([]);
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

      if (
        viewableItems[0] &&
        viewableItems[0].index >= 0 &&
        viewableItems[0].index % FETCH_REELS_LIMIT === 0
      ) {
        getData();
      }

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
    [currentIndex, videoRefs]
  );

  const handleReelLiked = async (reel) => {
    setShowIcon(true);
    reel.totalLikes += 1;
    reel.dailyLikes += 1;

    setTimeout(() => {
      setShowIcon(false); // Hide it after 1 second
    }, 1000);

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

  const handleReelComments = async (reel) => {};

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
      Alert.alert("An error occurred", "Unable to save the reel.", [
        { text: "OK" },
      ]);
    }
  };

  const handleError = (index) => {
    setErrorReels((prev) => new Set(prev.add(index)));
  };

  const renderItem = ({ item, index }) => {
    // Check if the reel has an error and skip rendering
    if (errorReels.has(index)) {
      return null; // Skip rendering the reel if it has an error
    }

    return (
      <View style={styles.container}>
        <View>
          <Pressable
            onPress={() => togglePlayPause(index)}
            style={styles.overlay}
          >
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
              onError={() => handleError(index)} // Handle error
            />

            <PlayPauseIcon paused={paused} />
            <ActiveLikedIcon visible={showIcon} />
          </Pressable>

          <BottomOverlay
            profileImage={item.user.profileImage || null}
            name={item.user.name}
            desc={item.desc}
          />

          <RightOverlay
            handleReelLiked={() => handleReelLiked(item)}
            handleReelLikeRemoved={() => handleReelLikeRemoved(item)}
            handleReelSave={() => handleReelSave(item._id)}
            openCommentsModal={() => openCommentsModal(item._id)}
            closeCommentsModal={closeCommentsModal}
            toggleMute={toggleMute}
            muted={muted}
            reel={item}
            index={index}
          />

          {reelsLoader && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator
                size="small"
                color={Colors.white}
                style={styles.activityIndicator}
              />
              <Text style={styles.loadingText}>Loading more reels...</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const closeCommentsModal = () => {
    setCommentsModelVisible(false);
  };
  const openCommentsModal = (reelId) => {
    console.log("ReelComments", reelId);
    setReelCommentId(reelId);
    setCommentsModelVisible(true);
  };

  return (
    <View>
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
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      {commentsModelVisible && (
        <CommentModels
          reelId={reelCommentId}
          closeCommentsModal={closeCommentsModal}
        />
      )}
    </View>
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
  loaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "85%",
    left: Dimensions.get("window").width / 2 - 40,
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 9999,
    backgroundColor: "rgba(0, 0, 0, .3)",
    padding: 10,
    borderRadius: 10,
  },
  activityIndicator: {
    marginRight: 10,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.white,
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
