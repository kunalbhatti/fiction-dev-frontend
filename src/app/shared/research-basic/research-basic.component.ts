import { Component, OnInit, Input } from '@angular/core';
import { Research } from './../../models/research.interface';

@Component({
  selector: 'app-research-basic',
  templateUrl: './research-basic.component.html',
  styleUrls: ['./research-basic.component.css']
})
export class ResearchBasicComponent implements OnInit {

  @Input() researchData: Research;
  @Input() showMore = false;
  @Input() overflow = true;
  @Input() containerHeight: string;

  constructor() { }

  ngOnInit(): void {
  }

  projectTagArr(): any {
    try {
      return Object.entries(this.researchData.projectTags);
    } catch (err) {
      return false;
    }
  }

  researchTagArr(): any {
    try {
      return Object.entries(this.researchData.researchTags);
    } catch (err) {
      return false;
    }
  }

}
