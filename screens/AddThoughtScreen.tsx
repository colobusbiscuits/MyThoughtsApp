import {useState} from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Thought, Category } from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddThought'> & {
    addThought: (title: string, category: Category) => void;
};

export default function AddThoughtScreen({ navigation, route, addThought }: Props) {
    const { category } = route.params;
    const [text, setText] = useState('');

    const save = () => {
        if (!text.trim()) return;
        addThought(text.trim(), category);
        navigation.goBack();
    };

    return (
        <View style = {styles.container}>
            <TextInput
            value={text}
            onChangeText={setText}
            placeholder={`New ${category.toLowerCase()}...`}
            placeholderTextColor = "#888"
            style={styles.input}
            multiline
            autoFocus
            />
            <Pressable style={styles.saveButton} onPress={save}>
                <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
        </View>
    );
}
    const styles = StyleSheet.create({
        container: { flex: 1, padding: 20 , backgroundColor: '#1a1d27'},
        input: {
            minHeight: 120,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            textAlignVertical: 'top',
            color: '#fff'
        },
        saveButton: {
            marginTop: 16,
            backgroundColor: '#0a84ff',
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
        },
        saveButtonText: { color: 'white', fontWeight: '600', fontSize: 16},
    });