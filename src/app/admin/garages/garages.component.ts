import { Component, OnInit, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Garage } from 'src/app/_models/garage';
import { GarageService } from 'src/app/_services/garage.service';

@Component({
  selector: 'app-garages',
  templateUrl: './garages.component.html',
  styleUrls: ['./garages.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class GaragesComponent implements OnInit {

  garages: Garage[];
  filteredGarage: Garage[];
  garageSource: MatTableDataSource<Garage>;
  expandedElement: Garage | null;
  garageColumnsToDisplay = [
    'name',
    'address',
    'state',
    'hasCleaning',
    'cleaningRate',
    'totalspace',
    'occupiedCapacity',
    'parkingRate',
  ];
  value = '';
  
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    private garageService: GarageService,
    private _snackBar: MatSnackBar
  ) { }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.garageSource.filter = filterValue.trim().toLowerCase();

    if (this.garageSource.paginator) {
      this.garageSource.paginator.firstPage();
    }
  }

  delete(id: number): void {
    this.garageService
      .delete(id)
      .pipe()
      .subscribe(
        () => {
          this.garageService.getAll().subscribe((garage: Garage[]) => {
            this.garages = garage;
            this.filteredGarage = this.garages.filter((garages) => {
              //check
              return garages != 'Admin';
            });
            
            this.garageSource = new MatTableDataSource<Garage>(this.filteredGarage);

            // this.garageSource.paginator = this.paginator;
            this.garageSource.sort = this.sort;
          });
          this._snackBar.open('✓ Deleted', '', {
            duration: 1500,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        },
        (error) => {
          this._snackBar.open(`✗ Error ${error.error.message}`, '', {
            duration: 1500,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      );
  }


  ngOnInit(): void {

    this.garageService.getAll().subscribe((garages: Garage[]) => {
      this.garages = this.garages;
      this.filteredGarage = this.garages.filter((garages) => {
        //check
        return garages != 'Admin';
      });
      this.garageSource = new MatTableDataSource<Garage>(this.filteredGarage);

      // this.garageSource.paginator = this.paginator;
      this.garageSource.sort = this.sort;
    });

  }

}
