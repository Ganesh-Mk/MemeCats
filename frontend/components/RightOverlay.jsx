import React, { useEffect, useState } from "react";
import { View, Pressable, StyleSheet, Image, Text, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import LikeIcon from "./Icons/LikeIcon";
import SaveIcon from "./Icons/SaveIcon";
import SoundIcon from "./Icons/SoundIcon";
import { BACKEND_URL } from "../env";

const RightOverlay = ({
  handleReelLiked,
  handleReelLikeRemoved,
  handleReelSave,
  refreshCommentLength,
  toggleMute,
  openCommentsModal,
  muted,
  reel,
  index,
}) => {
  const [commentsCount, setCommentsCount] = useState(reel.comments.length);

  const fetchUpdatedCommentCount = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/getComments?reelId=${reel._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCommentsCount(data.length);
        console.log("fetched comment length: , ", data.length);
      }
    } catch (err) {
      Alert.alert("Error while fetching comments", err.message);
    }
  };
  useEffect(() => {
    fetchUpdatedCommentCount();
  }, [reel._id, refreshCommentLength]);
  return (
    <View style={styles.rightOverlay}>
      <Pressable style={styles.iconButton}>
        <LikeIcon
          reel={reel}
          handleReelLiked={handleReelLiked}
          handleReelLikeRemoved={handleReelLikeRemoved}
        />
      </Pressable>
      <Pressable
        onPress={() => openCommentsModal(reel)}
        style={styles.commentContainer}
      >
        <Image
          style={styles.commentIcon}
          source={require("../assets/images/comment.png")}
        />
        <Text style={styles.commentText}>{commentsCount}</Text>
      </Pressable>
      <Pressable style={styles.iconButton}>
        <SaveIcon reel={reel} handleReelSaved={handleReelSave} />
      </Pressable>
      <Pressable style={styles.iconButton} onPress={() => toggleMute(index)}>
        <SoundIcon muted={muted} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  rightOverlay: {
    position: "absolute",
    right: 10,
    bottom: 130,
    zIndex: 1,
    alignItems: "center",
  },
  iconButton: {
    marginVertical: 10,
  },

  commentIcon: {
    width: 40,
    height: 40,
  },
  commentText: {
    color: "white",
    fontFamilty: "Bold",
    textAlign: "center",
    marginBottom: 5,
  },
});

export default RightOverlay;
