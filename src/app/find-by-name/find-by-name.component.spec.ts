import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindByNameComponent } from './find-by-name.component';

describe('FindByNameComponent', () => {
  let component: FindByNameComponent;
  let fixture: ComponentFixture<FindByNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindByNameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindByNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
