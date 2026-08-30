import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@/constants/routes';
import { strings } from '@/constants/strings';

export const GamesScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.headers.games}</Text>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate(ROUTES.unityGame as any, { gameId: 'simpleMobile' })}
      >
        <Text style={styles.cardTitle}>Simple Mobile Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 24 },
  card: { padding: 20, backgroundColor: '#fff', borderRadius: 12, elevation: 4 },
  cardTitle: { fontSize: 18, fontWeight: '500' },
});
