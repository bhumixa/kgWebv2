import { NgModule } from '@angular/core';
import { TimeAgoPipe } from './time-ago/time-ago.pipe';
import { SortCodesPipe } from './sort-code/sort-codes.pipe';
@NgModule({
  declarations: [TimeAgoPipe, SortCodesPipe],
  imports: [],
  exports: [TimeAgoPipe, SortCodesPipe],
})
export class PipesModule {}
