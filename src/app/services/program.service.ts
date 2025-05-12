import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private apiUrl = 'https://doc-project-api.onrender.com/'; // Flask backend URL

  constructor(private http: HttpClient) {}

  // Add a new program
  addProgram(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('date', data.date);
    formData.append('hours', data.hours);
    formData.append('description', data.description);
    data.photos.forEach((photo: any) => formData.append('photos', photo));

    return this.http.post(`${this.apiUrl}/programs`, formData);
  }

  // Get programs with filters
  getPrograms(name: string = '', date: string = ''): Observable<any> {
    return this.http.get(`${this.apiUrl}/programs`, {
      params: { name, date }
    });
  }

  // Export programs as PDF
  exportPrograms(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/programs/export`, { responseType: 'blob' });
  }

  // Delete a program
  deleteProgram(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/programs/${id}`);
  }
}
