import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, timeoutWith } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ProductModel } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  requestTimeout = 60000;
  apiUrl ='https://emilytan-vdw.azurewebsites.net/api/Product';
 header = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };
  constructor(private httpreq: HttpClient) {}

  getProducts(): Observable<ProductModel[]> {
    let restUrl = this.apiUrl + '/Products';
    return this.getRest(restUrl).pipe(
      map((jsonResponse) => {
        const list = new Array<ProductModel>();
        jsonResponse.forEach((index) =>
        list.push(
            new ProductModel(
              index.id,
              index.name,
              index.price,
              index.quantity,
            )
          )
        );
        return list;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getRest(resturl: string): Observable<any> {
    return this.httpreq.get(resturl, this.header).pipe(
      timeoutWith(this.requestTimeout, throwError(new Error('Server request timeout: '))),
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  deleteProduct(productID: number): Observable<any> {
    let restUrl = this.apiUrl + '/' + productID;
    return this.httpreq.delete(restUrl, this.header).pipe(
      timeoutWith(this.requestTimeout, throwError(new Error('Server request timeout: ' + restUrl))),
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  addProduct(postBody): Observable<any> {
    let restUrl = this.apiUrl + '/Product';
    return this.httpreq.post(restUrl, postBody, this.header).pipe(
      timeoutWith(this.requestTimeout, throwError(new Error('Server request timeout: ' + restUrl))),
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  editProduct(postBody): Observable<any> {
    let restUrl = this.apiUrl + '/Product';
    return this.httpreq.put(restUrl, postBody, this.header).pipe(
      timeoutWith(this.requestTimeout, throwError(new Error('Server request timeout: ' + restUrl))),
      catchError((e) => {
        return throwError(e);
      })
    );
  }
}