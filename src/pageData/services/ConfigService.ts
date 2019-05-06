import { Observable } from 'rxjs';
import { Config } from '../models/config';
import { HttpService } from './HttpService';

export class ConfigService {
  constructor(private httpService: HttpService) {}

  getConfig(): Observable<Config> {
    return this.httpService.get<Config>(this.buildUrl());
  }

  private buildUrl(): string {
    // return '/config?device=web_browser&ff=idp%2Cldp&include=classification%2Csubscription%2Csitemap%2Cnavigation%2Cgeneral%2Ci18n%2Cplayback&lang=en-US';
    return `/config?device=web_browser&ff=idp%2Cldp&include=classification%2Csubscription%2Csitemap%2Cnavigation%2CprofileImages%2Cgeneral%2Calerts%2CchromecastReceiver%2Clinear&segments=globo%2Ctrial&sub=Subscriber`;
  }
}
