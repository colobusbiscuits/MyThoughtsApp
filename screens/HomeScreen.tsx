import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Category, Thought } from './types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CategoryList'> & {
    thoughts: Thought[];
    categories: Category[];
    recentlyDeleted: Thought | null;
    undoDelete: () => void;
    deleteThought: (thoughtId: string) => void;
};

export default function HomeScreen({ navigation, route, thoughts, categories, recentlyDeleted, undoDelete, deleteThought }: Props) {
    const { categoryId } = route.params;
    const category = categories.find((c) => c.id === categoryId);
    const filtered = thoughts.filter((t) => t.categoryId === categoryId);

    return (
        <View style={styles.container}>
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        No {(category?.name ?? 'thoughts').toLowerCase()} here yet. Tap + to add one.
                    </Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Pressable style={styles.rowTouchable} onPress={() => navigation.navigate('Detail', { thoughtId: item.id })}>
                            <Text style={styles.thoughtItem}>{item.title}</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [styles.deleteX, pressed && styles.deleteXPressed]}
                            onPress={() => deleteThought(item.id)}
                            hitSlop={10}
                        >
                            <Text style={styles.deleteXText}>×</Text>
                        </Pressable>
                    </View>
                )}
            />
            {recentlyDeleted && (
                <Pressable style={styles.undoBanner} onPress={undoDelete}>
                    <Text style={styles.undoBannerText}>Thought deleted — Undo</Text>
                </Pressable>
            )}
            <Pressable
                style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
                onPress={() => navigation.navigate('AddThought', { categoryId })}
            >
                <Text style={styles.fabText}>+</Text>
            </Pressable>
            <StatusBar style="light"/>

                    </View>
        );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 20 },
    list: { marginTop: 20, width: '100%' },
    listContent: { paddingHorizontal: 20, flexGrow: 1 },
    row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
    rowTouchable: { flex: 1, paddingVertical: 10 },
    thoughtItem: { fontSize: 15, color: colors.text },
    deleteX: { paddingHorizontal: 10, paddingVertical: 6 },
    deleteXPressed: { opacity: 0.5 },
    deleteXText: { color: colors.textMuted, fontSize: 20, lineHeight: 22 },
    emptyText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: 40 },
    undoBanner: { position: 'absolute', left: 20, right: 20, bottom: 110, backgroundColor: colors.surface, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
    undoBannerText: { color: colors.accentSoft, fontWeight: '600' },
    fab: { position: 'absolute', right: 20, bottom: 40, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
    fabPressed: { backgroundColor: colors.accentPressed },
    fabText: { color: colors.text, fontSize: 28, lineHeight: 30 },
});