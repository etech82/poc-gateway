import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PackagingService } from '../service/packaging.service';

import { PackagingComponent } from './packaging.component';

describe('Component Tests', () => {
  describe('Packaging Management Component', () => {
    let comp: PackagingComponent;
    let fixture: ComponentFixture<PackagingComponent>;
    let service: PackagingService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PackagingComponent],
      })
        .overrideTemplate(PackagingComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PackagingComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PackagingService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.packagings?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
