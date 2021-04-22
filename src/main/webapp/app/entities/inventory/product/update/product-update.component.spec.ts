jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProductService } from '../service/product.service';
import { IProduct, Product } from '../product.model';
import { IProductCode } from 'app/entities/inventory/product-code/product-code.model';
import { ProductCodeService } from 'app/entities/inventory/product-code/service/product-code.service';
import { ICategory } from 'app/entities/inventory/category/category.model';
import { CategoryService } from 'app/entities/inventory/category/service/category.service';
import { IPackaging } from 'app/entities/inventory/packaging/packaging.model';
import { PackagingService } from 'app/entities/inventory/packaging/service/packaging.service';

import { ProductUpdateComponent } from './product-update.component';

describe('Component Tests', () => {
  describe('Product Management Update Component', () => {
    let comp: ProductUpdateComponent;
    let fixture: ComponentFixture<ProductUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let productService: ProductService;
    let productCodeService: ProductCodeService;
    let categoryService: CategoryService;
    let packagingService: PackagingService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProductUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProductUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      productService = TestBed.inject(ProductService);
      productCodeService = TestBed.inject(ProductCodeService);
      categoryService = TestBed.inject(CategoryService);
      packagingService = TestBed.inject(PackagingService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call productCode query and add missing value', () => {
        const product: IProduct = { id: 456 };
        const productCode: IProductCode = { id: 49898 };
        product.productCode = productCode;

        const productCodeCollection: IProductCode[] = [{ id: 85748 }];
        spyOn(productCodeService, 'query').and.returnValue(of(new HttpResponse({ body: productCodeCollection })));
        const expectedCollection: IProductCode[] = [productCode, ...productCodeCollection];
        spyOn(productCodeService, 'addProductCodeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ product });
        comp.ngOnInit();

        expect(productCodeService.query).toHaveBeenCalled();
        expect(productCodeService.addProductCodeToCollectionIfMissing).toHaveBeenCalledWith(productCodeCollection, productCode);
        expect(comp.productCodesCollection).toEqual(expectedCollection);
      });

      it('Should call Category query and add missing value', () => {
        const product: IProduct = { id: 456 };
        const category: ICategory = { id: 47527 };
        product.category = category;

        const categoryCollection: ICategory[] = [{ id: 31264 }];
        spyOn(categoryService, 'query').and.returnValue(of(new HttpResponse({ body: categoryCollection })));
        const additionalCategories = [category];
        const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
        spyOn(categoryService, 'addCategoryToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ product });
        comp.ngOnInit();

        expect(categoryService.query).toHaveBeenCalled();
        expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(categoryCollection, ...additionalCategories);
        expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Packaging query and add missing value', () => {
        const product: IProduct = { id: 456 };
        const packaging: IPackaging = { id: 31683 };
        product.packaging = packaging;

        const packagingCollection: IPackaging[] = [{ id: 41397 }];
        spyOn(packagingService, 'query').and.returnValue(of(new HttpResponse({ body: packagingCollection })));
        const additionalPackagings = [packaging];
        const expectedCollection: IPackaging[] = [...additionalPackagings, ...packagingCollection];
        spyOn(packagingService, 'addPackagingToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ product });
        comp.ngOnInit();

        expect(packagingService.query).toHaveBeenCalled();
        expect(packagingService.addPackagingToCollectionIfMissing).toHaveBeenCalledWith(packagingCollection, ...additionalPackagings);
        expect(comp.packagingsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const product: IProduct = { id: 456 };
        const productCode: IProductCode = { id: 41775 };
        product.productCode = productCode;
        const category: ICategory = { id: 80199 };
        product.category = category;
        const packaging: IPackaging = { id: 31593 };
        product.packaging = packaging;

        activatedRoute.data = of({ product });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(product));
        expect(comp.productCodesCollection).toContain(productCode);
        expect(comp.categoriesSharedCollection).toContain(category);
        expect(comp.packagingsSharedCollection).toContain(packaging);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const product = { id: 123 };
        spyOn(productService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ product });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: product }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(productService.update).toHaveBeenCalledWith(product);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const product = new Product();
        spyOn(productService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ product });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: product }));
        saveSubject.complete();

        // THEN
        expect(productService.create).toHaveBeenCalledWith(product);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const product = { id: 123 };
        spyOn(productService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ product });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(productService.update).toHaveBeenCalledWith(product);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackProductCodeById', () => {
        it('Should return tracked ProductCode primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProductCodeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCategoryById', () => {
        it('Should return tracked Category primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCategoryById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPackagingById', () => {
        it('Should return tracked Packaging primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPackagingById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
