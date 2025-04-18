import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RatingDTO {
  id?: number;
  userId?: number;
  recipeId?: number;
  rating: number;
  comment?: string;
}
export interface CommentDTO {
  fullName: string;
  comment: string;
  email: string;
}
@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'http://localhost:8080/api/ratings';

  constructor(private http: HttpClient) {}

  createOrUpdateRating(recipeId: number, rating: RatingDTO): Observable<RatingDTO> {
    return this.http.post<RatingDTO>(`${this.apiUrl}/${recipeId}`, rating, { withCredentials: true });
  }

  getUserRating(recipeId: number): Observable<RatingDTO> {
    return this.http.get<RatingDTO>(`${this.apiUrl}/${recipeId}/user`, { withCredentials: true });
  }

  getAverageRating(recipeId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${recipeId}/average`, { withCredentials: true });
  }

  getComments(recipeId: number): Observable<CommentDTO[]> {
    return this.http.get<CommentDTO[]>(`${this.apiUrl}/${recipeId}/comments`, { withCredentials: true });
  }
  deleteComment(recipeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recipeId}/comment`, { withCredentials: true });
  }

  updateComment(recipeId: number, comment: string): Observable<RatingDTO> {
    return this.http.put<RatingDTO>(`${this.apiUrl}/${recipeId}/comment`, comment, { withCredentials: true });
  }
}