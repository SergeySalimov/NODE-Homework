import { Component, OnDestroy, OnInit } from '@angular/core';
import { VotesService } from '../../services/votes.service';
import { QuestionBefore } from '../../interfaces/question';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vote-page',
  templateUrl: './vote-page.component.html',
  styleUrls: ['./vote-page.component.scss']
})
export class VotePageComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  questionsBefore: QuestionBefore[];
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  
  constructor(public voteService: VotesService, private _formBuilder: FormBuilder) {}
  
  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    
    this.subscription = this.voteService.getQuestions().subscribe(data => {
      this.questionsBefore = data;
      console.log(data);
    });
    //
    // this.voteService.postVote().subscribe(data => {
    //   console.log(data);
    // });
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
