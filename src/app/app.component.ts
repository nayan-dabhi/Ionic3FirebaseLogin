import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import * as firebase from 'firebase';

import { AuthProvider } from '../providers/AuthProvider';
import { AppConfig, AppMsgConfig } from '../providers/AppConfig';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html'
})


export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public authService: AuthProvider,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      var config = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: ""
      };

      firebase.initializeApp(config);

      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          this.rootPage = LoginPage;
          unsubscribe();
        } else {
          this.authService.setUserId(user.uid);
          this.authService.setUserEmail(user.email);
          this.rootPage = HomePage;
          unsubscribe();
        }
      });
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  doLogout(){
    if (this.appConfig.hasConnection()) {
      firebase.auth().signOut();

      setTimeout(()=> {
        this.nav.setRoot(LoginPage);
      }, 1000);
    } else {
      this.appConfig.showToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000, true, "Ok", true);
    }
  }

}
