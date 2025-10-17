import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Country} from './country';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {CountryService} from './country.service';
import {Paging} from '../base.service';

@Component({
  selector: 'app-countries',
  standalone: false,
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss'
})
export class CountriesComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'iso2', 'iso3', 'totCities'];
  public countries!: MatTableDataSource<Country>;
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: "asc" | "desc" = "asc";
  defaultFilterColumn: string = "name";
  filterQuery?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterTextChanged: Subject<string> = new Subject<string>();

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(query?: string) {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterQuery = query;
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    const paging: Paging = {
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      sortColumn: (this.sort)
        ? this.sort.active
        : this.defaultSortColumn,
      sortOrder: (this.sort)
        ? this.sort.direction
        : this.defaultSortOrder,
      filterColumn: (this.filterQuery)
        ? this.defaultFilterColumn : null,
      filterQuery: (this.filterQuery)
        ? this.filterQuery : null,
    };

    this.countryService.getData(paging)
      .subscribe({
        next: (result) => {
          this.paginator.length = result.totalCount;
          this.paginator.pageIndex = result.pageIndex;
          this.paginator.pageSize = result.pageSize;
          this.countries = new MatTableDataSource<Country>(result.data);
        },
        error: (error) => console.error(error)
      });
  }

  onFilterTextChanged(filterText: string) {
    if(!this.filterTextChanged.observed){
      this.filterTextChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(query => {
          this.loadData(query);
        });
    }
    this.filterTextChanged.next(filterText);
  }
}
