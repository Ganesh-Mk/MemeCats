import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const SoundIcon = ({ muted }) => {
  return (
    <View>
      {muted ? (
        <Image
          source={require("../../assets/images/volume-mute.png")}
          style={styles.icon}
        />
      ) : (
        <Image
          source={require("../../assets/images/sound-on.png")}
          style={styles.icon}
        />
      )}
    </View>
  );
};

export default SoundIcon;

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
  },
});
