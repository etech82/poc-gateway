jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CatalogService } from '../service/catalog.service';
import { ICatalog, Catalog } from '../catalog.model';
import { IProduct } from 'app/entities/inventory/product/product.model';
import { ProductService } from 'app/entities/inventory/product/service/product.service';

import { CatalogUpdateComponent } from './catalog-update.component';

describe('Component Tests', () => {
  describe('Catalog Management Update Component', () => {
    let comp: CatalogUpdateComponent;
    let fixture: ComponentFixture<CatalogUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let catalogService: CatalogService;
    let productService: ProductService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CatalogUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CatalogUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CatalogUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      catalogService = TestBed.inject(CatalogService);
      productService = TestBed.inject(ProductService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Product query and add missing value', () => {
        const catalog: ICatalog = { id: 456 };
        const productCodes: IProduct[] = [{ id: 33671 }];
        catalog.productCodes = productCodes;

        const productCollection: IProduct[] = [{ id: 19552 }];
        spyOn(productService, 'query').and.returnValue(of(new HttpResponse({ body: productCollection })));
        const additionalProducts = [...productCodes];
        const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
        spyOn(productService, 'addProductToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ catalog });
        comp.ngOnInit();

        expect(productService.query).toHaveBeenCalled();
        expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
        expect(comp.productsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const catalog: ICatalog = { id: 456 };
        const productCodes: IProduct = { id: 92047 };
        catalog.productCodes = [productCodes];

        activatedRoute.data = of({ catalog });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(catalog));
        expect(comp.productsSharedCollection).toContain(productCodes);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const catalog = { id: 123 };
        spyOn(catalogService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ catalog });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: catalog }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(catalogService.update).toHaveBeenCalledWith(catalog);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const catalog = new Catalog();
        spyOn(catalogService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ catalog });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: catalog }));
        saveSubject.complete();

        // THEN
        expect(catalogService.create).toHaveBeenCalledWith(catalog);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const catalog = { id: 123 };
        spyOn(catalogService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ catalog });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(catalogService.update).toHaveBeenCalledWith(catalog);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackProductById', () => {
        it('Should return tracked Product primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProductById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedProduct', () => {
        it('Should return option if no Product is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedProduct(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Product for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedProduct(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Product is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedProduct(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
