import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Card = ({ title, baseimage, description }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay for demonstration purposes
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(delay);
  }, []);

  return (
    <View style={styles.card}>
      <ShimmerPlaceholder style={styles.image} autoRun={true} visible={!loading}>
        <Image
          source={{ uri: `data:image/png;base64,${baseimage}` }}
          style={styles.image}
          // onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
        />
      </ShimmerPlaceholder>

      <View style={styles.cardContent}>
        <ShimmerPlaceholder style={styles.cardLImage} visible={!loading}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </ShimmerPlaceholder>
      </View>
    </View>
  );
};

const Post = () => {
  const [apiData, setApiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.43.112:8001/kle/api/teacher/posts/read');
      setApiData(response.data);

      // Introduce a delay before setting loading to false (adjust the delay as needed)
      setTimeout(() => {
        setLoading(false);
        setLoadingError(null);
      }, 2000); // 2000 milliseconds (2 seconds) delay as an example
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setLoading(false);
      setLoadingError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = apiData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = useCallback(({ item }) => <Card {...item} />, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#333" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      {loading ? (
        <FlatList
          data={[1, 2, 3]} // Use a temporary array to render a few shimmering cards
          keyExtractor={(item, index) => index.toString()}
          renderItem={() => <Card title="" baseimage="" description="" />}
          contentContainerStyle={styles.flatListContainer}
        />
      ) : loadingError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{loadingError}</Text>
          <TouchableOpacity onPress={fetchData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredData.reverse()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  flatListContainer: {
    flexGrow: 1,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  cardLImage: {
    borderColor: '#ccc',
    borderRadius: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default Post;
