﻿import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './_services';
import {AppService} from './_services/app.service';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {

  padding: boolean = false;

  constructor(private appService: AppService, private authService: AuthenticationService) {
    this.appService.getActivePageSubject().subscribe(active_page => {
      this.checkPage();
    });
  }

  ngOnInit() {
    this.authService.updateLoggedInVerification();
  }

  checkPage() {
    this.padding = this.appService.getActivePage() !== 'login';
  }
}
