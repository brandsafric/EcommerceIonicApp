import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { ProductDetailsPage } from '../product-details/product-details'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  WooCommerce: any;
  products: any[];
  page: number;
  moreProducts: any[];

@ViewChild('productSlides') productSlides: Slides;

  constructor(public navCtrl: NavController) {
    this.page=2;
    this.WooCommerce= WC({
      url: "http://tusharstar.freesite.host/",
      consumerKey: "ck_73590d39934e4835534066f5984462791dc03cec",
      consumerSecret: "cs_8251fd275d342482aaace2abdd0e5b32d5b2d501"
    });
    this.loadMoreProducts();

    this.WooCommerce.getAsync("products").then( (data) => {
        console.log(JSON.parse(data.body));
        this.products= JSON.parse(data.body).products;
    }, (err) => { 
      console.log(err)
    })
  
  
  }
  ionViewDidLoad(){
    setInterval(()=> {
     if(this.productSlides.getActiveIndex() == this.productSlides.length() -1)
     this.productSlides.slideTo(0);
      this.productSlides.slideNext();
    }, 3000)
  }

  loadMoreProducts(){
    this.WooCommerce.getAsync("products?page=" + this.page).then( (data) => {
      console.log(JSON.parse(data.body));
      this.moreProducts= JSON.parse(data.body).products;
  }, (err) => { 
    console.log(err)
  })


  }
  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage, {"product": product});
  }

}
