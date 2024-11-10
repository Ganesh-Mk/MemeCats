import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Colors from "../constants/Colors";

const CatButton = ({ text, loading, fontFamily, fontSize, onPress, width }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.red,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        width: width || "100%",
      }}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator
          color={Colors.white}
          size="large"
          style={{ height: 25 }}
        />
      ) : (
        <Text
          style={[
            {
              fontFamily: fontFamily || "Regular",
              fontSize: fontSize || 20,
              textAlign: "center",
              color: Colors.white,
            },
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CatButton;
