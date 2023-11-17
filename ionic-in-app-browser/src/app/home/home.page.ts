import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private alertController: AlertController) {}

  public async openBrowser() {
    await Browser.open({
      url: 'https://pwa-test-f4d54.web.app',
      windowName: 'myWindow',
    });

    Browser.addListener('browserFinished', () => {
      console.log('browser exited');
      this.presentAlert();
    });
  }

  public closeBrowser() {
    Browser.close();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Browser',
      message: 'browser exited',
    });

    await alert.present();
  }
}
