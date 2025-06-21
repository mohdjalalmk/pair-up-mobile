import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface Props {
  name: string;
}

const FeedCard: React.FC<Props> = ({ name }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
};

export default FeedCard;

const { width } = Dimensions.get('window');
const cardSize = (width - 60) / 2; // 20 padding + 20 padding + 10 gap

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FF5A5F',
    borderRadius: 10,
    padding: 15,
    margin: 5,
    width: cardSize,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
