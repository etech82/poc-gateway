jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PackagingService } from '../service/packaging.service';
import { IPackaging, Packaging } from '../packaging.model';

import { PackagingUpdateComponent } from './packaging-update.component';

describe('Component Tests', () => {
  describe('Packaging Management Update Component', () => {
    let comp: PackagingUpdateComponent;
    let fixture: ComponentFixture<PackagingUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let packagingService: PackagingService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PackagingUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PackagingUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PackagingUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      packagingService = TestBed.inject(PackagingService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const packaging: IPackaging = { id: 456 };

        activatedRoute.data = of({ packaging });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(packaging));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const packaging = { id: 123 };
        spyOn(packagingService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ packaging });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: packaging }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(packagingService.update).toHaveBeenCalledWith(packaging);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const packaging = new Packaging();
        spyOn(packagingService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ packaging });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: packaging }));
        saveSubject.complete();

        // THEN
        expect(packagingService.create).toHaveBeenCalledWith(packaging);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const packaging = { id: 123 };
        spyOn(packagingService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ packaging });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(packagingService.update).toHaveBeenCalledWith(packaging);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
