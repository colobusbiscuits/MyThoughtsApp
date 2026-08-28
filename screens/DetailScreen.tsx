import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Category, Thought } from './types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'> & {
    thoughts: Thought[];
    categories: Category[];
    updateDetails: (thoughtId: string, details: string) => void;
    updateTitle: (thoughtId: string, title: string) => void;
    moveThought: (thoughtId: string, categoryId: string) => void;
};

export default function DetailScreen({ route, thoughts, categories, updateDetails, updateTitle, moveThought }: Props) {
    const { thoughtId } = route.params;
    const thought = thoughts.find((t) => t.id === thoughtId);

    if (!thought) {
        return (
            <View style={styles.container}>
                <Text style={styles.notFoundText}>Thought not found.</Text>
            </View>
        );
    }

    return (
       <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TextInput
                value={thought.title}
                onChangeText={(text) => updateTitle(thought.id, text)}
                style={styles.title}
                placeholder="Title"
                placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                {categories.map((category) => {
                    const selected = category.id === thought.categoryId;
                    return (
                        <Pressable
                            key={category.id}
                            onPress={() => moveThought(thought.id, category.id)}
                            style={[styles.chip, { borderColor: category.color }, selected && { backgroundColor: category.color }]}
                        >
                            <Text style={[styles.chipText, selected && { color: colors.background }]}>{category.name}</Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            <TextInput
                value={thought.details}
                onChangeText={(text) => updateDetails(thought.id, text)}
                placeholder="Add more thoughts..."
                placeholderTextColor={colors.textMuted}
                style={styles.detailsInput}
                multiline
                textAlignVertical="top"
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: colors.background },
    notFoundText: { color: colors.text },
    title: { fontSize: 20, fontWeight: '600', marginBottom: 12, color: colors.text },
    label: { color: colors.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 8 },
    chipRow: { flexGrow: 0, marginBottom: 16 },
    chip: { borderWidth: 1.5, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14, marginRight: 8 },
    chipText: { color: colors.text, fontSize: 13, fontWeight: '600' },
    detailsInput: { flex: 1, fontSize: 15, color: colors.text },
});