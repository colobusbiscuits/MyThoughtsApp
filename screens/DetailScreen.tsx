// screens/DetailScreen.tsx
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Thought } from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'> & {
    thoughts: Thought[];
    updateDetails: (thoughtId: string, details: string) => void;
};

export default function DetailScreen({ route, thoughts, updateDetails }: Props) {
    const { thoughtId } = route.params;
    const thought = thoughts.find((t) => t.id === thoughtId);


    if (!thought) {
        return (
            <View style={styles.container}>
                <Text>Thought not found.</Text>
            </View>
        );
    }

       return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Text style={styles.title}>{thought.title}</Text>
            <TextInput
                value={thought.details}
                onChangeText={(text) => updateDetails(thought.id, text)}
                placeholder="Add more thoughts..."
                placeholderTextColor="#888"
                style={styles.detailsInput}
                multiline
                textAlignVertical="top"
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
    detailsInput: {
        flex: 1,
        fontSize: 15,
        color: '#222',
    },
});
