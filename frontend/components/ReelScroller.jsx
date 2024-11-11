import React from "react";
import { FlatList, Dimensions, View, Pressable } from "react-native";
import { Video } from "expo-av";
import BottomOverlay from "./BottomOverlay";
import RightOverlay from "./RightOverlay";
import CommentsOverlay from "./CommentsOverlay";

const { height: screenHeight } = Dimensions.get("window");

const ReelScroller = ({
  data,
  videoRefs,
  currentIndex,
  paused,
  muted,
  togglePlayPause,
  handleReelLiked,
  openCommentsModal,
  handleReelSave,
  toggleMute,
  closeCommentsModal,
}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `${item._id}-${index}`}
      renderItem={({ item, index }) => (
        <View
          style={{
            width: "100%",
            height: screenHeight,
            backgroundColor: "black",
          }}
        >
          <Pressable
            onPress={() => togglePlayPause(index)}
            style={{ width: "100%", height: "100%" }}
          >
            <Video
              ref={(ref) => {
                videoRefs.current[index] = ref;
              }}
              source={{ uri: item.reelUrl }}
              style={{ width: "100%", height: "100%" }}
              useNativeControls={false}
              resizeMode="cover"
              isLooping
              shouldPlay={index === currentIndex && !paused}
              isMuted={muted}
            />
            <BottomOverlay />
            <RightOverlay
              handleReelLiked={handleReelLiked}
              handleReelSave={handleReelSave}
              openCommentsModal={openCommentsModal}
              toggleMute={toggleMute}
              muted={muted}
              reel={item}
              index={index}
            />
            <CommentsOverlay closeCommentsModal={closeCommentsModal} />
          </Pressable>
        </View>
      )}
      snapToInterval={screenHeight}
      decelerationRate="fast"
      pagingEnabled
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ReelScroller;
