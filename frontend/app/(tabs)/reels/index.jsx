import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  Pressable,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Video } from "expo-av";
import { BACKEND_URL } from "../../../env";
import { useSelector } from "react-redux";

const { height: screenHeight } = Dimensions.get("window");
const viewabilityConfig = {
  itemVisiblePercentThreshold: 50,
};

const Reels = () => {
  const reelReducer = useSelector((state) => state.reel);
  const [data, setData] = useState([]);
  const videoRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [paused, setPaused] = useState(false); // State for toggling play/pause

  async function getData() {
    const response = await fetch(`${BACKEND_URL}/getAllReels`);
    const data = await response.json();
    setData(data.allReels);
  }

  useEffect(() => {
    getData();
  }, []);

  const togglePlayPause = (index) => {
    const videoRef = videoRefs.current[index];
    if (videoRef) {
      if (paused) {
        videoRef.playAsync();
      } else {
        videoRef.pauseAsync();
      }
      setPaused(!paused); // Toggle paused state
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
        />
      </Pressable>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
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
    height: "100%",
  },
  overlay: {
    width: "100%",
    height: "100%",
  },
  contentContainerStyle: {
    alignItems: "center",
  },
});
