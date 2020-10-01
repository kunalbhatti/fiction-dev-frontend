import { NgModule } from '@angular/core';
import { AceEditorModule } from 'ng2-ace-editor';
import { EditorComponent } from './editor/editor.component';

@NgModule({
  declarations: [EditorComponent],
  imports: [AceEditorModule],
  exports: [EditorComponent]

})
export class PluginsModule{}
