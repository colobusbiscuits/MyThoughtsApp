import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Category } from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>

const SECTIONS: {key: Category; color: string }[] = [
    { key: 'Ideas', color: '#7C9CFF'},
    { key: 'Thoughts', color: '#7ec28f'},
    { key: 'Recipes', color: '#947e49'},
    { key: 'Notes', color: '#c745b1'},
    { key: 'Questions', color: '#c7d326ee'},
];

export default function LandingScreen({ navigation }: Props) {
    return (
        <View style = {styles.container}>
            {SECTIONS.map((section) => (
                <Pressable
                key={section.key}
                style={({ pressed }) => [
                    styles.card,
                    { backgroundColor: section.color, opacity: pressed ? 0.75 : 1 },
                ]}
              
                onPress={() => navigation.navigate('CategoryList', { category: section.key})}
                >
                    <Text style={styles.cardText}>{section.key}</Text>
            </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#1a1d27'},
    card: {
        borderRadius: 12,
        paddingVertical: 28,
        alignItems: 'center',
        marginBottom: 16,
    },
    
    cardText: { color: '#fff', fontSize: 20, fontWeight: '700'},
});