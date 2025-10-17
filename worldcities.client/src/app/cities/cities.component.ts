import {Component, OnInit, ViewChild} from '@angular/core';
import {City} from './city';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {CityService} from './city.service';
import {Paging} from '../base.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss',
  standalone: false,
})
export class CitiesComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'latitude', 'longitude', 'countryName'];
  public cities!: MatTableDataSource<City>;
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: "asc" | "desc" = "asc";
  defaultFilterColumn: string = "name";
  filterQuery?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterTextChanged: Subject<string> = new Subject<string>();

  constructor(private cityService: CityService) {
  }

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

    this.cityService.getData(paging)
      .subscribe({
        next: (result) => {
          this.paginator.length = result.totalCount;
          this.paginator.pageIndex = result.pageIndex;
          this.paginator.pageSize = result.pageSize;
          this.cities = new MatTableDataSource<City>(result.data);
        },
        error: (error) => console.error(error)
      });
  }

  onFilterTextChanged(filterText: string) {
    if (!this.filterTextChanged.observed) {
      this.filterTextChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(query => {
          this.loadData(query);
        });
    }
    this.filterTextChanged.next(filterText);
  }
}
