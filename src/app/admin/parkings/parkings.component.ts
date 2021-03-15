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
import { Parking } from 'src/app/_models/parking';
import { ParkingService } from 'src/app/_services/parking.service';

@Component({
  selector: 'app-parkings',
  templateUrl: './parkings.component.html',
  styleUrls: ['./parkings.component.css'],
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
export class ParkingsComponent implements OnInit {

  parkings: Parking[];
  filteredParking: Parking[];
  parkingSource: MatTableDataSource<Parking>;
  expandedElement: Parking | null;
  parkingColumnsToDisplay = [
    'vehicleNumber',
    'driverName',
    'userCheckIn',
    'userCheckOut',
    'withCleaningService',
    'parkingCost',
    'cleaningCost',
    'isActive',
    'cost'
  ];
  value = '';
  
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    private parkingService: ParkingService,
    private _snackBar: MatSnackBar
  ) { }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.parkingSource.filter = filterValue.trim().toLowerCase();

    if (this.parkingSource.paginator) {
      this.parkingSource.paginator.firstPage();
    }
  }

  delete(id: number): void {
    this.parkingService
      .delete(id)
      .pipe()
      .subscribe(
        () => {
          //check
          this.parkingService.getAll().subscribe((parkings: Parking[]) => {
            this.parkings = parkings;
            this.filteredParking = this.parkings.filter((parking) => {
              //check
              return parking != 'Admin';
            });
            this.parkingSource = new MatTableDataSource<Parking>(this.filteredParking);

            // this.parkingSource.paginator = this.paginator;
            this.parkingSource.sort = this.sort;
          });
          this._snackBar.open('✓ Deleted', '', {
            duration: 1500,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        },
        (error: { error: { message: any; }; }) => {
          this._snackBar.open(`✗ Error ${error.error.message}`, '', {
            duration: 1500,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      );
  }

  ngOnInit(): void {

    this.parkingService.getAll().subscribe((parkings: Parking[]) => {
      this.parkings = parkings;
      this.filteredParking = this.parkings.filter((parking) => {
        //check
        return parking != 'Admin';
      });
      this.parkingSource = new MatTableDataSource<Parking>(this.filteredParking);

      // this.parkingSource.paginator = this.paginator;
      this.parkingSource.sort = this.sort;
    });

  }
  

}
