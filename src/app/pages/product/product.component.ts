import { Component, ElementRef, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Product } from 'app/model/product.model';
import { ProductService } from 'app/service/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {


  productForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private productService: ProductService, private renderer: Renderer2) {
    this.productForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      descriptions: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });
  }



  ngOnInit(): void {

    this.getAllProduct()


  }


  products: Product[]
  page: number = 1;
  pageSize: number = 10;
  public getAllProduct() {

    this.productService.getAllProducts(this.page, this.pageSize).subscribe(
      (response: any) => {
        this.products = response.content
      }, (error) => {
        console.log(error);
      }
    )
  }


  @ViewChild('createProductForm') createProductForm: NgForm;
  product: Product = new Product()
  onSubmitToSaveProduct(productForm: NgForm) {
    const product: Product = {
      id: null,
      name: productForm.value.name,
      price: productForm.value.price,
      imageUrl: productForm.value.imageUrl.split(','),
      descriptions: productForm.value.descriptions.split(','),
      stock: productForm.value.stock,
      brand: productForm.value.brand,
      category: productForm.value.category,
    }
    this.productService.saveProduct(product).subscribe(
      (response) => {
        console.log(response);
        this.getAllProduct();
        this.productImageString = ""
        this.productDescString = ""
        this.createProductForm.resetForm();
        this.closeModalAfterRequest()
      }, (error) => {
        console.log(error);
      }
    )
  }



  @ViewChild('closeButton ') closeButton !: ElementRef;
  closeModalAfterRequest() {
    this.closeButton.nativeElement.click();
  }

  @ViewChild('updateCloseButton') updateCloseButton !: ElementRef;
  closeModalAfterRequest2() {
    this.updateCloseButton.nativeElement.click();
  }

  @ViewChild('deleteCloseButton') deleteCloseButton !: ElementRef;
  closeDeleteModalAfterRequest() {
    this.deleteCloseButton.nativeElement.click();
  }

  productImageString: string
  productDescString: string
  @ViewChild('updateProductForm') updateProductForm: NgForm;
  editProduct: Product = new Product()
  onClickToEditProduct(productForm: NgForm) {

    const product: Product = {
      id: productForm.value.id,
      name: productForm.value.name,
      price: productForm.value.price,
      imageUrl: productForm.value.imageUrl.split(','),
      descriptions: productForm.value.descriptions.split(','),
      stock: productForm.value.stock,
      brand: productForm.value.brand,
      category: productForm.value.category,
    }

    this.productService.editProduct(product).subscribe(
      (response: any) => {
        this.editProduct = response
        this.getAllProduct();
        this.updateProductForm.resetForm();
        this.closeModalAfterRequest2()
      }, (error) => {
        console.log(error);
      }
    )
  }

  onClickToDeleteProduct(id: number) {
    this.productService.deleteProductById(id).subscribe(
      (response: any) => {
        console.log(response);
        this.getAllProduct()
        this.closeDeleteModalAfterRequest()

      }, (error) => {
        console.log("Product delete error : ", error);
      }
    )
  }

  productName: string
  deleteProduct: Product = new Product
  viewProduct: Product = new Product
  public onOpenModal(product: Product, mode: string) {
    const container = document.getElementById('main-container')
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (mode === 'createModal') {
      this.productImageString = ""
      this.productDescString = ""
      button.setAttribute('data-target', '#createModal');
      console.log("click");
    }
    if (mode === 'viewModal') {
      this.viewProduct = product
      button.setAttribute('data-target', '#viewModal');
    }
    if (mode === 'edit-modal') {

      this.editProduct = product
      this.productImageString = this.editProduct.imageUrl.join(',')
      this.productDescString = this.editProduct.descriptions.join(',')
      button.setAttribute('data-target', '#edit-modal');
    }
    if (mode === 'delete-modal') {
      this.deleteProduct = product
      button.setAttribute('data-target', '#delete-modal');
    }

    container.appendChild(button);
    button.click();

  }

}
