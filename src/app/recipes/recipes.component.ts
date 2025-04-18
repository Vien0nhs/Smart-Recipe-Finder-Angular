import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Page, RecipeDTO } from '../models/recipe-dto';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SearchStateService } from '../search-state.service';

@Component({
  selector: 'app-recipes',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent implements OnInit {
  recipes: RecipeDTO[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 8;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private searchStateService: SearchStateService
  ){}

  ngOnInit() {
    // Khôi phục trạng thái nếu có
    const savedState = this.searchStateService.getRecipesState();
    if (savedState) {
      this.currentPage = savedState.currentPage;
      this.recipes = savedState.recipes;
      this.totalPages = savedState.totalPages; // Khôi phục totalPages từ trạng thái      
      // Cập nhật URL với query param
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: this.currentPage },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    } else {
      this.route.queryParams.subscribe(params => {
        this.currentPage = params['page'] ? +params['page'] : 1;
        this.loadRecipes(this.currentPage);
      });
    }
  }
  loadRecipes(page: number) {
    this.currentPage = page;
    const url = `http://localhost:8080/api/recipes?page=${this.currentPage}&size=${this.pageSize}`;
    this.http.get<Page<RecipeDTO>>(url,{withCredentials: true})
      .subscribe({
        next: (data) => {
          console.log('Full Response:', data); // Log toàn bộ response
          console.log('Total Pages:', data.page.totalPages); // Kiểm tra giá trị
          console.log('Images:', data.content.map(r => r.image));
          console.log('Recipe data:', data);
          this.recipes = data.content;
          this.totalPages = data.page.totalPages; // Số trang tổng cộng
          this.currentPage = data.page.number + 1; // Chuyển từ 0-based sang 1-based
          
          // Lưu trạng thái sau khi tải
          this.searchStateService.setRecipesState({
            currentPage: this.currentPage,
            recipes: this.recipes,
            totalPages: this.totalPages // Lưu totalPages
          });

          // Cập nhật URL với query param
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: this.currentPage },
            queryParamsHandling: 'merge',
            replaceUrl: true // Không thêm vào history
          });
        },
        error: (err) => console.error('Error fetching recipes:', err)
      });
  }
  viewDetails(id: number) {
    // Lưu trạng thái trước khi điều hướng
    this.searchStateService.setRecipesState({
      currentPage: this.currentPage,
      recipes: this.recipes,
      totalPages: this.totalPages // Lưu totalPages
    });
    this.searchStateService.setLastRoute('/recipes'); // Lưu route cuối cùng
    this.router.navigate(['/recipes', id], { queryParams: { page: this.currentPage } });
  }
}
