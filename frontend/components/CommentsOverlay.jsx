import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const CommentsOverlay = ({ closeCommentsModal }) => {
  return (
    // <View style={styles.commentOverlay}>
    //   <TouchableOpacity
    //     onPress={closeCommentsModal}
    //     style={styles.closeIconContainer}
    //   >
    //     <Text style={styles.commentCloseIcon}>X</Text>
    //   </TouchableOpacity>
    //   <View style={styles.commentSection}>
    //     <Text>Comments of the video...</Text>
    //   </View>
    // </View>
    <View></View>
  );
};

const styles = StyleSheet.create({
  commentOverlay: {
    position: "absolute",
    bottom: 20,
  },
  closeIconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  commentCloseIcon: {
    fontSize: 30,
    color: "white",
    backgroundColor: "black",
    padding: 20,
    borderRadius: 100,
    textAlign: "center",
  },
  commentSection: {
    height: 500,
    width: "100%",
    backgroundColor: "grey",
  },
});

export default CommentsOverlay;
