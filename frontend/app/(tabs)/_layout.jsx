import { Tabs } from "expo-router";
import { setRefreshTogglePlayPause } from "../../store/reel";
import { useDispatch } from "react-redux";
import { Image } from "react-native";
import Colors from "../../constants/Colors";

const TabsLayout = () => {
  const dispatch = useDispatch();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.white, // Set background to transparent
          paddingVertical: 5, // Add vertical padding
          borderTopLeftRadius: 10, // Top-left border radius
          borderTopRightRadius: 10, // Top-right border radius
        },
      }}
    >
      {/* Ranking Tab */}
      <Tabs.Screen
        name="leaderboard"
        options={{
          headerShown: false,
          tabBarLabel: "Ranking",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/images/rankingFocused.png")
                  : require("../../assets/images/rankingNotFocused.png")
              }
              style={{ width: 24, height: 24 }}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 13,
            fontFamily: "Bold",
          },
        }}
        listeners={() => ({
          focus: () => {
            dispatch(setRefreshTogglePlayPause(false));
          },
        })}
      />

      {/* Reels Tab */}
      <Tabs.Screen
        name="reels"
        options={{
          headerShown: false,
          tabBarLabel: "Reels",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/images/reelsFocused.png")
                  : require("../../assets/images/reelsNotFocused.png")
              }
              style={{ width: 24, height: 24 }}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 13,
            fontFamily: "Bold",
          },
        }}
        listeners={() => ({
          focus: () => {
            dispatch(setRefreshTogglePlayPause(true));
          },
        })}
      />

      {/* Account Tab */}
      <Tabs.Screen
        name="account"
        options={{
          headerShown: false,
          tabBarLabel: "Account",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/images/accountFocused.png")
                  : require("../../assets/images/accountNotFocused.png")
              }
              style={{ width: 24, height: 24 }}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 13,
            fontFamily: "Bold",
          },
        }}
        listeners={() => ({
          focus: () => {
            dispatch(setRefreshTogglePlayPause(false));
          },
        })}
      />
    </Tabs>
  );
};

export default TabsLayout;
