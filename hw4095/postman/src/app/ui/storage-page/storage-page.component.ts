import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostmanService } from '../../services/postman.service';

@Component({
  selector: 'app-storage-page',
  templateUrl: './storage-page.component.html',
  styleUrls: ['./storage-page.component.scss']
})
export class StoragePageComponent implements OnInit {

  uploadForm: FormGroup;
  files: File[];

  constructor(private readonly fb: FormBuilder, private readonly ps: PostmanService) {}

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      files: [null, Validators.required],
      comments: ['', Validators.required],
    });
  }

  onSubmitUpload(): void {
    const { comments } = this.uploadForm.getRawValue();
    this.ps.uploadFiles(this.files[0], comments);
  }

  prepareFiles(files: any): void {
    this.files = files;
  }
}
