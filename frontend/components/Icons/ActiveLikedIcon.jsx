import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import Svg, { Path } from "react-native-svg";
import Colors from "../../constants/Colors";

const ActiveLikedIcon = ({ visible, liked, handlePress, currentLikes }) => {
  const [scale] = useState(new Animated.Value(0.7));
  const [color, setColor] = useState("transparent");
  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 2, // Enlarge the icon
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1.8, // Shrink to medium size
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1.5, // Return to original size
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();

      setColor(Colors.red);

      setTimeout(() => {
        setColor("transparent");
      }, 1000);
    }
  }, [visible, scale]);

  return (
    visible && (
      <View style={styles.container}>
        <Animated.View
          style={[styles.iconContainer, { transform: [{ scale }] }]}
        >
          <TouchableOpacity onPress={handlePress}>
            <Svg
              height={30}
              width={45}
              viewBox="0 0 512 512"
              xmlSpace="preserve"
            >
              <Path
                d="M474.655,74.503C449.169,45.72,413.943,29.87,375.467,29.87c-30.225,0-58.5,12.299-81.767,35.566 c-15.522,15.523-28.33,35.26-37.699,57.931c-9.371-22.671-22.177-42.407-37.699-57.931c-23.267-23.267-51.542-35.566-81.767-35.566 c-38.477,0-73.702,15.851-99.188,44.634C13.612,101.305,0,137.911,0,174.936c0,44.458,13.452,88.335,39.981,130.418 c21.009,33.324,50.227,65.585,86.845,95.889c62.046,51.348,123.114,78.995,125.683,80.146c2.203,0.988,4.779,0.988,6.981,0 c2.57-1.151,63.637-28.798,125.683-80.146c36.618-30.304,65.836-62.565,86.845-95.889C498.548,263.271,512,219.394,512,174.936 C512,137.911,498.388,101.305,474.655,74.503z"
                fill={liked ? Colors.red : color}
                stroke={liked ? Colors.red : color}
                strokeWidth="50"
              />
            </Svg>
            <Text style={styles.likeCount}>{currentLikes}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  );
};

export default ActiveLikedIcon;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    borderRadius: 50,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  likeCount: {
    position: "absolute",
    bottom: -10,
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});
