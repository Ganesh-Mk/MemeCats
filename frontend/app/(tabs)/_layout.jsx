import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs initialRouteName="index">
      <Tabs.Screen name="leaderboard" />
      <Tabs.Screen name="index" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
};

export default TabsLayout;
