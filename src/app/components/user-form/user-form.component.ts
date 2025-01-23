import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]]
    });

    if (data) {
      this.userForm.patchValue(data); // Pre-fill form for editing
    }
  }

  ngOnInit(): void {}

  save(): void {
    if (this.userForm.valid) {
      const updatedUser = { ...this.userForm.value }; // Create a copy of the form values

      // Handle edit vs. create scenario
      if (this.data) { // If data is present, it's an edit
        updatedUser.id = this.data.id; // Include the id for update
      }

      console.log("Updated User (Before Closing Dialog):", updatedUser);
      this.dialogRef.close(updatedUser);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}