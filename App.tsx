// App.tsx
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import AddThoughtScreen from './screens/AddThoughtScreen';
import type { RootStackParamList, Thought } from './screens/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  const [thoughts, setThoughts] = useState<Thought[]>([
    { id: '1', title: 'Idea for a story about a lighthouse keeper', details: '' },
    { id: '2', title: 'Buy groceries: eggs, oat milk, coffee', details: ''},
    { id: '3', title: 'How did the Romans actually build roads that lasted', details: '' },
    { id: '4', title: 'Who sang the opening song from Insidious 2?', details: '' },
    { id: '5', title: 'Where to buy a new laptop?', details: '' },
    { id: '6', title: 'Latest graphics card models?', details: '' },
  ]);

const addThought = (title: string) => {
    setThoughts((current) => [...current, { id: Date.now().toString(), title, details: '' }]);
  };

  const updateDetails = (thoughtId: string, details: string) => {
    setThoughts((current) =>
      current.map((t) => (t.id === thoughtId ? { ...t, details } : t))
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ title: 'Thought Hub' }}>
          {(props) => <HomeScreen {...props} thoughts={thoughts} />}
        </Stack.Screen>
        <Stack.Screen name="Detail" options={{ title: 'Thought' }}>
          {(props) => <DetailScreen {...props} thoughts={thoughts} updateDetails={updateDetails} />}
        </Stack.Screen>
        <Stack.Screen name="AddThought" options={{ title: 'New Thought' }}>
          {(props) => <AddThoughtScreen {...props} addThought={addThought} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

