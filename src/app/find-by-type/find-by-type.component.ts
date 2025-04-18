import { Component, OnInit } from '@angular/core';
import { Page, RecipeDTO } from '../models/recipe-dto';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchStateService } from '../search-state.service';

@Component({
  selector: 'app-find-by-type',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './find-by-type.component.html',
  styleUrls: ['./find-by-type.component.css']
})
export class FindByTypeComponent implements OnInit {
  types: { name: string; displayName: string }[] = [];
  selectedType: string | null = null;
  recipes: RecipeDTO[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 3; // Giống FindByName
  loading = false;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private searchStateService: SearchStateService
  ) {}

  ngOnInit() {
    console.log('debug: ', this.totalPages);
    // Khôi phục trạng thái nếu có
    const savedState = this.searchStateService.getFindByTypeState();
    if (savedState) {
      this.selectedType = savedState.selectedType;
      this.currentPage = savedState.currentPage;
      this.recipes = savedState.recipes;
      this.totalPages = savedState.totalPages;
    }

    // Tải danh sách loại công thức
    this.http
      .get<string[]>('http://localhost:8080/api/recipes/search-by-type?suggest=true', { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.types = data.map((item) => ({
            name: item.split(' (')[0],
            displayName: item.match(/\((.+)\)/)?.[1] || item,
          }));
          if (this.types.length && !this.selectedType) {
            this.selectType(this.types[0].name); // Chọn mặc định
          }
        },
        error: (err) => {
          this.error = 'Error loading recipe types. Please try again.';
          console.error('Lỗi tải danh sách loại:', err);
        },
      });
  }

  selectType(type: string) {
    this.selectedType = type;
    this.currentPage = 1;
    this.searchRecipes();
  }

  searchRecipes() {
    if (!this.selectedType) {
      this.error = 'Please select a recipe type.';
      return;
    }

    this.loading = true;
    this.error = null;

    // Gửi recipeType chữ thường và thêm suggest=false
    const url = `http://localhost:8080/api/recipes/search-by-type?recipeType=${
      this.selectedType
    }&suggest=false&page=${this.currentPage}&size=${this.pageSize}`;
    this.http
      .get<Page<RecipeDTO>>(url, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.recipes = data.content;
          this.totalPages = data.page.totalPages;
          this.currentPage = data.page.number + 1;
          this.loading = false;

          this.searchStateService.setFindByTypeState({
            selectedType: this.selectedType,
            currentPage: this.currentPage,
            recipes: this.recipes,
            totalPages: this.totalPages
          });

        },
        error: (err) => {
          this.error = 'Error fetching recipes. Please try again or sign in to use this feature.';
          console.error('Lỗi tải công thức:', err);
          this.loading = false;
        },
      });
  }

  loadRecipes(page: number) {
    this.currentPage = page;
    this.searchRecipes();
  }

  viewDetails(id: number) {
    this.searchStateService.setFindByTypeState({
      selectedType: this.selectedType,
      currentPage: this.currentPage,
      recipes: this.recipes,
      totalPages: this.totalPages
    });
    this.searchStateService.setLastRoute('/find-by-type');
    this.router.navigate(['/recipes', id], { queryParams: { page: this.currentPage } });
  }
}