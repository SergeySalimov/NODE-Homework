import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostmanService } from '../../services/postman.service';
import { Observable, Subscription } from 'rxjs';
import { UploadStatusEnum } from '../../interfaces/constant';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-storage-page',
  templateUrl: './storage-page.component.html',
  styleUrls: ['./storage-page.component.scss']
})
export class StoragePageComponent implements OnInit, OnDestroy {
  progress$: Observable<number> = this.ps.uploadProgress$;
  disableUploadButton$: Observable<boolean> = this.ps.disableLoadButton$;
  uploadStatus: UploadStatusEnum = UploadStatusEnum.READY;
  uploadForm: FormGroup;
  files: File[];
  subscription: Subscription;

  constructor(private readonly fb: FormBuilder, private readonly ps: PostmanService) {
  }

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      files: [null, Validators.required],
      comments: [''],
    });
    this.getUploadedList();
  }

  getUploadedList(): void {
    this.ps.getUploadFileList();
  }

  getClassForProgressBar(): string {
    switch (this.uploadStatus) {
      case UploadStatusEnum.READY:
      case UploadStatusEnum.PROGRESS:
        return 'bg-primary';
      case UploadStatusEnum.DONE:
        return 'bg-success';
      case UploadStatusEnum.ERROR:
        return 'bg-danger';
      default:
        return 'bg-primary';
    }
  }

  onSubmitUpload(): void {
    const {comments} = this.uploadForm.getRawValue();
    this.subscription = this.ps.uploadFiles(this.files[0], comments).pipe(
      finalize(() => {
        setTimeout(() => this.uploadStatus = UploadStatusEnum.DONE, 500);
        this.uploadForm.reset();
      }),
    ).subscribe(() => this.getUploadedList());
  }

  prepareFiles(files: any): void {
    this.files = files;
  }

  resetUploadProgress(): void {
    this.ps.$uploadProgress.next(0);
  }

  ngOnDestroy(): void {
    this.resetUploadProgress();
    this.subscription.unsubscribe();
  }
}
