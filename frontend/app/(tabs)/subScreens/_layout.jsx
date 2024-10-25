import { Stack } from "expo-router";

const SubScreensLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="createPost" />
      <Stack.Screen name="editPost" />
      <Stack.Screen name="editProfile" />
    </Stack>
  );
};

export default SubScreensLayout;
