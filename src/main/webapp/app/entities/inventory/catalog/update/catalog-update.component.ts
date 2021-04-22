import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICatalog, Catalog } from '../catalog.model';
import { CatalogService } from '../service/catalog.service';
import { IProduct } from 'app/entities/inventory/product/product.model';
import { ProductService } from 'app/entities/inventory/product/service/product.service';

@Component({
  selector: 'jhi-catalog-update',
  templateUrl: './catalog-update.component.html',
})
export class CatalogUpdateComponent implements OnInit {
  isSaving = false;

  productsSharedCollection: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    status: [null, [Validators.required]],
    productCodes: [],
  });

  constructor(
    protected catalogService: CatalogService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ catalog }) => {
      this.updateForm(catalog);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const catalog = this.createFromForm();
    if (catalog.id !== undefined) {
      this.subscribeToSaveResponse(this.catalogService.update(catalog));
    } else {
      this.subscribeToSaveResponse(this.catalogService.create(catalog));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  getSelectedProduct(option: IProduct, selectedVals?: IProduct[]): IProduct {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICatalog>>): void {
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

  protected updateForm(catalog: ICatalog): void {
    this.editForm.patchValue({
      id: catalog.id,
      code: catalog.code,
      status: catalog.status,
      productCodes: catalog.productCodes,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      ...(catalog.productCodes ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) =>
          this.productService.addProductToCollectionIfMissing(products, ...(this.editForm.get('productCodes')!.value ?? []))
        )
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }

  protected createFromForm(): ICatalog {
    return {
      ...new Catalog(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      status: this.editForm.get(['status'])!.value,
      productCodes: this.editForm.get(['productCodes'])!.value,
    };
  }
}
