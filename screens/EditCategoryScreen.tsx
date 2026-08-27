import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Category } from './types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EditCategory'> & {
    categories: Category[];
    addCategory: (name: string, color: string) => void;
    updateCategory: (categoryId: string, name: string, color: string) => void;
};

const SWATCHES = ['#7C9CFF', '#7ec28f', '#947e49', '#c745b1', '#c7d326ee', '#E0637A', '#3E8FB0', '#D4A63D'];

export default function EditCategoryScreen({ navigation, route, categories, addCategory, updateCategory }: Props) {
    const { categoryId } = route.params;
    const existing = categoryId ? categories.find((c) => c.id === categoryId) : undefined;

    const [name, setName] = useState(existing?.name ?? '');
    const [color, setColor] = useState(existing?.color ?? SWATCHES[0]);
    const canSave = name.trim().length > 0;

    const save = () => {
        if (!canSave) return;
        if (existing) {
            updateCategory(existing.id, name.trim(), color);
        } else {
            addCategory(name.trim(), color);
        }
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Category name"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                autoFocus
            />

            <Text style={styles.label}>Color</Text>
            <View style={styles.swatchRow}>
                {SWATCHES.map((swatch) => (
                    <Pressable
                        key={swatch}
                        onPress={() => setColor(swatch)}
                        style={[styles.swatch, { backgroundColor: swatch }, color === swatch && styles.swatchSelected]}
                    />
                ))}
            </View>

            <Pressable
                style={({ pressed }) => [
                    styles.saveButton,
                    !canSave && styles.saveButtonDisabled,
                    pressed && canSave && styles.saveButtonPressed,
                ]}
                onPress={save}
                disabled={!canSave}
            >
                <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
                    {existing ? 'Save Changes' : 'Add Category'}
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20 },
    input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 16, color: colors.text },
    label: { color: colors.textMuted, fontSize: 13, fontWeight: '600', marginTop: 20, marginBottom: 10 },
    swatchRow: { flexDirection: 'row', flexWrap: 'wrap' },
    swatch: { width: 40, height: 40, borderRadius: 20, marginRight: 12, marginBottom: 12, borderWidth: 3, borderColor: 'transparent' },
    swatchSelected: { borderColor: colors.text },
    saveButton: { marginTop: 20, backgroundColor: colors.accent, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    saveButtonDisabled: { backgroundColor: colors.surface },
    saveButtonPressed: { backgroundColor: colors.accentPressed },
    saveButtonText: { color: colors.text, fontWeight: '600', fontSize: 16 },
    saveButtonTextDisabled: { color: colors.textMuted },
});