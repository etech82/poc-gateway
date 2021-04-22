jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProductCodeService } from '../service/product-code.service';
import { IProductCode, ProductCode } from '../product-code.model';

import { ProductCodeUpdateComponent } from './product-code-update.component';

describe('Component Tests', () => {
  describe('ProductCode Management Update Component', () => {
    let comp: ProductCodeUpdateComponent;
    let fixture: ComponentFixture<ProductCodeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let productCodeService: ProductCodeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProductCodeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProductCodeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductCodeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      productCodeService = TestBed.inject(ProductCodeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const productCode: IProductCode = { id: 456 };

        activatedRoute.data = of({ productCode });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(productCode));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const productCode = { id: 123 };
        spyOn(productCodeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ productCode });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: productCode }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(productCodeService.update).toHaveBeenCalledWith(productCode);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const productCode = new ProductCode();
        spyOn(productCodeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ productCode });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: productCode }));
        saveSubject.complete();

        // THEN
        expect(productCodeService.create).toHaveBeenCalledWith(productCode);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const productCode = { id: 123 };
        spyOn(productCodeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ productCode });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(productCodeService.update).toHaveBeenCalledWith(productCode);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
