import { Component } from '@angular/core';
import { ProductModel } from './product.model';
import { ApiService } from './api.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dataTable = new Array<ProductModel>();
  error = false;
  loading = true;
  addOrEdit = "Create";
  productForm: FormGroup;
  // Subscription
  getSub: Subscription;
  addSub: Subscription;
  editSub: Subscription;
  deleteSub: Subscription;

  constructor(private apiService: ApiService) {
    this.productForm = new FormGroup({
      id: new FormControl('', [], []),
      name: new FormControl('', []),
      price: new FormControl('', []),
      quantity: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.readProductList();
  }

  ngOnDestroy() {
    if (this.getSub) {
      this.getSub.unsubscribe();
    }
    if (this.addSub) {
      this.addSub.unsubscribe();
    }
    if (this.editSub) {
      this.editSub.unsubscribe();
    }
    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
  }

  readProductList() {
    this.loading = true;
    this.getSub = this.apiService.getProducts().subscribe(
      (resp) => {
        this.dataTable = resp;
      },
      (err) => {
        this.error = true;
        this.loading = false;
      },
      () => {
        this.error = false;
        this.loading = false;
      }
    );
  }

  addProduct(){
    this.addOrEdit = "Create";
    this.productForm = new FormGroup({
      id: new FormControl('', [], []),
      name: new FormControl('', []),
      price: new FormControl('', []),
      quantity: new FormControl('', []),
    });
  }

  editProduct(product: ProductModel) {
    this.addOrEdit = "Update";
    this.productForm = new FormGroup({
      id: new FormControl(product.id, [], []),
      name: new FormControl(product.name, []),
      price: new FormControl(product.price, []),
      quantity: new FormControl(product.quantity, []),
    });
    console.log('productForm', this.productForm);
  }

  addEditProduct(data) {
    let body = JSON.stringify(data);
    if (this.addOrEdit === "Create") {
      this.addSub = this.apiService.addProduct(body).subscribe(
        (resp) => {
          this.readProductList();
        },
        (err) => {
          this.error = true;
        },
        () => {
          this.error = false;
        }
      );
    } else if (this.addOrEdit === "Update") {
      this.editSub = this.apiService.editProduct(body).subscribe(
        (resp) => {
          this.readProductList();
        },
        (err) => {
          this.error = true;
        },
        () => {
          this.error = false;
        }
      );
    }
  }

  deleteProduct(id) {
    this.deleteSub = this.apiService.deleteProduct(id)
      .subscribe(resp => {
        this.readProductList();
      }, (err) => {
        this.error = true;
        throw (err);
      }, () => {
        this.error = true;
      });
  }

}
