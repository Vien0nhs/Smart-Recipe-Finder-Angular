import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OAuthButtonComponent } from './oauth-button.component';

describe('OAuthButtonComponent', () => {
  let component: OAuthButtonComponent;
  let fixture: ComponentFixture<OAuthButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OAuthButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OAuthButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
