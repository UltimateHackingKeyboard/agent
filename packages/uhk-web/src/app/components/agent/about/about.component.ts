import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState, runningInElectron } from '../../../store';
import { appVersion } from '../../../app-version';

@Component({
    selector: 'about-page',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {
    public version: string = appVersion;

    private agentGitHubURL: string = 'https://github.com/UltimateHackingKeyboard/agent';
    private runningInElectron: boolean;

    constructor(private store: Store<AppState>) {
        store.select(runningInElectron)
            .subscribe(isRunningInElectron => {
                this.runningInElectron = isRunningInElectron;
            }).unsubscribe();
    }

    openAgentGitHubPage(event) {
        event.preventDefault();
        if (this.runningInElectron) {
            require('electron').shell.openExternal(this.agentGitHubURL);
        } else {
            window.open(this.agentGitHubURL, '_blank');
        }
    }
}
