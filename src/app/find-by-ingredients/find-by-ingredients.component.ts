import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Page, RecipeDTO } from '../models/recipe-dto';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SearchStateService } from '../search-state.service';

@Component({
  selector: 'app-find-by-ingredients',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './find-by-ingredients.component.html',
  styleUrl: './find-by-ingredients.component.css'
})
export class FindByIngredientsComponent implements OnInit{
  ingredients = ['','','','',''];
  recipes: RecipeDTO[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 3;
  loading = false;
  error: string | null = null;
  constructor(
    private http: HttpClient, 
    private router: Router,
    private searchStateService: SearchStateService // Thêm service nếu cần
  ){}
  ngOnInit() {
    // Khôi phục trạng thái nếu có
    const savedState = this.searchStateService.getFindByIngredientsState();
    if (savedState) {
      this.ingredients = savedState.ingredients;
      this.currentPage = savedState.currentPage;
      this.recipes = savedState.recipes;
      this.totalPages = Math.ceil(savedState.recipes.length / this.pageSize); // Tính lại totalPages
    }
  }
  searchRecipes(){
    this.loading = true;
    this.error = null;
    const validIngredients = this.ingredients.filter(ing => ing.trim() !== '');
    if(validIngredients.length === 0){
      this.error = 'please enter at least one ingredients.';
      this.loading = false;
      return;
    }
    const params = validIngredients
      .map((ing, index)=>`ingredient${index+1}=${encodeURIComponent(ing)}`)
      .join('&') + `&page=${this.currentPage}&size=${this.pageSize}`;
    const url = `http://localhost:8080/api/recipes/search-by-ingredients?${params}`;
    this.http.get<Page<RecipeDTO>>(url, {withCredentials: true})
    .subscribe({
      next: (data) => {
        this.recipes = data.content;
        this.totalPages = data.page.totalPages;
        this.currentPage = data.page.number + 1;
        this.loading = false;

        // Lưu trạng thái sau khi tìm kiếm
        this.searchStateService.setFindByIngredientsState({
          ingredients: [...this.ingredients], // Sao chép mảng để tránh tham chiếu
          currentPage: this.currentPage,
          recipes: this.recipes
        });
      },
      error: (err) =>{
        this.error = 'Error fetching recipes. Please try again or sign in.';
        console.error(err);
        this.loading = false;
      }
    });
  }
  loadRecipes(page: number){
    this.currentPage=page;
    this.searchRecipes();
  }
  viewDetails(id: number){
    // Lưu trạng thái trước khi điều hướng
    this.searchStateService.setFindByIngredientsState({
      ingredients: [...this.ingredients],
      currentPage: this.currentPage,
      recipes: this.recipes
    });
    this.searchStateService.setLastRoute('/find-by-ingredients'); // Lưu route cuối cùng
    this.router.navigate(['/recipes',id], {queryParams: {page: this.currentPage}});
  }
}
