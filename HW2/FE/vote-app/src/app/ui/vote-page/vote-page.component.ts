import { Component, OnInit } from '@angular/core';
import { VotesService } from '../../services/votes.service';
import { QuestionBefore } from '../../interfaces/question';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vote-page',
  templateUrl: './vote-page.component.html',
  styleUrls: ['./vote-page.component.scss']
})
export class VotePageComponent implements OnInit {

  constructor(public voteService: VotesService, private _formBuilder: FormBuilder) { }

  questionsBefore: QuestionBefore[];
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  
  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    
    this.voteService.getQuestions().subscribe(data => {
      this.questionsBefore = data;
      console.log(data);
    });
  }

}
