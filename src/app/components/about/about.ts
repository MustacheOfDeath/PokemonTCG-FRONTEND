import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './about.html',
})
export class AboutComponent implements OnInit {
  isLoading: boolean = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Simriamo un breve caricamento con l'animazione di Pikachu per coerenza
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 400);
  }
}
