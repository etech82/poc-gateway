import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PackagingDetailComponent } from './packaging-detail.component';

describe('Component Tests', () => {
  describe('Packaging Management Detail Component', () => {
    let comp: PackagingDetailComponent;
    let fixture: ComponentFixture<PackagingDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PackagingDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ packaging: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PackagingDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PackagingDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load packaging on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.packaging).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
