import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { CartPage } from '../cart/cart';

import * as WC from 'woocommerce-api';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  WooCommerce: any;
  homePage: any;
  categories: any[];
  @ViewChild('content') childNavCtrl: NavController;
  loggedIn: boolean;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController) {
    this.homePage = HomePage
    this.categories = [];
    this.user = {};

    this.WooCommerce= WC({
      url: "http://tusharstar.freesite.host/",
      consumerKey: "ck_73590d39934e4835534066f5984462791dc03cec",
      consumerSecret: "cs_8251fd275d342482aaace2abdd0e5b32d5b2d501"
    });

    this.WooCommerce.getAsync("products/categories").then( (data) => {
      console.log(JSON.parse(data.body).product_categories); 

      let temp: any[] = JSON.parse(data.body).product_categories;
      for(let i=0; i < temp.length; i++){
        if(temp[i].parent == 0){

          if(temp[i].slug == "accessories"){
            temp[i].icon = "rose"; 
          }
          if(temp[i].slug == "hoodies"){
            temp[i].icon = "headset"; 
          }
          if(temp[i].slug == "tshirts"){
            temp[i].icon = "shirt"; 
          }

          this.categories.push(temp[i]); 
        }
      }

  }, (err) => { 
    console.log(err)
  })


  }

  ionViewDidEnter() {
    
    this.storage.ready().then( () => {
      this.storage.get("userLoginInfo").then( (userLoginInfo) => {

        if(userLoginInfo != null){

          console.log("User logged in...");
          this.user = userLoginInfo.user;
          console.log(this.user);
          this.loggedIn = true;
        }
        else {
          console.log("No user found.");
          this.user = {};
          this.loggedIn = false;
        }

      })
    })


  }


  openCategoryPage(category){
    this.childNavCtrl.setRoot(ProductsByCategoryPage, {"category": category});
  }


  openPage(pageName: string){
    if(pageName == "signup"){
      this.navCtrl.push(SignupPage);
    }
    if(pageName == "login"){
      this.navCtrl.push(LoginPage);
    }
    if(pageName == 'logout'){
      this.storage.remove("userLoginInfo").then( () => {
        this.user = {};
        this.loggedIn = false;
      })
    }
    if(pageName == 'cart'){
      let modal = this.modalCtrl.create(CartPage);
      modal.present();
    }

  }

}
