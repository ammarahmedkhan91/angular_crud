import { Injectable } from '@angular/core';
import { Product } from '../data-type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productData = new BehaviorSubject<Product[]>([]); 
  constructor() { }

  getAllProducts() {
    let localProducts = localStorage.getItem("products");
    localProducts && this.productData.next((JSON.parse(localProducts)));
    return this.productData.asObservable();
  }

}
