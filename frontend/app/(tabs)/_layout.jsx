import { Tabs } from "expo-router";
import { setRefreshTogglePlayPause } from "../../store/reel";
import { useDispatch } from "react-redux";

const TabsLayout = () => {
  const dispatch = useDispatch();
  return (
    <Tabs>
      <Tabs.Screen
        name="leaderboard"
        options={{ headerShown: false }}
        listeners={() => ({
          focus: () => {
            console.log("focus leaderboard");
            dispatch(setRefreshTogglePlayPause(false));
          },
        })}
      />
      <Tabs.Screen
        name="reels"
        options={{ headerShown: false }}
        listeners={() => ({
          focus: () => {
            console.log("focus reels");
            dispatch(setRefreshTogglePlayPause(true));
          },
        })}
      />
      <Tabs.Screen
        name="account"
        options={{ headerShown: false }}
        listeners={() => ({
          focus: () => {
            console.log("focus account");
            dispatch(setRefreshTogglePlayPause(false));
          },
        })}
      />
    </Tabs>
  );
};

export default TabsLayout;
