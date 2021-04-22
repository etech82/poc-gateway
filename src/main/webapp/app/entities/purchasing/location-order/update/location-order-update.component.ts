import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ILocationOrder, LocationOrder } from '../location-order.model';
import { LocationOrderService } from '../service/location-order.service';
import { ILocation } from 'app/entities/purchasing/location/location.model';
import { LocationService } from 'app/entities/purchasing/location/service/location.service';

@Component({
  selector: 'jhi-location-order-update',
  templateUrl: './location-order-update.component.html',
})
export class LocationOrderUpdateComponent implements OnInit {
  isSaving = false;

  locationsSharedCollection: ILocation[] = [];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    placedDate: [null, [Validators.required]],
    status: [null, [Validators.required]],
    invoiceId: [],
    location: [],
  });

  constructor(
    protected locationOrderService: LocationOrderService,
    protected locationService: LocationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ locationOrder }) => {
      if (locationOrder.id === undefined) {
        const today = dayjs().startOf('day');
        locationOrder.placedDate = today;
      }

      this.updateForm(locationOrder);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const locationOrder = this.createFromForm();
    if (locationOrder.id !== undefined) {
      this.subscribeToSaveResponse(this.locationOrderService.update(locationOrder));
    } else {
      this.subscribeToSaveResponse(this.locationOrderService.create(locationOrder));
    }
  }

  trackLocationById(index: number, item: ILocation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocationOrder>>): void {
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

  protected updateForm(locationOrder: ILocationOrder): void {
    this.editForm.patchValue({
      id: locationOrder.id,
      code: locationOrder.code,
      placedDate: locationOrder.placedDate ? locationOrder.placedDate.format(DATE_TIME_FORMAT) : null,
      status: locationOrder.status,
      invoiceId: locationOrder.invoiceId,
      location: locationOrder.location,
    });

    this.locationsSharedCollection = this.locationService.addLocationToCollectionIfMissing(
      this.locationsSharedCollection,
      locationOrder.location
    );
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query()
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) =>
          this.locationService.addLocationToCollectionIfMissing(locations, this.editForm.get('location')!.value)
        )
      )
      .subscribe((locations: ILocation[]) => (this.locationsSharedCollection = locations));
  }

  protected createFromForm(): ILocationOrder {
    return {
      ...new LocationOrder(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      placedDate: this.editForm.get(['placedDate'])!.value ? dayjs(this.editForm.get(['placedDate'])!.value, DATE_TIME_FORMAT) : undefined,
      status: this.editForm.get(['status'])!.value,
      invoiceId: this.editForm.get(['invoiceId'])!.value,
      location: this.editForm.get(['location'])!.value,
    };
  }
}
