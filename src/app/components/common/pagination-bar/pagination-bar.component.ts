import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination-bar',
  templateUrl: './pagination-bar.component.html',
  styleUrls: ['./pagination-bar.component.scss']
})
export class PaginationBarComponent implements OnInit {

  @Input() totalItems: number;
  @Output() goToPageOut = new EventEmitter();

  pagesNumber: number;
  currentPage: number = 1;
  nextDisable: boolean = false;
  prevDisable: boolean = true;
  btn2Disable: boolean;
  btn3Disable: boolean;
  pageActive: number = 1;

  constructor() { }

  ngOnInit() {
    this.calcPages();
  }

  calcPages() {
    const itemsPerPage = 8;
    const hasDec = this.totalItems % itemsPerPage;
    const pages = Math.trunc(this.totalItems/itemsPerPage);
    this.pagesNumber = (hasDec !== 0) ? pages + 1 : pages;
    this.validate();
  }

  goNextPage() {
    this.validate();
    const page = (!this.nextDisable) ? this.currentPage + 1 : this.currentPage;
    this.currentPage = page;
  }

  goPrevPage() {
    this.validate();
    const page = (!this.prevDisable) ? this.currentPage -1 : this.currentPage;
    this.currentPage = page;
  }

  validate() {
    this.prevDisable = (this.currentPage === 1) ? true : false;
    this.nextDisable = (this.currentPage === this.pagesNumber - 2 || this.currentPage === this.pagesNumber - 1 || (this.currentPage === this.pagesNumber && this.pagesNumber === 1) ) ? true : false;

    this.btn2Disable = (this.currentPage + 1 > this.pagesNumber) ? true : false;
    this.btn3Disable = (this.currentPage + 2 > this.pagesNumber) ? true : false;
  }

  goToPage(page, isInvalid) {
    if (!isInvalid) {
      this.pageActive = page;
      this.goToPageOut.emit(page);
    }
  }

}
