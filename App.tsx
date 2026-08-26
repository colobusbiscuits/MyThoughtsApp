// App.tsx
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './screens/LandingScreen';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import AddThoughtScreen from './screens/AddThoughtScreen';
import type { RootStackParamList, Thought, Category } from './screens/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  const [thoughts, setThoughts] = useState<Thought[]>([
    { id: '1', title: 'Idea for a short story about a lighthouse keeper', details: '', category: 'Ideas' },
    { id: '2', title: 'Buy groceries: eggs, oat milk, coffee', details: '', category: 'Notes' },
    { id: '3', title: 'How did the Romans actually build roads that lasted', details: '', category: 'Thoughts' },
    { id: '4', title: 'Who sang the opening song from Insidious 2?', details: '', category: 'Questions' },
    { id: '5', title: 'Where to buy a new laptop?', details: '', category: 'Questions' },
    { id: '6', title: 'Latest graphics card models?', details: '', category: 'Questions' },
  ]);

  const addThought = (title: string, category: Category) => {
    setThoughts((current) =>
      [...current,
      { id: Date.now().toString(), title, details: '', category }]);
  };

  const updateDetails = (thoughtId: string, details: string) => {
    setThoughts((current) =>
      current.map((t) => (t.id === thoughtId ? { ...t, details } : t))
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1d27' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700', fontSize: 20 },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} options={{ title: 'Thought Hub' }} />
        <Stack.Screen
          name="CategoryList"
          options={({ route }) => ({ title: route.params.category })}
        >
          {(props) => <HomeScreen {...props} thoughts={thoughts} />}
        </Stack.Screen>

       <Stack.Screen
    name="Detail"
    options={({ route }) => {
        const thought = thoughts.find((t) => t.id === route.params.thoughtId);
        return { title: thought ? thought.category : 'Thought' };
    }}
>
    {(props) => <DetailScreen {...props} thoughts={thoughts} updateDetails={updateDetails} />}
</Stack.Screen>

        <Stack.Screen
          name="AddThought"
          options={({ route }) => ({ title: `New ${route.params.category.slice(0, -1)}` })}
        >
          {(props) => <AddThoughtScreen {...props} addThought={addThought} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

