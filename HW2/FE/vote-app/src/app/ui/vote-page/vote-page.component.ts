import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { VotesService } from '../../services/votes.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { QuestionVM } from '../../interfaces/interfaces.vm';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { VoteDto } from '../../interfaces/interfaces.dto';

@Component({
  selector: 'app-vote-page',
  templateUrl: './vote-page.component.html',
  styleUrls: ['./vote-page.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class VotePageComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  
  questions: QuestionVM[];
  form: FormGroup;
  
  errorMessage = 'Необходим ответ на вопрос';
  
  constructor(public voteService: VotesService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
  }
  
  ngOnInit(): void {
    
    this.form = this.fb.group({});
    
    this.subscription = this.voteService.getQuestions().subscribe((data: QuestionVM[]) => {
      this.questions = data;
      
      data.forEach(question => {
        this.form.addControl(question.questionId, new FormControl('', Validators.required));
      });
  
      this.cdr.detectChanges();
    });
  }
  
  onSubmit(): void {
    const answer: VoteDto = {
      answers: this.form.getRawValue(),
    };
    
    this.voteService.postVote(answer).subscribe();
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
