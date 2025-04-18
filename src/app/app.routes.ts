import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { FindByIngredientsComponent } from './find-by-ingredients/find-by-ingredients.component';
import { FindByNameComponent } from './find-by-name/find-by-name.component';
import { OAuthButtonComponent } from './oauth-button/oauth-button.component';
import { FindByTypeComponent } from './find-by-type/find-by-type.component';
import { HistoryComponent } from './history/history.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'recipes', component: RecipesComponent},
    {path: 'recipes/:id', component: RecipeDetailComponent},
    {path: 'find-by-ingredients', component: FindByIngredientsComponent},
    {path: 'find-by-name', component: FindByNameComponent},
    {path: 'me', component: OAuthButtonComponent},
    {path: 'history', component: HistoryComponent},
    {path: 'find-by-type', component: FindByTypeComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'} // Home là trang default,

];
