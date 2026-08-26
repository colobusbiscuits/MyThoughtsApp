// screens/types.ts

export type Category = 'Ideas' | 'Thoughts' | 'Recipes' | 'Notes' | 'Questions'

export type Thought = {
    id: string;
    title: string;
    details: string;
    category: Category;
};

export type RootStackParamList = {
    Landing: undefined
    CategoryList: { category: Category};
    Detail: { thoughtId: string };
    AddThought: { category: Category};
};