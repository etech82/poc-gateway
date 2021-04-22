import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPackaging, Packaging } from '../packaging.model';
import { PackagingService } from '../service/packaging.service';

@Component({
  selector: 'jhi-packaging-update',
  templateUrl: './packaging-update.component.html',
})
export class PackagingUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    quantity: [null, [Validators.required]],
    grosWeight: [],
    netWeight: [],
    length: [],
    width: [],
    height: [],
  });

  constructor(protected packagingService: PackagingService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ packaging }) => {
      this.updateForm(packaging);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const packaging = this.createFromForm();
    if (packaging.id !== undefined) {
      this.subscribeToSaveResponse(this.packagingService.update(packaging));
    } else {
      this.subscribeToSaveResponse(this.packagingService.create(packaging));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPackaging>>): void {
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

  protected updateForm(packaging: IPackaging): void {
    this.editForm.patchValue({
      id: packaging.id,
      name: packaging.name,
      quantity: packaging.quantity,
      grosWeight: packaging.grosWeight,
      netWeight: packaging.netWeight,
      length: packaging.length,
      width: packaging.width,
      height: packaging.height,
    });
  }

  protected createFromForm(): IPackaging {
    return {
      ...new Packaging(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      grosWeight: this.editForm.get(['grosWeight'])!.value,
      netWeight: this.editForm.get(['netWeight'])!.value,
      length: this.editForm.get(['length'])!.value,
      width: this.editForm.get(['width'])!.value,
      height: this.editForm.get(['height'])!.value,
    };
  }
}
