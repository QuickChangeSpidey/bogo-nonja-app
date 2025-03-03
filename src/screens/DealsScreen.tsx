import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const DealsScreen: React.FC = () => {
  const [sponsoredImages, setSponsoredImages] = useState([]);
  const [genreImages, setGenreImages] = useState({});
  const sponsoredListRef = useRef<FlatList>(null);
  const [sponsoredIndex, setSponsoredIndex] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const genres = [
    'Fast Food',
    'Fine Dining',
    'Cafes',
    'Bakery',
    'Seafood',
    'Pizza',
    'Burgers',
    'Healthy',
    'Indian Cuisine',
    'Mexican Cuisine',
  ];

  useEffect(() => {
    const fetchUnsplashImages = async (query: string) => {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=qyHTL2TjPsakmHKrBI7Znkgw3xNG4StZ1aEkiPlKgnw&per_page=5`,
      );
      const data = await response.json();
      return data.results.map((img: any) => img.urls.small);
    };

    const fetchImages = async () => {
      // Fetch sponsored images
      const sponsored = await fetchUnsplashImages('restaurants');
      setSponsoredImages(sponsored);

      // Fetch genre images
      const fetchedGenreImages = {};
      for (const genre of genres) {
        fetchedGenreImages[genre] = await fetchUnsplashImages(genre);
      }
      setGenreImages(fetchedGenreImages);
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Auto-move sponsored ads
      if (sponsoredListRef.current) {
        const nextIndex = (sponsoredIndex + 1) % (sponsoredImages.length || 1);
        setSponsoredIndex(nextIndex);
        sponsoredListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [sponsoredIndex, sponsoredImages]);

  return (
    <View style={styles.container}>
      {/* Top Section: Sponsored Carousel */}
      <FlatList
        ref={sponsoredListRef}
        data={sponsoredImages}
        keyExtractor={(_, index) => `sponsored-${index}`}
        horizontal
        pagingEnabled
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ marginBottom: 20 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.sponsoredItem}>
            <Image source={{ uri: item }} style={styles.sponsoredImage} />
          </View>
        )}
      />
  
      {/* Bottom Section: Categorized Deals */}
      <FlatList
        data={Object.keys(genreImages)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.genreSection}>
            <Text style={styles.genreTitle}>{item}</Text>
            <FlatList
              data={genreImages[item]}
              keyExtractor={(uri, index) => `${item}-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: uri }) => (
                <View style={styles.dealItem}>
                  <Image source={{ uri: uri }} style={styles.dealImage} />
                  <Text style={styles.dealName}>{item}</Text>
                </View>
              )}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sponsoredItem: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sponsoredImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  genreSection: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  genreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dealItem: {
    marginRight: 10,
    alignItems: 'center',
  },
  dealImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  dealName: {
    marginTop: 5,
    fontSize: 14,
  },
});


export default DealsScreen;
