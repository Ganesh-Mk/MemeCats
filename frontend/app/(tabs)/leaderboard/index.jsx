// Leaderboard.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { BACKEND_URL } from "../../../env";
import VideoModal from "../../../components/VideoModel";
import Colors from "../../../constants/Colors";

const Leaderboard = () => {
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetching ranking data from backend API
  const fetchRanking = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/getRanking`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRankingData(data);
      } else {
        console.error("Failed to fetch ranking data:", response.statusText);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching ranking data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRanking();
  }, []);

  // Handle opening the modal with selected user
  const openModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.darkPink} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/memeCats/catWithGoggle.png")}
        style={styles.image}
      />
      <Text style={styles.headerText}>Meme Cats of the Day</Text>

      <View style={styles.rankingList}>
        <Text style={styles.rankHeader}>Rank</Text>
        <Text style={styles.rankHeader}>Profile</Text>
        <Text style={[styles.rankHeader, styles.daily]}>Daily Likes</Text>
        <Text style={styles.rankHeader}>Total</Text>
      </View>
      <FlatList
        data={rankingData}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={() => fetchRanking()}
        keyExtractor={(item) => item.reelId}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.rankItem}>
              {index + 1 === 1 ? (
                <Image
                  source={require("../../../assets/images/firstRank.png")}
                  style={styles.rankImage}
                />
              ) : index + 1 === 2 ? (
                <Image
                  source={require("../../../assets/images/secondRank.png")}
                  style={styles.rankImage}
                />
              ) : index + 1 === 3 ? (
                <Image
                  source={require("../../../assets/images/thirdRank.png")}
                  style={styles.rankImage}
                />
              ) : (
                <Text style={styles.rank}>{index + 1}</Text>
              )}

              <Image
                source={{ uri: item.profileImage }}
                style={styles.profileImage}
              />
              <View style={styles.rankDetails}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>
              <View style={styles.likeContainer}>
                <Text style={styles.likes}>{item.dailyLikes}</Text>
                <Text style={styles.likes}>{item.totalLikes}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {selectedUser && (
        <VideoModal
          visible={modalVisible}
          onClose={closeModal}
          videoUrl={selectedUser.reelUrl}
          profileImage={selectedUser.profileImage}
          name={selectedUser.name}
          dailyLikes={selectedUser.dailyLikes}
          totalLikes={selectedUser.totalLikes}
          description={selectedUser.reelDesc}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightPink,
  },
  image: {
    height: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 30,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.lightPink,
    padding: 20,
  },
  headerText: {
    fontSize: 30,
    fontFamily: "Bold",
    color: Colors.darkText,
    textAlign: "center",
    marginBottom: 20,
  },
  rankingList: {
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  rankHeader: {
    fontSize: 16,
    fontWeight: "Regular",
    color: Colors.darkGrey,
    marginBottom: 10,
  },
  daily: {
    marginLeft: 80,
  },

  rankItem: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    paddingLeft: 5,
    paddingRight: 20,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
  },
  rank: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.darkPink,
    marginRight: 15,
    marginLeft: 10,
  },
  rankImage: {
    height: 30,
    width: 30,
    marginRight: 6,
    resizeMode: "contain",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  rankDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.darkText,
  },

  likeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 50,
    marginLeft: 15,
  },
  email: {
    fontSize: 15,
    fontFamily: "Regular",
    color: Colors.darkGrey,
  },
  likes: {
    fontSize: 18,
    fontFamily: "Regular",
    textAlign: "center",
    color: Colors.darkPink,
  },
});

export default Leaderboard;
