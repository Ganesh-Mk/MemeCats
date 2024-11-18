import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { BACKEND_URL } from "../env";
import { useSelector } from "react-redux";

const CommentModels = ({ isVisible, reelId, closeCommentsModal }) => {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const user = useSelector((state) => state.user);

  const handleComment = async () => {
    console.log("Commenting...", input, reelId);
    try {
      const response = await fetch(`${BACKEND_URL}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reelId: reelId,
          comment: input,
          name: user.name,
          profileImage: user.profileImage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("After comment: ", data);
        setComments(data);
        setInput("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("reelId", reelId);
    const fetchComments = async () => {
      console.log("Fetching comments....");
      try {
        const response = await fetch(
          `${BACKEND_URL}/getComments?reelId=${reelId}`
        );
        if (response.ok) {
          const data = await response.json();
          setComments(data);
          console.log("got commments, ", data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchComments();
  }, [reelId]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeCommentsModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.commentsSection}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentHeaderText}>Comments</Text>
            <TouchableOpacity onPress={closeCommentsModal}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Image
                  style={styles.commentUserImage}
                  source={require("../assets/images/memeCats/noProfileImage.png")}
                />
                <View style={styles.commentContent}>
                  <Text style={styles.commentUser}>{item.name}</Text>
                  <Text style={styles.commentText}>{item.comment}</Text>
                </View>
              </View>
            )}
            keyExtractor={(comment, index) => `comment-${index}`}
            showsVerticalScrollIndicator={true}
            style={styles.commentsList}
            contentContainerStyle={styles.commentsContainer}
          />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Write comment..."
              placeholderTextColor="#aaa"
              onChangeText={setInput}
              value={input}
              style={styles.input}
            />
            <TouchableOpacity onPress={handleComment}>
              <Image
                source={require("../assets/images/send.png")}
                style={styles.sendIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CommentModels;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  commentsSection: {
    width: Dimensions.get("window").width - 30,
    height: 500,
    backgroundColor: Colors.darkTransparent,
    borderRadius: 20,
    overflow: "hidden",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 10,
    color: "white",
    fontSize: 16,
  },
  sendIcon: {
    width: 45,
    height: 45,
    marginLeft: 10,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  commentUserImage: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentHeaderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    color: "white",
    fontSize: 20,
    padding: 5,
  },
  commentsList: {
    flex: 1,
  },
  commentsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    gap: 20,
    paddingTop: 20,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  commentUser: {
    color: Colors.lightGrey,
    fontFamily: "Regular",
    marginBottom: 2,
    fontSize: 14,
  },
  commentText: {
    color: "white",
    fontSize: 17,
    fontFamily: "Regular",
  },
});
