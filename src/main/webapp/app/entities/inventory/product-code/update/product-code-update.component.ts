import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IProductCode, ProductCode } from '../product-code.model';
import { ProductCodeService } from '../service/product-code.service';

@Component({
  selector: 'jhi-product-code-update',
  templateUrl: './product-code-update.component.html',
})
export class ProductCodeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    upc: [null, [Validators.required]],
    barcode: [],
  });

  constructor(protected productCodeService: ProductCodeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productCode }) => {
      this.updateForm(productCode);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productCode = this.createFromForm();
    if (productCode.id !== undefined) {
      this.subscribeToSaveResponse(this.productCodeService.update(productCode));
    } else {
      this.subscribeToSaveResponse(this.productCodeService.create(productCode));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductCode>>): void {
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

  protected updateForm(productCode: IProductCode): void {
    this.editForm.patchValue({
      id: productCode.id,
      upc: productCode.upc,
      barcode: productCode.barcode,
    });
  }

  protected createFromForm(): IProductCode {
    return {
      ...new ProductCode(),
      id: this.editForm.get(['id'])!.value,
      upc: this.editForm.get(['upc'])!.value,
      barcode: this.editForm.get(['barcode'])!.value,
    };
  }
}
