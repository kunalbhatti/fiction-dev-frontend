import {
  Component,
  ViewChild,
  Input,
  AfterViewInit
} from '@angular/core';

import 'brace';
import 'brace/theme/vibrant_ink';

import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/mode/css';

@Component({
  selector: 'app-editor',
  templateUrl: 'editor.component.html',
  styleUrls: ['editor.component.css']
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('editor') editor;
  @Input() code = '';
  @Input() mode = '';

  options: any = {
    maxLines: 1000,
    printMargin: false
  };
  theme = 'vibrant_ink';

  onChange(code): void {
    console.log('new code', code);
  }

  constructor() {}

  ngAfterViewInit(): void {
    this.editor.setTheme(this.theme);
    this.editor.getEditor().setOptions({
      enableBasicAutocompletion: true,
      fontSize: '0.8rem',
      highlightActiveLine: false,
      wrap: true,
    });

  }

}
