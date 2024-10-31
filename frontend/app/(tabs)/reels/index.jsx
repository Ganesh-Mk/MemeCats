import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Video } from "expo-av";
import { BACKEND_URL } from "../../../env";

const Reels = () => {
  const [data, setData] = useState([]);
  const videoRefs = useRef([]);

  async function getData() {
    const response = await fetch(`${BACKEND_URL}/getAllReels`);
    const data = await response.json();
    setData(data.allReels);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.container}>
          <Video
            source={{ uri: item.reelUrl }}
            style={styles.video}
            useNativeControls
            shouldPlay
            isLooping
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded && !status.isPlaying) {
                videoRefs.current[index]?.playAsync();
              }
            }}
            ref={(ref) => {
              videoRefs.current[index] = ref;
            }}
            resizeMode="contain" // Adjusted to contain the video
          />

          <View style={styles.contentContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.likes}>Total Likes: {item.totalLikes}</Text>
            <FlatList
              data={item.comments}
              keyExtractor={(comment, index) => index.toString()}
              renderItem={({ item: comment }) => (
                <View style={styles.commentContainer}>
                  <Text style={styles.commentName}>{comment.name}</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              )}
              style={styles.commentsList}
            />
          </View>
        </View>
      )}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}
    />
  );
};

export default Reels;

const styles = StyleSheet.create({
  container: {
    width: "100vw",
    height: "100vh", // Full height for each reel
    backgroundColor: "black",
    justifyContent: "center",
  },
  video: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  likes: {
    fontSize: 16,
    color: "lightgray",
  },
  commentContainer: {
    marginTop: 10,
  },
  commentName: {
    fontWeight: "bold",
    color: "white",
  },
  commentText: {
    color: "lightgray",
  },
  commentsList: {
    maxHeight: 200,
  },
  contentContainerStyle: {
    alignItems: "center",
  },
});
