import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})

export class SpinnerComponent implements OnInit {

  @Input()  color: string;
  @Input()  size: string;

  constructor() { }

  ngOnInit() {
  }

}
