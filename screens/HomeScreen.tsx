//screens/HomeScreen.tsx
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Thought } from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'CategoryList'> & {
  thoughts: Thought[];
};

export default function HomeScreen({ navigation, route, thoughts }: Props) {
  const { category } = route.params;
  const filtered = thoughts.filter((t) => t.category === category);

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('Detail', { thoughtId: item.id })}>
            <Text style={styles.thoughtItem}>{item.title}</Text>
          </Pressable>
        )}
      />
      <StatusBar style="auto" />
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('AddThought', { category })}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d27',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e0e0',
    marginTop: 4
  },
  list: {
    marginTop: 20,
    width: '100%',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  thoughtItem: {
    fontSize: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    color: '#fff'
  },
  fab: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0a84ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30
  },
});

