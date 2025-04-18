import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SearchStateService } from '../search-state.service';
import { HistoryService, HistoryDTO } from '../history.service';

@Component({
  selector: 'app-history',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  histories: HistoryDTO[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 8;
  notification: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchStateService: SearchStateService,
    private historyService: HistoryService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentPage = params['page'] ? +params['page'] : 1;
      const savedState = this.searchStateService.getHistoryState();
      
      // Chỉ sử dụng savedState nếu không có yêu cầu làm mới
      if (savedState && !this.searchStateService.getHistoryRefreshFlag()) {
        this.histories = savedState.histories;
        this.totalPages = savedState.totalPages;
        this.currentPage = savedState.currentPage;
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { page: this.currentPage },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      } else {
        this.loadHistory(this.currentPage);
        this.searchStateService.setHistoryRefreshFlag(false); // Reset flag sau khi làm mới
      }
    });
  }

  loadHistory(page: number) {
    this.currentPage = page;
    this.historyService.getUserHistory(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.histories = data.content;
        this.totalPages = data.page.totalPages;
        this.currentPage = data.page.number + 1;

        this.searchStateService.setHistoryState({
          currentPage: this.currentPage,
          histories: this.histories,
          totalPages: this.totalPages
        });

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { page: this.currentPage },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      },
      error: (err) => {
        console.error('Error fetching history:', err);
        this.showNotification('Error loading history. Please try again.');
      }
    });
  }

  refreshHistory() {
    this.loadHistory(this.currentPage);
  }

  viewDetails(id: number) {
    this.searchStateService.setHistoryState({
      currentPage: this.currentPage,
      histories: this.histories,
      totalPages: this.totalPages
    });
    this.searchStateService.setLastRoute('/history');
    this.router.navigate(['/recipes', id], { queryParams: { page: this.currentPage } });
  }

  deleteHistory(recipeId: number) {
    const confirmed = window.confirm('Are you sure you want to delete this from history?');
    if (!confirmed) return;

    this.historyService.deleteHistory(recipeId).subscribe({
      next: () => {
        this.showNotification('Removed from history successfully!');
        this.refreshHistory(); // Làm mới danh sách sau khi xóa
      },
      error: () => this.showNotification('Error removing from history. Please try again.')
    });
  }

  showNotification(message: string) {
    this.notification = message;
    setTimeout(() => this.notification = null, 3000);
  }
}