import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostmanService } from '../../services/postman.service';
import { Observable } from 'rxjs';
import { UploadFileDto } from '../../interfaces/interfaces.dto';
import { UploadStatusEnum } from '../../interfaces/constant';

@Component({
  selector: 'app-storage-page',
  templateUrl: './storage-page.component.html',
  styleUrls: ['./storage-page.component.scss']
})
export class StoragePageComponent implements OnInit {
  progress$: Observable<number> = this.ps.uploadProgress$;
  disableUploadButton$: Observable<boolean> = this.ps.disableLoadButton$;
  uploadStatus: UploadStatusEnum = UploadStatusEnum.READY;
  uploadForm: FormGroup;
  files: File[];

  constructor(private readonly fb: FormBuilder, private readonly ps: PostmanService) {
  }

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      files: [null, Validators.required],
      comments: ['', Validators.required],
    });
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
    this.ps.uploadFiles(this.files[0], comments).subscribe((data: UploadFileDto) => {
      setTimeout(() => {
        this.uploadStatus = UploadStatusEnum.DONE;
        }, 500);
      console.log(data);
    });
  }

  prepareFiles(files: any): void {
    this.files = files;
  }
}
