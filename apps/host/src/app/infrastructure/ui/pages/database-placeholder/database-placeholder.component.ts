import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-database-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-2xl mx-auto text-center">
        <div class="bg-purple-50 border-2 border-purple-200 rounded-lg p-8">
          <h1 class="text-4xl font-bold text-purple-600 mb-4">
            Database Microfrontend
          </h1>
          <p class="text-xl text-gray-600 mb-4">Coming Soon</p>
          <p class="text-gray-500">
            This will be a separate microfrontend loaded via Module Federation.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class DatabasePlaceholderComponent {}
