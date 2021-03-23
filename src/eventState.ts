import { Event } from './event';
import { genUseEventState, genUseEventSelector } from './eventHooks';

export abstract class EventState extends Event {
  protected eventList: string[] = [];
  public useState: (eventList?: string[]) => [this, number];
  public useSelector:<U extends (state: this) => any>(fn: U, eventList?: string[])=> ReturnType<U>;
  constructor (eventList: string[]) {
    super();
    this.eventList = eventList;
    this.useState = genUseEventState(this, eventList);
    this.useSelector = genUseEventSelector(this, eventList);
  }
}
