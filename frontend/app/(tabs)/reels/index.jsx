import { FlatList, StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useEffect, useState, useRef } from "react"; // Import useRef from React
import { Video } from "expo-av";

const Reels = () => {
  const [data, setData] = useState([]);
  const videoRefs = useRef([]); // Create a ref array to store multiple video refs

  async function getData() {
    const response = await fetch("http://localhost:3000/getReels");
    const data = await response.json();
    setData(data);
  }

  useEffect(() => {
    getData();
  }, []); // Added dependency array to run only once

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.container}>
          <Video
            source={{ uri: item.reelVideoUrl }}
            style={styles.video}
            // resizeMode="contain" // Ensure video maintains its aspect ratio
            useNativeControls
            shouldPlay // This prop ensures the video plays automatically
            isLooping // This prop ensures the video loops indefinitely
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded && !status.isPlaying) {
                // Play video if loaded but not playing
                videoRefs.current[index]?.playAsync(); // Use the ref from videoRefs
              }
            }}
            ref={(ref) => {
              videoRefs.current[index] = ref; // Store the ref for each video
            }}
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
              // Added a max height to limit comment section size
              style={styles.commentsList}
            />
          </View>
        </View>
      )}
      pagingEnabled // Enables snap to screen height
      showsVerticalScrollIndicator={false} // Hides scroll indicator
      contentContainerStyle={styles.contentContainerStyle} // Center content
    />
  );
};

export default Reels;

const styles = StyleSheet.create({
  container: {
    width: "100vw",
    height: "94vh", // Full height for each reel
    backgroundColor: "black", // Set black background for the full screen
    justifyContent: "center", // Center content vertically
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundClip: "contain",
  },
  contentContainer: {
    position: "absolute", // Position content on top of the video
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background for readability
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white", // Change text color to white for contrast
  },
  likes: {
    fontSize: 16,
    color: "lightgray", // Light gray for likes text
  },
  commentContainer: {
    marginTop: 10,
  },
  commentName: {
    fontWeight: "bold",
    color: "white", // Change comment name color to white
  },
  commentText: {
    color: "lightgray", // Light gray for comment text
  },
  commentsList: {
    maxHeight: 200, // Limit the height of comments
  },
  contentContainerStyle: {
    alignItems: "center", // Center items within FlatList
  },
});
