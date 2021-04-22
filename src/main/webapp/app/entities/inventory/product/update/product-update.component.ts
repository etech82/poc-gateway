import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProduct, Product } from '../product.model';
import { ProductService } from '../service/product.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IProductCode } from 'app/entities/inventory/product-code/product-code.model';
import { ProductCodeService } from 'app/entities/inventory/product-code/service/product-code.service';
import { ICategory } from 'app/entities/inventory/category/category.model';
import { CategoryService } from 'app/entities/inventory/category/service/category.service';
import { IPackaging } from 'app/entities/inventory/packaging/packaging.model';
import { PackagingService } from 'app/entities/inventory/packaging/service/packaging.service';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;

  productCodesCollection: IProductCode[] = [];
  categoriesSharedCollection: ICategory[] = [];
  packagingsSharedCollection: IPackaging[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [],
    company: [],
    type: [null, [Validators.required]],
    storageType: [null, [Validators.required]],
    price: [null, [Validators.required, Validators.min(0)]],
    salesUnit: [],
    salesQuantity: [],
    image: [],
    imageContentType: [],
    status: [],
    productCode: [],
    category: [],
    packaging: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected productService: ProductService,
    protected productCodeService: ProductCodeService,
    protected categoryService: CategoryService,
    protected packagingService: PackagingService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.updateForm(product);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('gatewayApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  trackProductCodeById(index: number, item: IProductCode): number {
    return item.id!;
  }

  trackCategoryById(index: number, item: ICategory): number {
    return item.id!;
  }

  trackPackagingById(index: number, item: IPackaging): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(product: IProduct): void {
    this.editForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      company: product.company,
      type: product.type,
      storageType: product.storageType,
      price: product.price,
      salesUnit: product.salesUnit,
      salesQuantity: product.salesQuantity,
      image: product.image,
      imageContentType: product.imageContentType,
      status: product.status,
      productCode: product.productCode,
      category: product.category,
      packaging: product.packaging,
    });

    this.productCodesCollection = this.productCodeService.addProductCodeToCollectionIfMissing(
      this.productCodesCollection,
      product.productCode
    );
    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing(
      this.categoriesSharedCollection,
      product.category
    );
    this.packagingsSharedCollection = this.packagingService.addPackagingToCollectionIfMissing(
      this.packagingsSharedCollection,
      product.packaging
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productCodeService
      .query({ filter: 'product-is-null' })
      .pipe(map((res: HttpResponse<IProductCode[]>) => res.body ?? []))
      .pipe(
        map((productCodes: IProductCode[]) =>
          this.productCodeService.addProductCodeToCollectionIfMissing(productCodes, this.editForm.get('productCode')!.value)
        )
      )
      .subscribe((productCodes: IProductCode[]) => (this.productCodesCollection = productCodes));

    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing(categories, this.editForm.get('category')!.value)
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));

    this.packagingService
      .query()
      .pipe(map((res: HttpResponse<IPackaging[]>) => res.body ?? []))
      .pipe(
        map((packagings: IPackaging[]) =>
          this.packagingService.addPackagingToCollectionIfMissing(packagings, this.editForm.get('packaging')!.value)
        )
      )
      .subscribe((packagings: IPackaging[]) => (this.packagingsSharedCollection = packagings));
  }

  protected createFromForm(): IProduct {
    return {
      ...new Product(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      company: this.editForm.get(['company'])!.value,
      type: this.editForm.get(['type'])!.value,
      storageType: this.editForm.get(['storageType'])!.value,
      price: this.editForm.get(['price'])!.value,
      salesUnit: this.editForm.get(['salesUnit'])!.value,
      salesQuantity: this.editForm.get(['salesQuantity'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      status: this.editForm.get(['status'])!.value,
      productCode: this.editForm.get(['productCode'])!.value,
      category: this.editForm.get(['category'])!.value,
      packaging: this.editForm.get(['packaging'])!.value,
    };
  }
}
