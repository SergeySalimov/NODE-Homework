import { Component } from '@angular/core';
import { VotesService } from '../../services/votes.service';
import { Observable } from 'rxjs';
import { StatisticVM } from '../../interfaces/interfaces.vm';
import { AnswerStatisticDto, StatisticViewDto } from '../../interfaces/interfaces.dto';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-statistic-page',
  templateUrl: './statistic-page.component.html',
  styleUrls: ['./statistic-page.component.scss']
})
export class StatisticPageComponent {
  statistics$: Observable<StatisticVM> = this.voteService.getStatistic();
  
  questionsFromStatistic$: Observable<StatisticViewDto[]> = this.statistics$.pipe(
    map(stat => this.parseStatistic(stat)),
  );
  
  constructor(public voteService: VotesService) {}
  
  parseStatistic(statistic: StatisticVM): StatisticViewDto[] {
    const statisticView: StatisticViewDto[] = [];
    
    for (const [questionId, answers] of Object.entries(statistic.data)) {
      let answerArr: AnswerStatisticDto[] = [];
      
      for (const answerId in answers) {
        let preparedAnswer: AnswerStatisticDto = {
          answerName: statistic.answersData.filter(v => answerId in v)[0][answerId],
          count: statistic.data[questionId][answerId],
        };
        answerArr.push(preparedAnswer);
      }
      
      statisticView.push({
        questionName: statistic.questionsData.filter(v => questionId in v)[0][questionId],
        questionData: [...answerArr],
      });
    }
    
    return statisticView;
  }
}
