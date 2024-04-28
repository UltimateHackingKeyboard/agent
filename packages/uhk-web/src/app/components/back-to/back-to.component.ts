import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'back-to',
    template: `
        <div *ngIf="backUrl" class="my-2">
            Back to <a [routerLink]="[backUrl]">{{backText}}</a>
        </div>
    `,
})
export class BackToComponent implements OnDestroy {
    backUrl: string;
    backText: string;

    private routeSubscription: Subscription;

    constructor(private route: ActivatedRoute) {
        this.routeSubscription = route.queryParams.subscribe(params => {
            this.backUrl = params.backUrl;
            this.backText = params.backText;
        });
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }
}
