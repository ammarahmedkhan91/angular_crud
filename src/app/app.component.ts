import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from './data-type';
import { ProductService } from './service/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'crud-app';
  products: Product[] | undefined;

  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness', 'price', 'comment', 'action'];
  dataSource!: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '500px'
    });
  }

  getProducts() {
    this.productService.getAllProducts().subscribe((res: Product[] | undefined) => {
      this.products = res;
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  editProduct(obj: any) {
    let index = this.products?.indexOf(obj);
    this.dialog.open(DialogComponent, {
      width: '500px',
      data: [index, obj]
    });
  }

  deleteProduct(row: any) {
    let index = this.products?.indexOf(row);
    if (index || index === 0) {
      this.products && this.products.splice(index, 1);
    };
    localStorage.setItem("products", JSON.stringify(this.products));
    this.getProducts();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
