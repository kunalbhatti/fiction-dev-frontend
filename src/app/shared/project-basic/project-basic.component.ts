
import { Component, OnInit, Input } from '@angular/core';
import { Project } from './../../models/project.interface';

@Component({
  selector: 'app-project-basic',
  templateUrl: './project-basic.component.html',
  styleUrls: ['./project-basic.component.css']
})
export class ProjectBasicComponent implements OnInit {

  constructor() { }

  @Input() projectData: Project;
  @Input() showMore = false;
  @Input() overflow = true;
  @Input() containerHeight: string;

  ngOnInit(): void {
  }

  projectTagArr(): any {
    try {
      return Object.entries(this.projectData.projectTags);
    } catch (err) {
      return false;
    }
  }

  researchTagArr(): any {
    try {
      return Object.entries(this.projectData.researchTags);
    } catch (err) {
      return false;
    }
  }

}
