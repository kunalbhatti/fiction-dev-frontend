import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandResearchComponent } from './expand-research.component';

describe('ExpandResearchComponent', () => {
  let component: ExpandResearchComponent;
  let fixture: ComponentFixture<ExpandResearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandResearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
