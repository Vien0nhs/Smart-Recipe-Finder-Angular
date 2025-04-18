import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from './models/recipe-dto';

export interface HistoryDTO {
    id: number;
    userId: number;
    recipeId: number;
    recipeTitle: string;
    recipeImage: string;
    cookedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = 'http://localhost:8080/api/history';

  constructor(private http: HttpClient) {}

  getUserHistory(page: number, size: number): Observable<Page<HistoryDTO>> {
    return this.http.get<Page<HistoryDTO>>(`${this.apiUrl}?page=${page}&size=${size}`, { withCredentials: true });
  }

  deleteHistory(recipeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recipeId}`, { withCredentials: true });
  }
}