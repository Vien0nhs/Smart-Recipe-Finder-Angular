import { Injectable } from '@angular/core';
import { HistoryState, RecipeDTO } from './models/recipe-dto';

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {
  private findByNameState: { 
    recipeName: string, 
    currentPage: number, 
    recipes: RecipeDTO[] 
  } | null = null;

  private findByIngredientsState: { 
    ingredients: string[], 
    currentPage: number, 
    recipes: RecipeDTO[] 
  } | null = null;

  private findByTypeState: { 
    selectedType: string | null, 
    currentPage: number, 
    recipes: RecipeDTO[],
    totalPages: number; 
  } | null = null;

  private recipesState: { 
    currentPage: number, 
    recipes: RecipeDTO[], 
    totalPages: number 
  } | null = null;

  private lastRoute: string | null = null; // Lưu route cuối cùng
  private historyState: HistoryState | null = null;
  private historyRefreshFlag: boolean = false;

  setHistoryRefreshFlag(refresh: boolean) {
    this.historyRefreshFlag = refresh;
  }

  getHistoryRefreshFlag(): boolean {
    return this.historyRefreshFlag;
  }
  setHistoryState(state: HistoryState) {
    this.historyState = state;
  }

  getHistoryState(): HistoryState | null {
    return this.historyState;
  }
  // Cho FindByNameComponent
  setFindByNameState(
    state: { 
      recipeName: string, 
      currentPage: number, 
      recipes: RecipeDTO[] 
    }) {
    this.findByNameState = state;
  }

  getFindByNameState() {
    return this.findByNameState;
  }

  clearFindByNameState() {
    this.findByNameState = null;
  }

  // Cho FindByIngredientsComponent
  setFindByIngredientsState(
    state: { 
      ingredients: string[], 
      currentPage: number, 
      recipes: RecipeDTO[] 
    }
  ) {
    this.findByIngredientsState = state;
  }

  getFindByIngredientsState() {
    return this.findByIngredientsState;
  }

  clearFindByIngredientsState() {
    this.findByIngredientsState = null;
  }

  // Cho FindByTypeComponent
  setFindByTypeState(
    state: { 
      selectedType: string | null, 
      currentPage: number, 
      recipes: RecipeDTO[],
      totalPages: number; 
    }
  ) {
    this.findByTypeState = state;
  }

  getFindByTypeState() {
    return this.findByTypeState;
  }

  clearFindByTypeState() {
    this.findByTypeState = null;
  }

  // Cho RecipesComponent
  setRecipesState(state: { 
    currentPage: number, 
    recipes: RecipeDTO[], 
    totalPages: number 
  }) {
    this.recipesState = state;
  }

  getRecipesState() {
    return this.recipesState;
  }

  clearRecipesState() {
    this.recipesState = null;
  }

  // Lưu và lấy lastRoute
  setLastRoute(route: string) {
    this.lastRoute = route;
  }

  getLastRoute() {
    return this.lastRoute;
  }

  clearLastRoute() {
    this.lastRoute = null;
  }
}