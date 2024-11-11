import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import LikeIcon from "./Icons/LikeIcon";

const RightOverlay = ({
  handleReelLiked,
  handleReelLikeRemoved,
  handleReelSave,
  openCommentsModal,
  toggleMute,
  muted,
  reel,
  index,
}) => {
  return (
    <View style={styles.rightOverlay}>
      <Pressable style={styles.iconButton}>
        <LikeIcon
          reel={reel}
          handleReelLiked={handleReelLiked}
          handleReelLikeRemoved={handleReelLikeRemoved}
        />
      </Pressable>
      <Pressable style={styles.iconButton}>
        <Icon
          name="comment"
          onPress={() => openCommentsModal(reel)}
          size={30}
          color="white"
        />
      </Pressable>
      <Pressable style={styles.iconButton}>
        <Icon
          name="save"
          onPress={() => handleReelSave(reel._id)}
          size={30}
          color="white"
        />
      </Pressable>
      <Pressable style={styles.iconButton} onPress={() => toggleMute(index)}>
        <Icon
          name={muted ? "volume-off" : "volume-up"}
          size={30}
          color="white"
        />
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
});

export default RightOverlay;
