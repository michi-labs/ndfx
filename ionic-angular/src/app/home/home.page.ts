import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public delegation: { [key: string]: any } = {};

  constructor(private alertController: AlertController) {}

  public async openBrowser() {
    const browser = window.open(
      'http://127.0.0.1:8000/?canisterId=bkyz2-fmaaa-aaaaa-qaaaq-cai',
      '__blank'
    );
    window.addEventListener('message', (event) => {
      console.log({ event });

      if (event.data?.type === 'auth-success') {
        this.delegation = event.data.delegation;
        browser?.close();
        // TODO: Remove listener
      }
    });
    // await Browser.open({
    //   url: 'https://pwa-test-f4d54.web.app',
    //   windowName: 'myWindow',
    // });

    // Browser.addListener('browserFinished', () => {
    //   console.log('browser exited');
    //   this.presentAlert();
    // });
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
