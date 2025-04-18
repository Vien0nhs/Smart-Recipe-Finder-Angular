import { Component, OnInit } from '@angular/core';
import { Page, RecipeDTO } from '../models/recipe-dto';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchStateService } from '../search-state.service';

@Component({
  selector: 'app-find-by-name',
  imports: [CommonModule, FormsModule],
  templateUrl: './find-by-name.component.html',
  styleUrls: ['./find-by-name.component.css']
})
export class FindByNameComponent implements OnInit {
  recipeName: string = '';
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
  ) {}

  ngOnInit() {
    console.log('recipeName: ', this.recipeName);
    // Khôi phục trạng thái nếu có
    const savedState = this.searchStateService.getFindByNameState();
    if (savedState) {
      this.recipeName = savedState.recipeName;
      this.currentPage = savedState.currentPage;
      this.recipes = savedState.recipes;
      this.totalPages = Math.ceil(savedState.recipes.length / this.pageSize); // Tính lại totalPages
    }
  }

  searchRecipes() {
    this.loading = true;
    this.error = null;

    if (!this.recipeName.trim()) {
      this.error = 'Please enter a recipe name.';
      this.loading = false;
      return;
    }

    // Sửa page thành currentPage - 1 vì backend dùng 0-based
    const url = `http://localhost:8080/api/recipes/search-by-title?title=${encodeURIComponent(this.recipeName)}&page=${this.currentPage}&size=${this.pageSize}`;
    this.http.get<Page<RecipeDTO>>(url, { withCredentials: true })
      .subscribe({
        next: (data) => {
          console.log('Response from server:', data); // Log để kiểm tra
          this.recipes = data.content; // Giữ nguyên dữ liệu từ server, không map lại image
          this.totalPages = data.page.totalPages;
          this.currentPage = data.page.number + 1; // Cập nhật currentPage từ backend
          this.loading = false;
          console.log('recipeName: ', this.recipeName);

          this.searchStateService.setFindByNameState({
            recipeName: this.recipeName,
            currentPage: this.currentPage,
            recipes: this.recipes
          });

        },
        error: (err) => {
          this.error = 'Error fetching recipes. Please try again or sign in to use this feature.';
          console.error('Error:', err);
          this.loading = false;
        }
      });
  }

  loadRecipes(page: number) {
    this.currentPage = page;
    this.searchRecipes();
  }

  viewDetails(id: number) {
    // Lưu trạng thái trước khi điều hướng
    this.searchStateService.setFindByNameState({
      recipeName: this.recipeName,
      currentPage: this.currentPage,
      recipes: this.recipes
    });
    this.searchStateService.setLastRoute('/find-by-name'); // Lưu route cuối cùng
    this.router.navigate(['/recipes', id], { queryParams: { page: this.currentPage } });
  }
}