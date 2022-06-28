import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AuthorizationService} from "../../../core/services/authorization.service";
import {combineLatest, debounceTime} from "rxjs";

export interface IFilter {
  company_id: number,
  phone: string,
  region: number[],
  company_name: string,
  email: string,
  district: number[],
  company_switch_name: {
    firm: string,
  },
  site: string,
  address: string,
  company_state: number[],
  agents: string,
  company_type: number,
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  isLoading = true
  regions = []
  districts = []
  companyStates = []
  companyTypes = []

  @Output() getFilters = new EventEmitter<IFilter>();

  filterCompany: FormGroup = new FormGroup({
    ID: new FormControl(""),
    phone: new FormControl(""),
    region: new FormControl(null),
    company_name: new FormControl(""),
    email: new FormControl(""),
    district: new FormControl(null),
    ur_name: new FormControl(""),
    site: new FormControl(""),
    address: new FormControl(""),
    company_state: new FormControl(null),
    represent: new FormControl(""),
    company_type: new FormControl(null),
  })

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthorizationService
  ) {
    this.isLoading = true

    const region$ = this._auth.getReference('Region/')
    const district$ = this._auth.getReference('District/')
    const companyState$ = this._auth.getReference('CompanyState/')
    const companyType$ = this._auth.getReference('CompanyType/')

    combineLatest([region$, district$, companyState$, companyType$]).pipe(debounceTime(200))
      .subscribe(([r, d, s, t]) => {
        this.isLoading = false;
        this.regions = r.response
        this.districts = d.response
        this.companyStates = s.response
        this.companyTypes = t.response
      })
  }

  ngOnInit(): void {
    const buf = JSON.parse(localStorage.getItem('filters'))
    this.setFilters(buf)
  }

  combineFilters() {
    const buf: IFilter = {
      company_id: this.filterCompany.controls['ID'].value ? +this.filterCompany.controls['ID'].value : null,
      phone: this.filterCompany.controls['phone'].value,
      region: this.filterCompany.controls['region'].value ? [this.filterCompany.controls['region'].value] : [],
      company_name: this.filterCompany.controls['company_name'].value,
      email: this.filterCompany.controls['email'].value,
      district: this.filterCompany.controls['district'].value ? [this.filterCompany.controls['district'].value] : [],
      company_switch_name: {
        firm: this.filterCompany.controls['ur_name'].value,
      },
      site: this.filterCompany.controls['site'].value,
      address: this.filterCompany.controls['address'].value,
      company_state: this.filterCompany.controls['company_state'].value ? [this.filterCompany.controls['company_state'].value] : [],
      agents: this.filterCompany.controls['represent'].value,
      company_type: this.filterCompany.controls['company_type'].value,
    }
    this.getFilters.emit(buf);
    localStorage.setItem('filters', JSON.stringify(buf));
  }

  setFilters(value?: IFilter) {
    if (value) {
      this.filterCompany = this._fb.group({
        ID: new FormControl(value.company_id),
        phone: new FormControl(value.phone),
        region: new FormControl(value.region[0]),
        company_name: new FormControl(value.company_name),
        email: new FormControl(value.email),
        district: new FormControl(value.district[0]),
        ur_name: new FormControl(value.company_switch_name.firm),
        site: new FormControl(value.site),
        address: new FormControl(value.address),
        company_state: new FormControl(value.company_state[0]),
        represent: new FormControl(value.agents),
        company_type: new FormControl(value.company_type),
      })
    } else {
      this.filterCompany = this._fb.group({
        ID: new FormControl(""),
        phone: new FormControl(""),
        region: new FormControl(null),
        company_name: new FormControl(""),
        email: new FormControl(""),
        district: new FormControl(null),
        ur_name: new FormControl(""),
        site: new FormControl(""),
        address: new FormControl(""),
        company_state: new FormControl(null),
        represent: new FormControl(""),
        company_type: new FormControl(null),
      })
    }
  }
}
