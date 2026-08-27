import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Category } from './types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ManageCategories'> & {
    categories: Category[];
};

export default function ManageCategoriesScreen({ navigation, categories }: Props) {
    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.row}
                        onPress={() => navigation.navigate('EditCategory', { categoryId: item.id })}
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
    listContent: { paddingBottom: 12 },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
    dot: { width: 14, height: 14, borderRadius: 7, marginRight: 12 },
    rowText: { color: colors.text, fontSize: 16 },
    addButton: { marginTop: 16, backgroundColor: colors.accent, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    addButtonPressed: { backgroundColor: colors.accentPressed },
    addButtonText: { color: colors.text, fontWeight: '600', fontSize: 16 },
});