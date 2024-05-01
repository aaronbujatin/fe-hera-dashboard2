import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from 'app/model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  constructor(private httpClient: HttpClient) { }


  private readonly LOCAL_API = "http://localhost:8080";


  public getAllProducts(page: number, size: number) {
    let params = new HttpParams()
    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (size !== undefined) {
      params = params.set('size', size.toString());
    }
    return this.httpClient.get(`${this.LOCAL_API}/api/v1/products`, { params });
    
  }


  public saveProduct(product: Product) {
    return this.httpClient.post(`${this.LOCAL_API}/api/v1/products`, product);
  }

  public editProduct(product: Product) {
    return this.httpClient.put(`${this.LOCAL_API}/api/v1/products`, product);
  }

  public deleteProductById(id : number){
    return this.httpClient.delete(`${this.LOCAL_API}/api/v1/products/${id}`)
  }

}
