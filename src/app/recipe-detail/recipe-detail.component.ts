import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RatingService, RatingDTO, CommentDTO } from '../rating.service';
import { SearchStateService } from '../search-state.service';

@Component({
  selector: 'app-recipe-detail',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: any = null;
  currentPage: number = 1;
  userRating: RatingDTO | null = null;
  selectedRating: number = 0;
  averageRating: number = 0;
  showCommentBox: boolean = false;
  comment: string = '';
  notification: string | null = null;
  isLoggedIn: boolean = false;
  comments: CommentDTO[] = [];
  displayedComments: CommentDTO[] = [];
  commentsPerPage: number = 3;
  userEmail: string | null = null;
  editingComment: CommentDTO | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private searchStateService: SearchStateService,
    private ratingService: RatingService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.currentPage = this.route.snapshot.queryParams['page'] ? +this.route.snapshot.queryParams['page'] : 1;
  
    if (id) {
      this.loadRecipe(+id);
    }
  }
  
  loadRecipe(id: number) {
    this.http.get<{ email: string }>('http://localhost:8080/users/me', { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.isLoggedIn = true;
          this.userEmail = data.email;
          if(this.isLoggedIn){
            // Gọi recipe có quyền user
            this.http.get(`http://localhost:8080/api/recipes/${id}`, { withCredentials: true })
              .subscribe({
                next: (data) => this.recipe = data,
                error: (err) => console.error('Error fetching recipe (with login):', err)
              });

            this.loadRatings(id);
            this.loadComments(id);
          }
        },
        error: () => {
          this.isLoggedIn = false;
          this.userEmail = null;
        }
      });
  }

  loadRatings(recipeId: number) {
    this.ratingService.getAverageRating(recipeId).subscribe({
      next: (avg) => this.averageRating = avg,
      error: () => this.averageRating = 0
    });

    if (this.isLoggedIn) {
      this.ratingService.getUserRating(recipeId).subscribe({
        next: (rating) => {
          this.userRating = rating;
          this.selectedRating = rating ? rating.rating : 0;
          this.comment = rating ? rating.comment || '' : '';
        },
        error: () => {
          this.userRating = null;
          this.comment = '';
        }
      });
    }
  }

  loadComments(recipeId: number) {
    this.ratingService.getComments(recipeId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.displayedComments = comments.slice(0, this.commentsPerPage);
      },
      error: () => {
        this.comments = [];
        this.displayedComments = [];
      }
    });
  }

  loadMoreComments() {
    const nextBatch = this.comments.slice(0, this.displayedComments.length + this.commentsPerPage);
    this.displayedComments = nextBatch;
  }

  selectStar(rating: number) {
    if (this.isLoggedIn) {
      this.selectedRating = rating;
    }
  }

  submitRating() {
    if (!this.isLoggedIn) return;
    if (this.selectedRating < 1 || this.selectedRating > 5) {
      this.showNotification('Please select a rating between 1 and 5 stars.');
      return;
    }
    if (!this.recipe) {
      this.showNotification('Recipe not loaded.');
      return;
    }

    const ratingDTO: RatingDTO = {
      rating: this.selectedRating,
      comment: this.comment || (this.userRating ? this.userRating.comment : '')
    };

    this.ratingService.createOrUpdateRating(this.recipe.id, ratingDTO).subscribe({
      next: (result) => {
        this.userRating = result;
        this.showNotification('Rating submitted successfully!');
        this.loadRatings(this.recipe!.id);
        this.loadComments(this.recipe!.id);
      },
      error: () => this.showNotification('Error submitting rating. Please try again.')
    });
  }

  toggleCommentBox() {
    if (!this.isLoggedIn) {
      this.showNotification('Please sign in to comment.');
      return;
    }
    if (!this.userRating) {
      this.showNotification('Please submit a rating before commenting.');
      return;
    }
    this.editingComment = null;
    this.comment = this.userRating.comment || '';
    this.showCommentBox = !this.showCommentBox;
  }

  submitComment() {
    if (!this.isLoggedIn || !this.userRating || !this.recipe) return;

    if (this.editingComment) {
      this.ratingService.updateComment(this.recipe.id, this.comment).subscribe({
        next: (result) => {
          this.userRating = result;
          this.showCommentBox = false;
          this.editingComment = null;
          this.showNotification('Comment updated successfully!');
          this.loadComments(this.recipe!.id);
        },
        error: () => this.showNotification('Error updating comment. Please try again.')
      });
    } else {
      const ratingDTO: RatingDTO = {
        rating: this.userRating.rating,
        comment: this.comment
      };

      this.ratingService.createOrUpdateRating(this.recipe.id, ratingDTO).subscribe({
        next: (result) => {
          this.userRating = result;
          this.showCommentBox = false;
          this.showNotification('Comment submitted successfully!');
          this.loadComments(this.recipe!.id);
        },
        error: () => this.showNotification('Error submitting comment. Please try again.')
      });
    }
  }

  editComment(comment: CommentDTO) {
    if (!this.isLoggedIn) {
      this.showNotification('Please sign in to edit your comment.');
      return;
    }
    if (!this.userRating) {
      this.showNotification('Please submit a rating before editing your comment.');
      return;
    }
    if (!this.recipe || comment.email !== this.userEmail) return;
    this.editingComment = comment;
    this.comment = comment.comment;
    this.showCommentBox = true;
  }

  confirmDelete() {
    if (!this.isLoggedIn) {
      this.showNotification('Please sign in to delete your comment.');
      return;
    }
    if (!this.userRating) {
      this.showNotification('Please submit a rating before deleting your comment.');
      return;
    }
    if (!this.recipe) return;

    const confirmed = window.confirm('Are you sure you want to delete your comment?');
    if (!confirmed) return;

    this.ratingService.deleteComment(this.recipe.id).subscribe({
      next: () => {
        this.userRating = null;
        this.selectedRating = 0;
        this.comment = '';
        this.showCommentBox = false;
        this.showNotification('Comment deleted successfully!');
        this.loadComments(this.recipe!.id);
        this.loadRatings(this.recipe!.id);
      },
      error: () => this.showNotification('Error deleting comment. Please try again.')
    });
  }

  saveToHistory() {
    if (!this.isLoggedIn) {
      this.showNotification('Please sign in to save to history.');
      return;
    }
    if (!this.recipe) {
      this.showNotification('Recipe not loaded.');
      return;
    }

    this.http.post(`http://localhost:8080/api/history/${this.recipe.id}`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.showNotification('Saved to history successfully!');
          this.searchStateService.setHistoryRefreshFlag(true); // Đặt flag để làm mới lịch sử
        },
        error: (err) => {
          console.error('Error saving to history:', err);
          this.showNotification('Error saving to history. Please try again.');
          if (err.status === 401 || err.status === 403) {
            this.signInWithGoogle();
          }
        }
      });
  }

  showNotification(message: string) {
    this.notification = message;
    setTimeout(() => this.notification = null, 3000);
  }

  getImageUrl(image: string): string {
    return `http://localhost:8080${image}`;
  }

  goBack() {
    const lastRoute = this.searchStateService.getLastRoute();
    if (lastRoute === '/find-by-ingredients') {
      this.router.navigate(['/find-by-ingredients']);
      return;
    }

    if (lastRoute === '/find-by-name') {
      this.router.navigate(['/find-by-name']);
      return;
    }

    if (lastRoute === '/recipes') {
      const recipesState = this.searchStateService.getRecipesState();
      const page = recipesState ? recipesState.currentPage : this.currentPage;
      this.router.navigate(['/recipes'], { queryParams: { page } });
      return;
    }
    if (lastRoute === '/find-by-type') {
      this.router.navigate(['/find-by-type']);
      return;
    }
    if(lastRoute === '/history'){
      this.router.navigate(['/history']);
      return;
    }

    this.router.navigate(['/recipes'], { queryParams: { page: this.currentPage } });
  }

  signInWithGoogle() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }
}