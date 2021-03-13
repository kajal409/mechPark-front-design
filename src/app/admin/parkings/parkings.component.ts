import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';
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

  parking: Parking[];
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
          this.parkingService.getAll().subscribe((garage: Garage[]) => {
            this.parking = garage;
            this.filteredParking = this.parking.filter((parking) => {
              return parking != 'Admin';
            });
            this.parkingSource = new MatTableDataSource<User>(this.filteredParking);

            // this.userSource.paginator = this.paginator;
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

    this.parkingService.getAll().subscribe((users: User[]) => {
      this.parking = users;
      this.filteredParking = this.parking.filter((parking) => {
        return parking != 'Admin';
      });
      this.parkingSource = new MatTableDataSource<User>(this.filteredParking);

      // this.userSource.paginator = this.paginator;
      this.parkingSource.sort = this.sort;
    });

  }
  

}
