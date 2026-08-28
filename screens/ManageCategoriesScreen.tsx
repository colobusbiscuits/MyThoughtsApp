import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Category, Thought} from './types';
import { colors } from '../theme';
import { singularize } from './utils';

type Props = NativeStackScreenProps<RootStackParamList, 'ManageCategories'> & {
    categories: Category[];
    thoughts: Thought[];
    deleteCategory: (categoryId: string) => void;
};

export default function ManageCategoriesScreen({ navigation, categories, thoughts,deleteCategory }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.hint}>Tap a category to edit it, or long-press to delete it.</Text>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <Pressable
                            style={({ pressed }) => [styles.row, pressed && { backgroundColor: `${item.color}26` }]}
                            onPress={() => navigation.navigate('EditCategory', { categoryId: item.id })}
                            onLongPress={() => {
                                const count = thoughts.filter((t) => t.categoryId === item.id).length;
                                const plural = item.name.toLowerCase();
                                const noun = count === 1 ? singularize(plural) : plural;
                                const message = count > 0
                                ? `Delete "${item.name}" and all of its contents? This can't be undone.`
                                : `Delete "${item.name}"? This can't be undone`;
                                Alert.alert('Delete category', message,
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(item.id) },
                                    ]
                                );
                            }}
                            delayLongPress={400}
                        >
                        <View style={[styles.dot, { backgroundColor: item.color }]} />
                        <Text style={styles.rowText}>{item.name}</Text>
                    </Pressable>
                )}
            />
            <Pressable
                style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
                onPress={() => navigation.navigate('EditCategory', {})}
            >
                <Text style={styles.addButtonText}>+ Add Category</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: colors.background },
    hint: { color: colors.textMuted, fontSize:12, marginBottom: 12},
    listContent: { paddingBottom: 12 },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
    dot: { width: 14, height: 14, borderRadius: 7, marginRight: 12 },
    rowText: { color: colors.text, fontSize: 16 },
    addButton: { marginTop: 16, backgroundColor: colors.accent, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    addButtonPressed: { backgroundColor: colors.accentPressed },
    addButtonText: { color: colors.text, fontWeight: '600', fontSize: 16 },
});