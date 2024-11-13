import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

const BottomOverlay = ({ profileImage, name, desc }) => {
  return (
    <View style={styles.bottomOverlay}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: profileImage || "../assets/images/memeCats/noProfileImage.png",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{name}</Text>
      </View>
      <ScrollView style={styles.descContainer} nestedScrollEnabled>
        <Text style={styles.desc}>{desc}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomOverlay: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    borderRadius: 10,
    padding: 10,
    zIndex: 1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  descContainer: {
    maxHeight: 70,
    marginTop: 5,
  },
  desc: {
    color: "white",
    fontSize: 16,
  },
});

export default BottomOverlay;
