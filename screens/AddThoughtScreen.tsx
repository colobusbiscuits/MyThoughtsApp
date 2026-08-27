import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Category } from './types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddThought'> & {
    addThought: (title: string, categoryId: string) => void;
    categories: Category[];
};

export default function AddThoughtScreen({ navigation, route, addThought, categories }: Props) {
    const { categoryId } = route.params;
    const category = categories.find((c) => c.id === categoryId);
    const [text, setText] = useState('');
    const canSave = text.trim().length > 0;

    const save = () => {
        if (!canSave) return;
        addThought(text.trim(), categoryId);
        navigation.goBack();
    };

    const label = category ? category.name.slice(0, -1).toLowerCase() : 'thought';

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <TextInput
                value={text}
                onChangeText={setText}
                placeholder={`New ${label}...`}
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                multiline
                autoFocus
            />
            <Pressable
                style={({ pressed }) => [
                    styles.saveButton,
                    !canSave && styles.saveButtonDisabled,
                    pressed && canSave && styles.saveButtonPressed,
                ]}
                onPress={save}
                disabled={!canSave}
            >
                <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>Save</Text>
            </Pressable>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: colors.background },
    input: { minHeight: 120, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 16, color: colors.text, textAlignVertical: 'top' },
    saveButton: { marginTop: 16, backgroundColor: colors.accent, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    saveButtonDisabled: { backgroundColor: colors.surface },
    saveButtonPressed: { backgroundColor: colors.accentPressed },
    saveButtonText: { color: colors.text, fontWeight: '600', fontSize: 16 },
    saveButtonTextDisabled: { color: colors.textMuted },
});