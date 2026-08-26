// screens/types.ts

export type Thought = {
    id: string;
    title: string;
    details: string;
};

export type RootStackParamList = {
    Home: undefined;
    Detail: { thoughtId: string };
    AddThought: undefined;
};