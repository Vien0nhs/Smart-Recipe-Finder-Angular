export interface RecipeDTO {
    id: number;
    title: string;
    instructions: string;
    image: string;
    recipeType: string;
    cookingTime: number;
    ingredients: { ingredientId: number; name: string; type: string; isMain: boolean; quantity: string }[];
    spices: { spiceId: number; name: string; quantity: string }[];
}

export interface Page<T> {
    content: T[];
    page:{
        totalPages: number;
        totalElements: number;
        number: number; // Trang hiện tại (0-based)
        size: number; // Số phần tử trên mỗi trang
    };
}
export interface RecipeIngredientDTO {
    name: string;
    quantity: string;
    isMain: boolean;
}

export interface RecipeSpiceDTO {
    name: string;
    quantity: string;
}

export interface HistoryState {
    currentPage: number;
    histories: any[];
    totalPages: number;
}