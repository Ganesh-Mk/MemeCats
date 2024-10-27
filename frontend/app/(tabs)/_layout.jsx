import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="leaderboard" options={{ headerShown: false }} />
      <Tabs.Screen name="reels" options={{ headerShown: false }} />
      <Tabs.Screen name="account" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default TabsLayout;
