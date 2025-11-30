import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  menuItems = [
    { label: 'Home', route: '/' },
    { label: 'About', route: '/about' },
    { label: 'Blog', route: '/blog' },
    { label: 'Database', route: '/database' },
  ];
}
