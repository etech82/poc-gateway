import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILocation, Location } from '../location.model';
import { LocationService } from '../service/location.service';
import { IAddress } from 'app/entities/purchasing/address/address.model';
import { AddressService } from 'app/entities/purchasing/address/service/address.service';

@Component({
  selector: 'jhi-location-update',
  templateUrl: './location-update.component.html',
})
export class LocationUpdateComponent implements OnInit {
  isSaving = false;

  addressesCollection: IAddress[] = [];

  editForm = this.fb.group({
    id: [],
    locationNumber: [null, [Validators.required]],
    locationName: [null, [Validators.required]],
    location: [],
    city: [],
    state: [],
    county: [],
    phoneNumber: [null, [Validators.required]],
    pharmacyHours: [null, [Validators.required]],
    type: [null, [Validators.required]],
    address: [],
  });

  constructor(
    protected locationService: LocationService,
    protected addressService: AddressService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ location }) => {
      this.updateForm(location);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const location = this.createFromForm();
    if (location.id !== undefined) {
      this.subscribeToSaveResponse(this.locationService.update(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.create(location));
    }
  }

  trackAddressById(index: number, item: IAddress): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocation>>): void {
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

  protected updateForm(location: ILocation): void {
    this.editForm.patchValue({
      id: location.id,
      locationNumber: location.locationNumber,
      locationName: location.locationName,
      location: location.location,
      city: location.city,
      state: location.state,
      county: location.county,
      phoneNumber: location.phoneNumber,
      pharmacyHours: location.pharmacyHours,
      type: location.type,
      address: location.address,
    });

    this.addressesCollection = this.addressService.addAddressToCollectionIfMissing(this.addressesCollection, location.address);
  }

  protected loadRelationshipsOptions(): void {
    this.addressService
      .query({ filter: 'location-is-null' })
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(
        map((addresses: IAddress[]) => this.addressService.addAddressToCollectionIfMissing(addresses, this.editForm.get('address')!.value))
      )
      .subscribe((addresses: IAddress[]) => (this.addressesCollection = addresses));
  }

  protected createFromForm(): ILocation {
    return {
      ...new Location(),
      id: this.editForm.get(['id'])!.value,
      locationNumber: this.editForm.get(['locationNumber'])!.value,
      locationName: this.editForm.get(['locationName'])!.value,
      location: this.editForm.get(['location'])!.value,
      city: this.editForm.get(['city'])!.value,
      state: this.editForm.get(['state'])!.value,
      county: this.editForm.get(['county'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      pharmacyHours: this.editForm.get(['pharmacyHours'])!.value,
      type: this.editForm.get(['type'])!.value,
      address: this.editForm.get(['address'])!.value,
    };
  }
}
