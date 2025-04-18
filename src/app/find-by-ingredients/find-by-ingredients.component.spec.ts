import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindByIngredientsComponent } from './find-by-ingredients.component';

describe('FindByIngredientsComponent', () => {
  let component: FindByIngredientsComponent;
  let fixture: ComponentFixture<FindByIngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindByIngredientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindByIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
