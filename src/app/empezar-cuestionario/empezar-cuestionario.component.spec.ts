import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpezarCuestionarioComponent } from './empezar-cuestionario.component';

describe('EmpezarCuestionarioComponent', () => {
  let component: EmpezarCuestionarioComponent;
  let fixture: ComponentFixture<EmpezarCuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpezarCuestionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpezarCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
