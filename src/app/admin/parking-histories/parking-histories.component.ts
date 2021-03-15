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
import { ParkingService } from 'src/app/_services/parking.service';
import { Parking } from 'src/app/_models/parking';

@Component({
  selector: 'app-parking-histories',
  templateUrl: './parking-histories.component.html',
  styleUrls: ['./parking-histories.component.css'],
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
export class ParkingHistoriesComponent implements OnInit {

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
    //private _snackBar: MatSnackBar
  ) { }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.parkingSource.filter = filterValue.trim().toLowerCase();

    if (this.parkingSource.paginator) {
      this.parkingSource.paginator.firstPage();
    }
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
