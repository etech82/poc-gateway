import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPackaging, getPackagingIdentifier } from '../packaging.model';

export type EntityResponseType = HttpResponse<IPackaging>;
export type EntityArrayResponseType = HttpResponse<IPackaging[]>;

@Injectable({ providedIn: 'root' })
export class PackagingService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/packagings', 'inventory');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(packaging: IPackaging): Observable<EntityResponseType> {
    return this.http.post<IPackaging>(this.resourceUrl, packaging, { observe: 'response' });
  }

  update(packaging: IPackaging): Observable<EntityResponseType> {
    return this.http.put<IPackaging>(`${this.resourceUrl}/${getPackagingIdentifier(packaging) as number}`, packaging, {
      observe: 'response',
    });
  }

  partialUpdate(packaging: IPackaging): Observable<EntityResponseType> {
    return this.http.patch<IPackaging>(`${this.resourceUrl}/${getPackagingIdentifier(packaging) as number}`, packaging, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPackaging>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPackaging[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPackagingToCollectionIfMissing(
    packagingCollection: IPackaging[],
    ...packagingsToCheck: (IPackaging | null | undefined)[]
  ): IPackaging[] {
    const packagings: IPackaging[] = packagingsToCheck.filter(isPresent);
    if (packagings.length > 0) {
      const packagingCollectionIdentifiers = packagingCollection.map(packagingItem => getPackagingIdentifier(packagingItem)!);
      const packagingsToAdd = packagings.filter(packagingItem => {
        const packagingIdentifier = getPackagingIdentifier(packagingItem);
        if (packagingIdentifier == null || packagingCollectionIdentifiers.includes(packagingIdentifier)) {
          return false;
        }
        packagingCollectionIdentifiers.push(packagingIdentifier);
        return true;
      });
      return [...packagingsToAdd, ...packagingCollection];
    }
    return packagingCollection;
  }
}
