import { Component, OnInit } from '@angular/core';
import { VotesService } from '../../services/votes.service';
import { QuestionBefore } from '../../interfaces/question';

@Component({
  selector: 'app-vote-page',
  templateUrl: './vote-page.component.html',
  styleUrls: ['./vote-page.component.scss']
})
export class VotePageComponent implements OnInit {

  constructor(public voteService: VotesService) { }

  questionsBefore: QuestionBefore[];
  
  
  ngOnInit(): void {
    this.voteService.getQuestions().subscribe(data => {
      this.questionsBefore = data;
      console.log(data);
    });
  }

}
