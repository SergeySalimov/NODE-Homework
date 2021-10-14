import { Component } from '@angular/core';
import { VotesService } from '../../../services/votes.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  constructor(public votesService: VotesService) { }
}
