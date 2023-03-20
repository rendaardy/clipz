import {
  Component,
  type AfterContentInit,
  ContentChildren,
  type QueryList,
} from '@angular/core';

import { TabComponent } from "../tab/tab.component";

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent)
  tabs?: QueryList<TabComponent>;

  ngAfterContentInit(): void {
    if (this.tabs) {
      if (!this.tabs.some((tab) => tab.active)) {
        this.selectTab(this.tabs.first);
      }
    }
  }

  selectTab(tab: TabComponent): boolean {
    if (this.tabs) {
      for (const t of this.tabs) {
        t.active = false;
      }

      tab.active = true;
    }

    return false;
  }

  selectedTabStyle(tab: TabComponent): Record<string, boolean> {
    return {
      "hover:text-indigo-400": !tab.active,
      "hover:text-white text-white bg-indigo-400": tab.active,
    };
  }
}
