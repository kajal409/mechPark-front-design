import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first, map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/_models/user';
import { Observable } from 'rxjs';
import { Space } from 'src/app/_models/space';
import { SpaceService } from 'src/app/_services/space.service';

@Component({
  selector: 'app-edit-space',
  templateUrl: './edit-space.component.html',
  styleUrls: ['./edit-space.component.css']
})
export class EditSpaceComponent implements OnInit {

  id: number;
  space: Space;
  editSpaceForm: FormGroup;
  submitted = false;

  filteredStateOptions: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private spaceService: SpaceService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];
    //this.space = this.spaceService.;
    this.space = this.space;
    console.log(this.space);
    this.editSpaceForm = this.formBuilder.group({
      code: ['', Validators.required],
      totalCapacity: ['', Validators.required],
      occupiedCapacity: ['', Validators.required],
    });

    this.spaceService
      .getById(this.id)
      .pipe(first())
      .subscribe((x) => this.editSpaceForm.patchValue(x));


  }

  hide = true;

  get f() {
    return this.editSpaceForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.editSpaceForm.invalid) {
      return;
    }

    alert(JSON.stringify(this.editSpaceForm.value));

    this.spaceService.update(this.editSpaceForm.value, this.id).subscribe(
      () => {
        this._snackBar.open('✓ Edited', '', {
          duration: 1500,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/admin']);
      },
      (error) => {
        this._snackBar.open(`✗ Error ${error.error.message}`, '', {
          duration: 1500,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.onReset();
        console.log(error);
      }
    );
  }

  onReset(): void {
    this.submitted = false;
    this.editSpaceForm.reset();
  }

}
