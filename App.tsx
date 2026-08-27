// App.tsx
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './screens/LandingScreen';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import AddThoughtScreen from './screens/AddThoughtScreen';
import ManageCategoriesScreen from './screens/ManageCategoriesScreen';
import EditCategoryScreen from './screens/EditCategoryScreen';
import { colors } from './theme';
import type { RootStackParamList, Thought, Category } from './screens/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const THOUGHTS_KEY = 'thoughts';
const CATEGORIES_KEY = 'categories';

export default function App() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'ideas', name: 'Ideas', color: '#7C9CFF' },
    { id: 'thoughts', name: 'Thoughts', color: '#7ec28f' },
    { id: 'recipes', name: 'Recipes', color: '#947e49' },
    { id: 'notes', name: 'Notes', color: '#c745b1' },
    { id: 'questions', name: 'Questions', color: '#c7d326ee' },
  ]);
  const [loaded, setLoaded] = useState(false);
  const [recentlyDeleted, setRecentlyDeleted] = useState<Thought | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(THOUGHTS_KEY),
      AsyncStorage.getItem(CATEGORIES_KEY),
    ]).then(([thoughtsJson, categoriesJson]) => {
      if (thoughtsJson) setThoughts(JSON.parse(thoughtsJson));
      if (categoriesJson) setCategories(JSON.parse(categoriesJson));
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(THOUGHTS_KEY, JSON.stringify(thoughts));
  }, [thoughts, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories, loaded]);

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const addThought = (title: string, categoryId: string) => {
    setThoughts((current) => [
      ...current,
      { id: Date.now().toString(), title, details: '', categoryId },
    ]);
  };

  const updateDetails = (thoughtId: string, details: string) => {
    setThoughts((current) =>
      current.map((t) => (t.id === thoughtId ? { ...t, details } : t))
    );
  };

  const updateTitle = (thoughtId: string, title: string) => {
    setThoughts((current) =>
      current.map((t) => (t.id === thoughtId ? { ...t, title } : t))
    );
  };

  const moveThought = (thoughtId: string, categoryId: string) => {
    setThoughts((current) =>
      current.map((t) => (t.id === thoughtId ? { ...t, categoryId } : t))
    );
  };

  const deleteThought = (thoughtId: string) => {
    const toDelete = thoughts.find((t) => t.id === thoughtId);
    setThoughts((current) => current.filter((t) => t.id !== thoughtId));
    if (toDelete) {
      setRecentlyDeleted(toDelete);
      if (undoTimer.current) clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(() => setRecentlyDeleted(null), 5000);
    }
  };

  const undoDelete = () => {
    if (!recentlyDeleted) return;
    setThoughts((current) => [...current, recentlyDeleted]);
    setRecentlyDeleted(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  };

  const addCategory = (name: string, color: string) => {
    setCategories((current) => [...current, { id: Date.now().toString(), name, color }]);
  };

  const updateCategory = (categoryId: string, name: string, color: string) => {
    setCategories((current) =>
      current.map((c) => (c.id === categoryId ? { ...c, name, color } : c))
    );
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((current) => current.filter((c) => c.id !== categoryId));
    setThoughts((current) => current.filter((t) => t.categoryId !== categoryId));
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700', fontSize: 20 },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Landing"
          options={({ navigation }) => ({
            title: 'Thought Hub',
            headerRight: () => (
              <Pressable onPress={() => navigation.navigate('ManageCategories')} hitSlop={10}>
                <Text style={{ color: colors.text, fontWeight: '600' }}>Edit</Text>
              </Pressable>
            ),
          })}
        >
          {(props) => <LandingScreen {...props} categories={categories} thoughts={thoughts} />}
        </Stack.Screen>

        <Stack.Screen
          name="CategoryList"
          options={({ route }) => {
            const category = categories.find((c) => c.id === route.params.categoryId);
            return { title: category ? category.name : 'Category' };
          }}
        >
          {(props) => (
            <HomeScreen
              {...props}
              thoughts={thoughts}
              categories={categories}
              recentlyDeleted={recentlyDeleted}
              undoDelete={undoDelete}
              deleteThought={deleteThought}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Detail"
          options={({ route }) => {
            const thought = thoughts.find((t) => t.id === route.params.thoughtId);
            const category = thought ? categories.find((c) => c.id === thought.categoryId) : null;
            return { title: category ? category.name : 'Thought' };
          }}
        >
          {(props) => (
            <DetailScreen
              {...props}
              thoughts={thoughts}
              categories={categories}
              updateDetails={updateDetails}
              updateTitle={updateTitle}
              moveThought={moveThought}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="AddThought"
          options={({ route }) => {
            const category = categories.find((c) => c.id === route.params.categoryId);
            const label = category ? category.name.slice(0, -1) : 'Thought';
            return { title: `New ${label}` };
          }}
        >
          {(props) => <AddThoughtScreen {...props} addThought={addThought} categories={categories} />}
        </Stack.Screen>

               <Stack.Screen name="ManageCategories" options={{ title: 'Categories' }}>
          {(props) => (
            <ManageCategoriesScreen
              {...props}
              categories={categories}
              deleteCategory={deleteCategory}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="EditCategory"
          options={({ route }) => ({ title: route.params.categoryId ? 'Edit Category' : 'New Category' })}
        >
          {(props) => (
            <EditCategoryScreen
              {...props}
              categories={categories}
              addCategory={addCategory}
              updateCategory={updateCategory}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
    loadingText: { color: colors.text, fontSize: 16 },
});