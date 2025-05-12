import { Component, OnInit } from '@angular/core';
import { ProgramService } from './../../services/program.service';  
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ProgramListComponent implements OnInit {
  programs: any[] = [];
  filteredPrograms: any[] = [];
  searchTerm: string = '';
  dateFilter: string = '';
  isExporting: boolean = false;
  isLoading: boolean = false;
  isDeleting: { [key: string]: boolean } = {};

  constructor(
    private programService: ProgramService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.isLoading = true;
    this.programService.getPrograms(this.searchTerm, this.dateFilter).subscribe({
      next: (data: any) => {
        this.programs = data;
        this.filterPrograms();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading programs:', error);
        this.toastr.error('Error loading programs');
        this.isLoading = false;
      }
    });
  }

  filterPrograms(): void {
    this.filteredPrograms = this.programs.filter(program => {
      const matchesSearch = !this.searchTerm || 
        program.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDate = !this.dateFilter || 
        new Date(program.date).toISOString().split('T')[0] === this.dateFilter;

      return matchesSearch && matchesDate;
    });
  }

  exportPrograms(): void {
    this.isExporting = true;
    this.programService.exportPrograms().subscribe({
      next: (blob: Blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'programs.pdf';
        link.click();
        this.isExporting = false;
      },
      error: (error) => {
        console.error('Error exporting PDF:', error);
        this.isExporting = false;
      }
    });
  }

  deleteProgram(id: string): void {
    if (confirm('Are you sure you want to delete this program?')) {
      this.isDeleting[id] = true;
      this.programService.deleteProgram(id).subscribe({
        next: () => {
          this.loadPrograms();
          delete this.isDeleting[id];
        },
        error: (error) => {
          console.error('Error deleting program:', error);
          delete this.isDeleting[id];
        }
      });
    }
  }
}
