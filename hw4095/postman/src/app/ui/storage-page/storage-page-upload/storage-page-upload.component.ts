import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UploadStatusEnum } from '../../../interfaces/constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostmanService } from '../../../services/postman.service';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-storage-page-upload',
  templateUrl: './storage-page-upload.component.html',
  styleUrls: ['./storage-page-upload.component.scss']
})
export class StoragePageUploadComponent implements OnInit, OnDestroy {
  progress$: Observable<number> = this.ps.uploadProgress$;
  disableUploadButton$: Observable<boolean> = this.ps.disableLoadButton$;
  private destroy$ = new Subject<void>();
  uploadStatus: UploadStatusEnum;
  uploadForm: FormGroup;
  files: File[];

  constructor(private readonly fb: FormBuilder, private readonly ps: PostmanService) {
  }

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      files: [null, Validators.required],
      comments: [''],
    });
    this.uploadStatus = UploadStatusEnum.READY;
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
    this.uploadStatus = UploadStatusEnum.PROGRESS;
    const { comments } = this.uploadForm.getRawValue();
    this.uploadForm.disable();
    this.ps.uploadFiles(this.files[0], comments).pipe(
      finalize(() => {
        setTimeout(() => this.uploadStatus = UploadStatusEnum.DONE, 500);
        this.uploadForm.reset({ files: null, comments: ''});
        this.ps.getUploadFileList();
        this.uploadForm.enable();
      }),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  prepareFiles(files: any): void {
    this.files = files;
  }

  resetUploadProgress(): void {
    this.uploadStatus = UploadStatusEnum.READY;
    this.ps.$uploadProgress.next(0);
  }

  ngOnDestroy(): void {
    this.resetUploadProgress();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
