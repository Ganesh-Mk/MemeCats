import { StyleSheet, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome"; // Make sure to install react-native-vector-icons

const PlayPauseIcon = ({ paused }) => {
  return (
    <View style={styles.container}>
      {paused && (
        <View style={styles.iconContainer}>
          <Icon name="play" style={styles.icon} size={40} color="white" />
        </View>
      )}
    </View>
  );
};

export default PlayPauseIcon;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 100,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    left: 38,
  },
});
