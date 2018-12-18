import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, translateService: TranslateService) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
        let lang = navigator.language.split('-')[0];
        translateService.setDefaultLang('en');
        translateService.use(lang);

        statusBar.styleDefault();

        if (platform.is('android')) {
            statusBar.backgroundColorByHexString('#0099cc');
        }

        splashScreen.hide();
    });
  }
}

