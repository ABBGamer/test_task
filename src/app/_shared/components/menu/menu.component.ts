import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menuItems = [
    {name: "", fields: ["Компании", "Заказы", "Регистрации", "Изменение данных компании", "Ошибки импорта"]},
    {
      name: "Cправочники",
      fields: ["Номенклатура", "Автомобили", "Шины и диски", "Регионы и города", "Справочники компании"]
    },
    {
      name: "Продажи и услуги",
      fields: ["Заказы", "Цены на услуги", "Подключение услуг", "Акты на услуги"]
    }

  ]

  constructor() {
  }

  ngOnInit(): void {
  }

}
