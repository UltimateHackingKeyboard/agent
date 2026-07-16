import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'back-to',
    standalone: false,
    template: `
        <div *ngIf="backUrl" class="my-2">
            Back to <a [routerLink]="[backUrl]" [queryParams]="queryParams">{{ backText }}</a>{{ backSuffix }}
        </div>
    `,
})
export class BackToComponent implements OnDestroy {
    backUrl: string | undefined;
    backText: string;
    backSuffix = '';
    queryParams = {};

    private routeSubscription: Subscription;

    constructor(private route: ActivatedRoute,
                private cdRef: ChangeDetectorRef) {
        this.routeSubscription = route.queryParams.subscribe(params => {
            if (params.backUrl) {
                const backUrl = new URL(params.backUrl as string, window.location.origin);
                this.backUrl = backUrl.pathname;
                this.backText = params.backText;
                this.backSuffix = params.backSuffix || '';
                this.queryParams = {};
                for (const key of backUrl.searchParams.keys()) {
                    this.queryParams[key] = backUrl.searchParams.get(key);
                }
            } else {
                this.backUrl = undefined;
            }

            cdRef.markForCheck();
        });
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }
}
