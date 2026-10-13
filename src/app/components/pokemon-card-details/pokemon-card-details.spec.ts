import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCardDetailsComponent } from './pokemon-card-details';

describe('PokemonCardDetails', () => {
  let component: PokemonCardDetailsComponent;
  let fixture: ComponentFixture<PokemonCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCardDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCardDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
