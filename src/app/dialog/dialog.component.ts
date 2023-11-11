import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../data-type';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Brand New", "Second Hand", "Refurbished", "Fresh", "Stale"];
  productForm !: FormGroup;
  addProducts: any;
  product: Product[] = [];
  actionBtn: string = 'Save';

  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private productService: ProductService) { }

  ngOnInit(): void {

    let localProducts = localStorage.getItem('products');
    if (localProducts) {
      let parseLocalData = localProducts && JSON.parse(localProducts);
      this.product = parseLocalData;
    };

    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      date: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required]
    });

    if (this.editData) {
      this.actionBtn = 'Update';
      this.productForm.controls['productName'].setValue(this.editData[1].productName);
      this.productForm.controls['category'].setValue(this.editData[1].category);
      this.productForm.controls['date'].setValue(this.editData[1].date);
      this.productForm.controls['freshness'].setValue(this.editData[1].freshness);
      this.productForm.controls['price'].setValue(this.editData[1].price);
      this.productForm.controls['comment'].setValue(this.editData[1].comment);
    };

  }

  addProuct() {
    if (!this.editData) {
      if (this.productForm) {
        this.product.push(this.productForm.value);
        localStorage.setItem("products", JSON.stringify(this.product));
        // alert('Product added successfully');
        this.productService.getAllProducts();
        this.productForm.reset();
        this.dialogRef.close();
      } else {
        alert('Error while adding the product');
      }
    } else {
      let index = this.editData[0];
      let localProducts = localStorage.getItem("products");
      let parseData = [];
      parseData = localProducts && JSON.parse(localProducts);
      parseData[index] = this.productForm.value;
      localStorage.setItem("products", JSON.stringify(parseData));
      this.productService.getAllProducts();
      this.productForm.reset();
      this.dialogRef.close();
    }
  }

}
