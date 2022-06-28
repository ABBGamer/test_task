import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {AuthorizationService} from "../../../core/services/authorization.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login = new FormControl('')
  pass = new FormControl('')
  isVisible: boolean = true
  name: string = ''
  isLoading: boolean = false;

  constructor(
    private _snackBar: MatSnackBar,
    private _authService: AuthorizationService,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this.login.setValue('demo_68f3js1@bibinet.ru')
    this.pass.setValue('MJJ3Cb')
  }


  checkUser() {
    this.isLoading = true;
    if (this.pass.value != '') {
      this._authService.newLogin(this.login.value || '', this.pass.value || '')
        .subscribe(data => {
          this.isLoading = false
          if (data.field_errors) {
            this._snackBar.open('Ошибка авторизации')

          }
          if (data.response.access_token) {
            this._snackBar.open('Успешно авторизованы!')
            this._router.navigate([''])
          }
        })
    } else {
      this._snackBar.open('Введите все поля!')
      this.isLoading = false
    }
  }
}
