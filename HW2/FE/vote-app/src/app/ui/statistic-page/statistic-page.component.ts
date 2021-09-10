import { Component, OnInit } from '@angular/core';
import { VotesService } from '../../services/votes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-statistic-page',
  templateUrl: './statistic-page.component.html',
  styleUrls: ['./statistic-page.component.scss']
})
export class StatisticPageComponent implements OnInit {
  subscription: Subscription;
  
  constructor(public voteService: VotesService) {}

  ngOnInit(): void {
    this.subscription = this.voteService.getStatistic().subscribe(data => {
      console.log(data);
    });
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
