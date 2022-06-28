import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, take, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";

interface ILoginConfig {
  "data": {
    "login": string,
    "password": string,
    "refresh_token": string,
  }
}

interface IInfoConfig {
  "filter": any,
  "fields": string [],
  "sort": string [],
  "limit": number,
  "offset": number
}

interface IInfoResponse {
  "count": number,
  "response": IInfoResponseItem[],
}

export interface IInfoResponseItem {
  "address": string,
  "branch_phones": string [],
  "is_has_import": boolean,
  "task_last": string,
  "company": {
    "name": string,
    "company_state": {
      "name": string
    }
  },
  "city": {
    "name": string
  }
}

interface ILoginResponse {
  "response": {
    "access_token": string,
    "access_expires": number,
    "refresh_token": string,
    "refresh_expires": number
  },
  "field_errors"?: any
}

export interface INewUser {
  "response": {
    "pk": number,
    "first_name": string,
    "last_name": string,
    "email": string,
    "perms": any
  },
  "field_errors"?: any
}

const LINK = 'https://demo-db-review-man-services-ci-app1.bibinet.ru/'

@Injectable({
  providedIn: 'root'
})

export class AuthorizationService {
  private _accessToken: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private _refreshToken: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  readonly accessToken$: Observable<string> = this._accessToken.asObservable()
  private _timerId: any = null


  constructor(
    private _http: HttpClient
  ) {

    const token = localStorage.getItem('token')
    const ref_token = localStorage.getItem('ref_token')

    if (token) {
      this._accessToken.next(token);
      this._startRefTimer();
    }
    if (ref_token) {
      this._refreshToken.next(ref_token);
    }
  }

  private _startRefTimer() {
    this._timerId = setInterval(() => {
      this.refreshToken().subscribe()
    }, 60 * 1000)
  }

  newLogin(login: string, password: string, refresh_token?: string): Observable<ILoginResponse> {
    const url = LINK + 'accounts/login/';
    const body: ILoginConfig = {
      data: {
        login: login,
        password: password,
        refresh_token: refresh_token || '',
      }
    }
    const headers = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    }
    return this._http.post<ILoginResponse>(url, body, {headers: headers})
      .pipe(
        take(1),
        tap(data => {
          if (data.response) {
            this._setTokens(data.response.access_token, data.response.refresh_token)
            this._startRefTimer();
          }
        }),
      )
  }

  private _setTokens(token: string, ref_token: string) {
    if (ref_token) {
      localStorage.setItem('ref_token', ref_token)
    } else {
      localStorage.removeItem('ref_token')
    }
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
    this._accessToken.next(token)
    this._refreshToken.next(ref_token)
  }

  refreshToken(): Observable<ILoginResponse> {
    const url = LINK + 'accounts/token/refresh/';

    const body = {
      "data": {
        "access_token": this._accessToken.value,
        "refresh_token": this._refreshToken.value,
      }
    }
    const headers = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    }
    return this._http.post<ILoginResponse>(url, body, {headers: headers})
      .pipe(
        take(1),
        tap(data => {
          this._setTokens(data.response.access_token, data.response.refresh_token)
        }),
      )
  }

  getUserInfo(): Observable<INewUser> {
    const url = LINK + 'accounts/userprofile/';
    const body = {}
    const headers = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "Authorization": this._accessToken.value
    }
    return this._http.post<INewUser>(url, body, {headers: headers})
      .pipe(
        take(1)
      )
  }

  getReference(referenceUrl: string) {
    const url = LINK + 'references/' + referenceUrl;
    const body = {}
    const headers = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "Authorization": this._accessToken.value
    }
    return this._http.post<any>(url, body, {headers: headers})
      .pipe(
        take(1),
      )
  }

  getInfo(filter: any, sort?: string [], limit?: number, offset?: number): Observable<IInfoResponse> {
    const url = LINK + 'company/';
    const body: IInfoConfig = {
      fields: [
        "company__name",
        "company__company_state__name",
        "city__name",
        "address",
        "branch_phones",
        "task_last",
        "is_has_import"
      ],
      filter: filter,
      sort: sort || [],
      limit: limit || 30,
      offset: offset || 0
    }

    const headers = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "Authorization": this._accessToken.value
    }
    return this._http.post<IInfoResponse>(url, body, {headers: headers})
      .pipe(
        take(1),
      )
  }

  logOut() {
    clearInterval(this._timerId);
    this._setTokens(null, null)
  }
}

