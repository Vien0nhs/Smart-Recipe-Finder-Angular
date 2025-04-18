import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindByTypeComponent } from './find-by-type.component';

describe('FindByTypeComponent', () => {
  let component: FindByTypeComponent;
  let fixture: ComponentFixture<FindByTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindByTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
