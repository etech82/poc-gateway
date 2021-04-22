import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductCode, getProductCodeIdentifier } from '../product-code.model';

export type EntityResponseType = HttpResponse<IProductCode>;
export type EntityArrayResponseType = HttpResponse<IProductCode[]>;

@Injectable({ providedIn: 'root' })
export class ProductCodeService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/product-codes', 'inventory');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(productCode: IProductCode): Observable<EntityResponseType> {
    return this.http.post<IProductCode>(this.resourceUrl, productCode, { observe: 'response' });
  }

  update(productCode: IProductCode): Observable<EntityResponseType> {
    return this.http.put<IProductCode>(`${this.resourceUrl}/${getProductCodeIdentifier(productCode) as number}`, productCode, {
      observe: 'response',
    });
  }

  partialUpdate(productCode: IProductCode): Observable<EntityResponseType> {
    return this.http.patch<IProductCode>(`${this.resourceUrl}/${getProductCodeIdentifier(productCode) as number}`, productCode, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProductCode>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductCode[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProductCodeToCollectionIfMissing(
    productCodeCollection: IProductCode[],
    ...productCodesToCheck: (IProductCode | null | undefined)[]
  ): IProductCode[] {
    const productCodes: IProductCode[] = productCodesToCheck.filter(isPresent);
    if (productCodes.length > 0) {
      const productCodeCollectionIdentifiers = productCodeCollection.map(productCodeItem => getProductCodeIdentifier(productCodeItem)!);
      const productCodesToAdd = productCodes.filter(productCodeItem => {
        const productCodeIdentifier = getProductCodeIdentifier(productCodeItem);
        if (productCodeIdentifier == null || productCodeCollectionIdentifiers.includes(productCodeIdentifier)) {
          return false;
        }
        productCodeCollectionIdentifiers.push(productCodeIdentifier);
        return true;
      });
      return [...productCodesToAdd, ...productCodeCollection];
    }
    return productCodeCollection;
  }
}
