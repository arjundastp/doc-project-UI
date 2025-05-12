import { Component, ViewChild, ElementRef } from '@angular/core';
import { ProgramService } from './../../services/program.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-program-form',
  templateUrl: './program-form.component.html',
  styleUrls: ['./program-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ProgramFormComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  readonly MAX_IMAGES = 4;
  isSubmitting = false;

  program = {
    name: '',
    date: '',
    hours: null as number | null,
    description: '',
    photos: [] as File[]
  };
  
  imagePreviewUrls: string[] = [];

  constructor(
    private programService: ProgramService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onFileChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      const remainingSlots = this.MAX_IMAGES - this.program.photos.length;
      
      if (remainingSlots <= 0) {
        alert(`Maximum ${this.MAX_IMAGES} images allowed`);
        element.value = '';
        return;
      }

      const files = Array.from(element.files).slice(0, remainingSlots);
      this.program.photos = [...this.program.photos, ...files];
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            this.imagePreviewUrls.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });

      // Reset input if max reached
      if (this.program.photos.length >= this.MAX_IMAGES) {
        element.value = '';
      }
    }
  }

  removeImage(index: number): void {
    this.imagePreviewUrls.splice(index, 1);
    this.program.photos.splice(index, 1);
    
    if (this.program.photos.length === 0 && this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  submitForm(): void {
    if (this.validateForm()) {
      this.isSubmitting = true;
      this.programService.addProgram(this.program).subscribe({
        next: () => {
          this.toastr.success('Program added successfully');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error adding program:', error);
          this.toastr.error(error.message || 'Error adding program');
          this.isSubmitting = false;
        }
      });
    }
  }

  private validateForm(): boolean {
    return !!(this.program.name && 
              this.program.date && 
              typeof this.program.hours === 'number' && 
              this.program.description);
  }
}
