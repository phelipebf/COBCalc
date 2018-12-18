import { Component } from '@angular/core';
import { AlertController, NavController, Platform } from 'ionic-angular';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    numberOfCobs = [];
    correnteAmp = [];
    correnteAmpMid = [];
    modelosChip = [];

    buttonDisabled = true;

    chipCob = '';
    corrente = '';
    numCobs;
    area;
    eficienciaDriver;

    totalWattage;
    PPFD;
    totalPPF;
    totalCobWattage;
    totalVoltageForward;
    cobVoltageForward;
    totalLumens;
    totalParWatts;
    cobEfficiency;

    midPower = false;

    mostraResultado = false;

    color;

    msgInfoInsuficiente = 'Informações não disponíveis para essa corrente (mA) e chip. Por favor altere a seleção.';

    private urlParameters: Array<any> = [];


    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public plt: Platform) {

        this.getUrlParams();

        this.numberOfCobs = [
            '1', '2', '3', '4', '5', '6', '7',
            '8', '9', '10', '11', '12', '13', '14',
            '15', '16', '17', '18', '19', '20',
        ];

        this.correnteAmp = [
            '350 mA', '700 mA', '1050 mA', '1200 mA', '1400 mA', '2100 mA',
            '2400 mA', '2800 mA', '3600 mA'
        ];

        this.correnteAmpMid = [
            '65 mA', '700 mA', '1050 mA', '1200 mA', '1400 mA', '2100 mA',
            '2400 mA', '2800 mA', '3600 mA'
        ];

        this.modelosChip = [
            'CLU048.1212.CRI80.3500K', 'CLU048.1212.CRI90.3500K', 'CLU048.1212.CRI80.4000K', 'CLU048.1212.CRI90.4000K',

            "CXB3590.CD.36V.3500K", "CXB3590.DD.36V.5000K", /*"CXB3590.CD.72V.3000K", "CXB3590.CD.72V.3500K",*/
            /*"CXB3070.AD.3000K", "CXA3070.AB.3000K",*/

            "VERO29.GEN7.3000K", "VERO29.GEN7.3500K", "VERO29.GEN7.4000K", "VERO29.GEN7.5000K",
            /*"VERO18.GEN7.4000K",*/

            'LM561C.AY.S6.CRI80.3500K', 'LM561C.CRI90.3500K'
        ];
    }

    getUrlParams() {

        if (document.URL.indexOf("?") > 0) {
            let splitURL = document.URL.split("?");
            let splitParams = splitURL[1].split("&");
            let i: any;
            let cont = 0;
            for (i in splitParams){
                let singleURLParam = splitParams[i].split('=');

                if(singleURLParam[0] == 'chip') this.chipCob = singleURLParam[1];
                if(singleURLParam[0] == 'ma') this.corrente = singleURLParam[1] + ' mA';
                if(singleURLParam[0] == 'qt') this.numCobs = singleURLParam[1];
                if(singleURLParam[0] == 'ar') this.area = singleURLParam[1];
                if(singleURLParam[0] == 'efc') this.eficienciaDriver = singleURLParam[1];

                let urlParameter = {
                    'name': singleURLParam[0],
                    'value': singleURLParam[1]
                };
                this.urlParameters.push(urlParameter);

                cont++;
            }

            if(cont >= 5) {
                this.validate();
                this.calcular(true);
            }
        }
    }

    validate() {
        if(this.chipCob != '' && this.corrente != '' && this.numCobs != null && this.area != null && this.eficienciaDriver != null) {
            this.buttonDisabled = false;
        }
        else {
            this.buttonDisabled = true;
        }

        if(this.chipCob.includes('LM561') || this.chipCob.includes('LM301')) {

            this.midPower = true;
        }
    }

    calcular(fromUrl = false) {

        let umol, cri, amps, efficiency, lumensPerWatt, voltage, areaPes;

        if(navigator.language.split('-')[0] == 'en') {
            areaPes = this.area;
        }
        else {
            areaPes = this.area * 3.28 * 3.28; // Converte metros para pés
        }

        /* CREE CXA/CXB */
        if(this.chipCob == 'CXB3590.CD.36V.3500K') {

            umol = 4.65;
            cri = '70CRI';

            switch (this.corrente) {
                case '350 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '700 mA':  amps = 0.7; efficiency = 0.6401; lumensPerWatt = 207.39; voltage = 32.72; break;
                case '1050 mA':  amps = 1.05; efficiency = 0.6; lumensPerWatt = 195.0; voltage = 34.89; break;
                case '1200 mA':  this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '1400 mA':  amps = 1.4; efficiency = 0.5634; lumensPerWatt = 182.54; voltage = 34.89; break;
                case '2100 mA':  amps = 2.1; efficiency = 0.4971; lumensPerWatt = 161.06; voltage = 35.97; break;
                case '2400 mA':  amps = 2.4; efficiency = 0.4631; lumensPerWatt = 150.05; voltage = 36.48; break;
                case '2800 mA':  amps = 2.8; efficiency = 0.4314; lumensPerWatt = 139.77; voltage = 37.12; break;
                case '3600 mA':  amps = 3.6; efficiency = 0.3744; lumensPerWatt = 121.32; voltage = 38.22; break;
            }
        }

        if(this.chipCob == 'CXB3590.DD.36V.5000K') {

            umol = 4.47;
            cri = "70CRI";

            switch (this.corrente) {
                case '350 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '700 mA':  amps = 0.7; efficiency = 0.7425; lumensPerWatt = 240.57; voltage = 32.72; break;
                case '1050 mA':  amps = 1.05; efficiency = 0.7; lumensPerWatt = 224.0; voltage = 34.89; break;
                case '1200 mA':  this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '1400 mA':  amps = 1.4; efficiency = 0.6535; lumensPerWatt = 211.74; voltage = 34.89; break;
                case '2100 mA':  amps = 2.1; efficiency = 0.5766; lumensPerWatt = 186.83; voltage = 35.97; break;
                case '2400 mA':  amps = 2.4; efficiency = 0.5372; lumensPerWatt = 174.06; voltage = 36.48; break;
                case '2800 mA':  amps = 2.8; efficiency = 0.5004; lumensPerWatt = 162.14; voltage = 37.12; break;
                case '3600 mA':  amps = 3.6; efficiency = 0.4344; lumensPerWatt = 140.73; voltage = 38.22;
            }
        }

        /* Citizen/CLU */
        if(this.chipCob == 'CLU048.1212.CRI80.3500K') {

            umol = 4.47;
            cri = "80CRI";

            switch (this.corrente) {
                case '350 mA': amps = 0.35; efficiency = 0.7425; lumensPerWatt = 189.0; voltage = 32.7; break;
                case '700 mA':  amps = 0.7; efficiency = 0.7220; lumensPerWatt = 177.0; voltage = 33.9; break;
                case '1050 mA':  amps = 1.05; efficiency = 0.7; lumensPerWatt = 166.0; voltage = 35.1; break;
                case '1200 mA':  amps = 1.2; efficiency = 0.6535; lumensPerWatt = 162.0; voltage = 35.5; break;
                case '1400 mA':  amps = 1.4; efficiency = 0.6132; lumensPerWatt = 157.0; voltage = 36.1; break;
                case '2100 mA':  amps = 2.1; efficiency = 0.5766; lumensPerWatt = 142.0; voltage = 37.8; break;
                case '2400 mA':  amps = 2.4; efficiency = 0.5372; lumensPerWatt = 137.0; voltage = 38.4; break;
                case '2800 mA':  this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '3600 mA':  this.mostraMensagem(this.msgInfoInsuficiente); break;
            }
        }

        if(this.chipCob == 'CLU048.1212.CRI90.3500K') {

            umol = 4.47;
            cri = "90CRI";

            switch (this.corrente) {
                case '350 mA': amps = 0.35; efficiency = 0.7425; lumensPerWatt = 161.0; voltage = 32.7; break;
                case '700 mA':  amps = 0.7; efficiency = 0.7220; lumensPerWatt = 151.0; voltage = 33.9; break;
                case '1050 mA':  amps = 1.05; efficiency = 0.7; lumensPerWatt = 142.0; voltage = 35.1; break;
                case '1200 mA':  amps = 1.2; efficiency = 0.6535; lumensPerWatt = 138.0; voltage = 35.5; break;
                case '1400 mA':  amps = 1.4; efficiency = 0.6132; lumensPerWatt = 134.0; voltage = 36.1; break;
                case '2100 mA':  amps = 2.1; efficiency = 0.5766; lumensPerWatt = 121.0; voltage = 37.8; break;
                case '2400 mA':  amps = 2.4; efficiency = 0.5372; lumensPerWatt = 117.0; voltage = 38.4; break;
                case '2800 mA':  this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '3600 mA':  this.mostraMensagem(this.msgInfoInsuficiente); break;
            }
        }

        if(this.chipCob == 'CLU048.1212.CRI80.4000K') {

            umol = 4.47;
            cri = "80CRI";

            switch (this.corrente) {
                case '350 mA': amps = 0.35; efficiency = 0.7425; lumensPerWatt = 190.0; voltage = 32.7; break;
                case '700 mA':  amps = 0.7; efficiency = 0.7220; lumensPerWatt = 178.0; voltage = 33.9; break;
                case '1050 mA':  amps = 1.05; efficiency = 0.7; lumensPerWatt = 167.0; voltage = 35.1; break;
                case '1200 mA':  amps = 1.2; efficiency = 0.6535; lumensPerWatt = 163.0; voltage = 35.5; break;
                case '1400 mA':  amps = 1.4; efficiency = 0.6132; lumensPerWatt = 158.0; voltage = 36.1; break;
                case '2100 mA':  amps = 2.1; efficiency = 0.5766; lumensPerWatt = 143.0; voltage = 37.8; break;
                case '2400 mA':  amps = 2.4; efficiency = 0.5372; lumensPerWatt = 138.0; voltage = 38.4; break;
                case '2800 mA':  this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '3600 mA':  this.mostraMensagem(this.msgInfoInsuficiente); break;
            }
        }

        if(this.chipCob == 'CLU048.1212.CRI90.4000K') {

            umol = 4.47;
            cri = "90CRI";

            switch (this.corrente) {
                case '350 mA': amps = 0.35; efficiency = 0.7425; lumensPerWatt = 161.0; voltage = 32.7; break;
                case '700 mA':  amps = 0.7; efficiency = 0.7220; lumensPerWatt = 151.0; voltage = 33.9; break;
                case '1050 mA':  amps = 1.05; efficiency = 0.7; lumensPerWatt = 142.0; voltage = 35.1; break;
                case '1200 mA':  amps = 1.2; efficiency = 0.6535; lumensPerWatt = 138.0; voltage = 35.5; break;
                case '1400 mA':  amps = 1.4; efficiency = 0.6132; lumensPerWatt = 134.0; voltage = 36.1; break;
                case '2100 mA':  amps = 2.1; efficiency = 0.5766; lumensPerWatt = 121.0; voltage = 37.8; break;
                case '2400 mA':  amps = 2.4; efficiency = 0.5372; lumensPerWatt = 117.0; voltage = 38.4; break;
                case '2800 mA':  this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '3600 mA':  this.mostraMensagem(this.msgInfoInsuficiente); break;
            }
        }

        /* Bridgelux/Vero */
        if(this.chipCob == 'VERO29.GEN7.3000K') {

            umol = 4.62;
            cri = "80CRI";

            switch (this.corrente) {
                case '350 mA': amps = 0.35; efficiency = 0.5177;lumensPerWatt = 152.25;voltage = 34.7; break;
                case '700 mA': amps = 0.7;efficiency = 0.4723;lumensPerWatt = 138.90;voltage = 35.6; break;
                case '1050 mA': amps = 1.05;efficiency = 0.4563;lumensPerWatt = 134.21;voltage = 36.4; break;
                case '1200 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '1400 mA': amps = 1.4;efficiency = 0.4388;lumensPerWatt = 129.10;voltage = 36.9; break;
                case '2100 mA': amps = 2.1;efficiency = 0.4077;lumensPerWatt = 119.94;voltage = 38.0; break;
                case '2400 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '2800 mA': amps = 2.8;efficiency = 0.3824;lumensPerWatt = 112.51;voltage = 39.0; break;
                case '3600 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
            }
        }
        if(this.chipCob == 'VERO29.GEN7.3500K') {

            umol = 4.62;
            cri = "80CRI";

            switch (this.corrente) {
                case '350 mA': amps = 0.35; efficiency = 0.5177;lumensPerWatt = 156.86;voltage = 34.7; break;
                case '700 mA': amps = 0.7;efficiency = 0.4723;lumensPerWatt = 143.11;voltage = 35.6; break;
                case '1050 mA': amps = 1.05;efficiency = 0.4563;lumensPerWatt = 138.28;voltage = 36.4; break;
                case '1200 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '1400 mA': amps = 1.4;efficiency = 0.4388;lumensPerWatt = 133.01;voltage = 36.9; break;
                case '2100 mA': amps = 2.1;efficiency = 0.4077;lumensPerWatt = 123.57;voltage = 38.0; break;
                case '2400 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '2800 mA': amps = 2.8;efficiency = 0.3824;lumensPerWatt = 115.92;voltage = 39.0; break;
                case '3600 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
            }
        }

        if(this.chipCob == 'VERO29.GEN7.4000K') {

            umol = 4.62;
            cri = "80CRI";

            switch (this.corrente) {
                case '350 mA': amps = 0.35; efficiency = 0.5177;lumensPerWatt = 167.73;voltage = 34.7; break;
                case '700 mA': amps = 0.7;efficiency = 0.4723;lumensPerWatt = 153.02;voltage = 35.6; break;
                case '1050 mA': amps = 1.05;efficiency = 0.4563;lumensPerWatt = 147.84;voltage = 36.4; break;
                case '1200 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '1400 mA': amps = 1.4;efficiency = 0.4388;lumensPerWatt = 142.16;voltage = 36.9; break;
                case '2100 mA': amps = 2.1;efficiency = 0.4077;lumensPerWatt = 132.1;voltage = 38.0; break;
                case '2400 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '2800 mA': amps = 2.8;efficiency = 0.3824;lumensPerWatt = 123.91;voltage = 39.0; break;
                case '3600 mA': amps = 3.6;efficiency = 0.3556;lumensPerWatt = 115.22;voltage = 40.0;
            }
        }

        if(this.chipCob == 'VERO29.GEN7.5000K') {

            umol = 4.62;
            cri = "80CRI";

            switch (this.corrente) {
                case '350 mA': amps = 0.35; efficiency = 0.5177;lumensPerWatt = 175.32;voltage = 34.7; break;
                case '700 mA': amps = 0.7;efficiency = 0.4723;lumensPerWatt = 159.95;voltage = 35.6; break;
                case '1050 mA': amps = 1.05;efficiency = 0.4563;lumensPerWatt = 154.55;voltage = 36.4; break;
                case '1200 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '1400 mA': amps = 1.4;efficiency = 0.4388;lumensPerWatt = 148.66;voltage = 36.9; break;
                case '2100 mA': amps = 2.1;efficiency = 0.4077;lumensPerWatt = 138.11;voltage = 38.0; break;
                case '2400 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '2800 mA': amps = 2.8;efficiency = 0.3824;lumensPerWatt = 129.56;voltage = 39.0; break;
                case '3600 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
            }
        }

        /* LM561C */
        if(this.chipCob == 'LM561C.AY.S6.CRI80.3500K') {

            umol = 4.59;
            cri = "80CRI";

            switch (this.corrente) {
                case '350 mA': amps = 0.35; efficiency = 0.7425; lumensPerWatt = 189.0; voltage = 32.7; break;
                case '700 mA': amps = 0.7; efficiency = 0.7220; lumensPerWatt = 177.0; voltage = 33.9; break;
                case '1050 mA': amps = 1.05; efficiency = 0.7; lumensPerWatt = 166.0; voltage = 35.1; break;
                case '1200 mA': amps = 1.2; efficiency = 0.6535; lumensPerWatt = 162.0; voltage = 35.5; break;
                case '1400 mA': amps = 1.4; efficiency = 0.6132; lumensPerWatt = 157.0; voltage = 36.1; break;
                case '2100 mA': amps = 2.1; efficiency = 0.5766; lumensPerWatt = 142.0; voltage = 37.8; break;
                case '2400 mA': amps = 2.4; efficiency = 0.5372; lumensPerWatt = 137.0; voltage = 38.4; break;
                case '2800 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
                case '3600 mA': this.mostraMensagem(this.msgInfoInsuficiente); break;
            }
        }

        this.totalVoltageForward = (this.numCobs * voltage + 0.5);
        this.totalCobWattage = (this.numCobs * voltage * amps + 0.5);
        this.cobVoltageForward = voltage;
        this.totalLumens = Math.round(this.totalCobWattage * lumensPerWatt + 0.5);
        let heat = (1.0 - efficiency);
        let heatWatts = (this.totalCobWattage * heat + 0.5);
        this.totalParWatts = Math.round(this.totalCobWattage * efficiency * 0.9 + 0.5);
        let totalSurfacePass = Math.round(heatWatts * 120);
        let totalSurfaceAct = Math.round(heatWatts * 40);
        let hsPassLength = (totalSurfacePass / areaPes + 0.5);
        let hsActLength = (totalSurfaceAct / areaPes + 0.5);

        this.totalPPF = (Math.round(this.totalParWatts * umol * 100.0) / 100.0);

        this.PPFD = (Math.round(this.totalParWatts / areaPes * umol * 10.7 * 100.0) / 100.0);
        if(this.PPFD < 300) {
            this.color = 'red';
        }
        else if(this.PPFD < 600) {
            this.color = 'gold';
        }
        if(this.PPFD >= 600 && this.PPFD < 800) {
            this.color = '#21b94e';
        }
        else if(this.PPFD >= 800) {
            this.color = '#007aff';
        }

        this.totalWattage = (Math.round(this.totalCobWattage / (this.eficienciaDriver / 100.0) * 100.0) / 100.0);

        this.cobEfficiency = Math.round(efficiency * 100.0 * 10000.0) / 10000.0;

        this.mostraResultado = true;

        this.setUrlParams(fromUrl);
    }

    setUrlParams(fromUrl) {
        if(this.plt.is('core') || this.plt.is('mobileweb'))
        {
            if (!fromUrl) {
                let ma = this.corrente.replace(' mA', '');
                window.location.href = '?chip=' + this.chipCob + '&ma=' + ma + '&qt=' + this.numCobs + '&ar=' + this.area + '&efc=' + this.eficienciaDriver;
            }
        }
    }

    mostraMensagem(msg, terminal = false) {

        const alert = this.alertCtrl.create({
            title: 'Alerta',
            subTitle: msg,
            buttons: ['OK']
        });
        alert.present();

        //if(terminal) exit;
    }
}
