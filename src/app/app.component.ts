﻿import { Component } from '@angular/core';
import {AuthenticationService} from './_services';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})

export class AppComponent {
  constructor() {

  }

  checkpage(page: string) {
    console.log(localStorage.getItem("active_page"));
  }
}
