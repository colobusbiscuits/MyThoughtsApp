// screens/types.ts

export type Category = {
    id: string;
    name: string;
    color: string;
    image?: string;
};

export type Thought = {
    id: string;
    title: string;
    details: string;
    categoryId: string;
};

export type RootStackParamList = {
    Landing: undefined
    CategoryList: { categoryId: string};
    Detail: { thoughtId: string };
    AddThought: { categoryId: string};
    ManageCategories: undefined;
    EditCategory: { categoryId?: string };
};
