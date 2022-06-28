import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";

export interface DialogData {
  header: string;
  subheader?: string;
  body?: string;
  buttonsName?: {
    confirm?: string;
    cancel?: string;
  };
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent implements OnInit {
  @HostListener('window:popstate', ['$event']) onBrowserBackBtnClose() {
    this._dialogRef.close(false);
  }

  header: string = '';
  subheader: string = '';
  body: string = '';
  confirmButton = '';
  cancelButton = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _dialogRef: MatDialogRef<DialogComponent>,
  ) {
    this.header = data?.header;
    if (data?.subheader) this.subheader = data?.subheader;
    if (data?.body) this.body = data?.body;
    if (data?.buttonsName?.confirm) this.confirmButton = data.buttonsName.confirm;
    if (data?.buttonsName?.cancel !== undefined) this.cancelButton = data.buttonsName.cancel;

  }

  ngOnInit(): void {
  }

  public close() {
    this._dialogRef.close(null);
  }

  public cancel() {
    this._dialogRef.close(false);
  }

  public confirm() {
    this._dialogRef.close(true);
  }
}
