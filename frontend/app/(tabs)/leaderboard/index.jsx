import React, { useEffect, useRef, useState } from "react";
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
import CatButton from "../../../components/CatButton";

const Leaderboard = () => {
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hasMoreData, setHasMoreData] = useState(true); // To track if there is more data to load
  const [buttonLoading, setButtonLoading] = useState(false); // To track the loader for the button
  const [rankFinished, setRankFinished] = useState(false);
  const page = useRef(1); // Using a ref to store the page number
  // Fetch ranking data
  const fetchRanking = async () => {
    setLoading(true);
    try {
      const start = (page.current - 1) * 10 + 1; // Calculate start index for the current page
      const end = start + 9; // Calculate end index (top 10 for current page)

      const response = await fetch(
        `${BACKEND_URL}/getRanking?start=${start}&end=${end}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();

        // If no data is returned, stop fetching more data
        if (data.length === 0) {
          setHasMoreData(false);
        } else {
          // Append new data to the existing ranking data
          setRankingData((prevData) => [...prevData, ...data]);
        }
      } else {
        setRankFinished(true);
      }
    } catch (error) {
      console.log("Error fetching ranking data/Finished", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasMoreData) {
      fetchRanking();
    }
  }, [hasMoreData]); // Triggering fetch only when data is available to fetch

  const loadMore = () => {
    if (!loading && hasMoreData) {
      page.current += 1; // Increment the page number
      fetchRanking(); // Fetch next set of data
    }
  };

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
        keyExtractor={(item, i) => `item.reelId-${item.reelId} index-${i}`}
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
        ListFooterComponent={
          rankFinished ? (
            <CatButton
              onPress={loadMore}
              text="No more Cat of the day"
              fontFamily={"Bold"}
              loading={buttonLoading} // Show loader for the button
            />
          ) : (
            <CatButton
              onPress={loadMore}
              text="Load More"
              fontFamily={"Bold"}
              loading={buttonLoading} // Show loader for the button
            />
          )
        }
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
    padding: 10,
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
    gap: 30,
    marginLeft: 0,
    marginLeft: 10,
  },
  email: {
    fontSize: 15,
    fontFamily: "Regular",
    color: Colors.darkGrey,
  },
  likes: {
    fontSize: 18,
    fontFamily: "Regular",
    color: Colors.darkPink,
    width: 25,
    textAlign: "center",
  },
});

export default Leaderboard;
