import { useEffect, useMemo, useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Category, Thought } from './types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'> & {
    categories: Category[];
    thoughts: Thought[];
    reorderCategories: (newOrder: Category[]) => void;
};



export default function LandingScreen({ navigation, categories, thoughts, reorderCategories }: Props) {
    const countFor = (categoryId: string) => thoughts.filter((t) => t.categoryId === categoryId).length;

    const [order, setOrder] = useState(categories);

    useEffect(() => {
        setOrder((current) => {
            const incomingIds = new Set(categories.map((c) => c.id));
            const sameMembership = 
                current.length === categories.length && current.every((c) => incomingIds.has(c.id));
            if (sameMembership) {
                const byId = new Map(categories.map((c) => [c.id, c]));
                return current.map((c) => byId.get(c.id) ?? c);
            } 

            return categories
        });
    },[categories]);

    const { featured, rest } = useMemo(() => {
        let top: Category | null = null;
        let topCount = 0;
        for (const category of order) {
            const count = thoughts.filter((t) => t.categoryId === category.id).length;
            if (count > topCount) {
                top = category;
                topCount = count;
            }
        }
        return {
            featured: top,
            rest: top ? order.filter((c) => c.id !== top!.id) : order,
        };
    }, [order, thoughts]);

    const goToCategory = (categoryId: string) => navigation.navigate('CategoryList', { categoryId });

    const renderRow = ({ item, drag, isActive }: RenderItemParams<Category>) => (
        <ScaleDecorator activeScale={1.03}>
        <Pressable
        onPress={() => goToCategory(item.id)}
        onLongPress={drag}
        disabled={isActive}
        style={[styles.row, isActive && styles.rowLifted]}
        >
            {({ pressed }) => (
            <View style={[styles.rowInner, pressed && !isActive && styles.tilePressed]}>
                <CategoryTileContent category={item} count={countFor(item.id)} variant="row" />
                </View>
                )}
        </Pressable>
        </ScaleDecorator>
    );


    return (
        <View style={styles.container}>
            {featured && (
                <Pressable
                onPress={() => goToCategory(featured.id)}
                style={({ pressed }) => [styles.featuredTile, pressed && styles.tilePressed]}
                >
                    <CategoryTileContent category={featured} count={countFor(featured.id)} variant="featured" />
                </Pressable>
            )}

            <DraggableFlatList 
                key={rest.map((c) => c.id).join('-')}
                data={rest}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={renderRow}
                animationConfig={{ damping: 30, stiffness: 300 }}
                onDragEnd={({ data }) =>{
                 const newOrder = featured ? [featured, ...data] : data;
                 setOrder(newOrder);
                 reorderCategories(newOrder);
                }}
                ListEmptyComponent={
                    categories.length === 0 ? (
                    <Text style={styles.emptyText}>No categories yet - add one from the Categories screen.</Text>
                ) : null 
            }
            />
        </View>
    );
}

function CategoryTileContent({ 
    category, 
    count, 
    variant,
 }: { 
    category: Category; 
    count: number; 
    variant: 'featured' | 'row' 
}) {
    const text = (
        <>
            <Text style={[styles.tileText, variant === 'featured' && styles.tileTextLarge]}>{category.name}</Text>
            <Text style={styles.tileCount}>{count}</Text>
        </>
    );
    const fillStyle = variant === 'featured' ? styles.tileFillFeatured : styles.tileFillRow;

        if (category.image) {
        return (
            <ImageBackground source={{ uri: category.image }} style={fillStyle} imageStyle={styles.tileImage}>
                <View style={styles.scrim} />
                {text}
            </ImageBackground>
        );
    }

    return <View style={[fillStyle, { backgroundColor: category.color }]}>{text}</View>;
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingTop: 20 },
    featuredTile: {
        marginHorizontal: 20,
        marginBottom: 16,
        height: 150,
        borderRadius: 16,
        overflow: 'hidden',
        borderBottomWidth: 6,
        borderLeftWidth: 6,
        borderColor: '#ffffff93',
    },
    listContent: { paddingHorizontal: 20, paddingBottom: 20, },
    row: { marginBottom: 12, borderRadius: 13},
    rowInner: {
        borderRadius: 10,
        overflow: 'hidden',
        borderBottomWidth: 5,
        borderLeftWidth: 5,
        borderColor: '#ffffff93',
    },
    rowLifted: {
        shadowColor: '#ffffff',
        shadowOffset: { width: 3, height: 8 },
        shadowRadius: 12,
        elevation: 11,
    },
    tilePressed: { borderBottomWidth: 0, borderLeftWidth: 0 },
    tileFillFeatured: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    tileFillRow: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
    tileImage: { resizeMode: 'cover' },
    scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
    tileText: { color: colors.text, fontSize: 15, fontWeight: '700', textAlign: 'center', paddingHorizontal: 6 },
    tileTextLarge: { fontSize: 22 },
    tileCount: { color: '#ffffffcc', fontSize: 13, marginTop: 4, fontWeight: '600' },
    emptyText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: 40, paddingHorizontal: 20 },
});