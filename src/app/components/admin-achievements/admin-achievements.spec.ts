import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAchievementsComponent } from './admin-achievements';

describe('AdminAchievements', () => {
  let component: AdminAchievementsComponent;
  let fixture: ComponentFixture<AdminAchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAchievementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAchievementsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
