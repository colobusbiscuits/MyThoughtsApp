import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Category, Thought } from './types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'> & {
    categories: Category[];
    thoughts: Thought[];
};

export default function LandingScreen({ navigation, categories, thoughts }: Props) {
    return (
        <View style={styles.container}>
            {categories.map((category) => {
                const count = thoughts.filter((t) => t.categoryId === category.id).length;
                return (
                    <Pressable
                        key={category.id}
                        style={({ pressed }) => [
                            styles.card,
                            { backgroundColor: category.color, opacity: pressed ? 0.85 : 1 },
                            pressed && styles.cardPressed,
                        ]}
                        onPress={() => navigation.navigate('CategoryList', { categoryId: category.id })}
                    >
                        <Text style={styles.cardText}>{category.name}</Text>
                        <Text style={styles.cardCount}>{count}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: colors.background },
    card: {
        borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginBottom: 15,
        borderBottomWidth: 6, borderLeftWidth: 6, borderColor: '#ffffff93',
    },
    cardPressed: { borderBottomWidth: 0, borderLeftWidth: 0 },
    cardText: { color: colors.text, fontSize: 20, fontWeight: '700' },
    cardCount: { color: '#ffffffcc', fontSize: 14, marginTop: 4, fontWeight: '600' },
});