import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthorizationService} from "../../../core/services/authorization.service";
import {Router} from "@angular/router";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName: string = null;
  @Output() toggleMenu = new EventEmitter();

  constructor(
    private _authService: AuthorizationService,
    private _router: Router
  ) {
  }

  logOut() {
    this._authService.logOut()
    this._router.navigate(['auth']);

  }

  ngOnInit(): void {
    this._authService.getUserInfo()
      .pipe(untilDestroyed(this)).subscribe(data => {
      this.userName = data.response.first_name + " " + data.response.last_name;
    })
  }
}
