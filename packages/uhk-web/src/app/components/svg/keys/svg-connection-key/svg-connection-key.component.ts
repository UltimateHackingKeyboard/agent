import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ConnectionCommands, ConnectionsAction, HostConnection } from 'uhk-common';

import { MapperService } from '../../../../services/mapper.service';
import { AppState, getHostConnections } from '../../../../store/index';
import { getContentWidth } from '../../../../util/index';

const MAX_FONT_SIZE = 25;
const MIN_FONT_SIZE = 20;

@Component({
    selector: 'g[svg-connection-key]',
    templateUrl: './svg-connection-key.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgConnectionKeyComponent implements OnChanges, OnDestroy, OnInit {
    @Input() keyAction: ConnectionsAction;

    firstText: string;
    firstTextOffset = 15;
    fontSize = MAX_FONT_SIZE;
    icon: string;
    iconWidth = 20
    iconX = 10
    secondText: string;

    private hostConnections: HostConnection[] = [];
    private subscription: Subscription;

    constructor(private mapper: MapperService,
                private store: Store<AppState>,
                private cdRef: ChangeDetectorRef) {
        this.icon = this.mapper.getIcon('host-connection');
    }

    ngOnInit(): void {
        this.subscription = this.store.select(getHostConnections)
            .subscribe((connections: HostConnection[]) => {
                this.hostConnections = connections;
                this.setTexts();
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if  (changes.keyAction) {
            this.setTexts();
        }
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    private setTexts() {
        this.firstText = '';
        this.secondText = '';

        if (this.keyAction.command === ConnectionCommands.last) {
            this.secondText = 'Last'
        }
        else if (this.keyAction.command === ConnectionCommands.next) {
            this.secondText = 'Next'
        }
        else if (this.keyAction.command === ConnectionCommands.previous) {
            this.secondText = 'Previous'
        }
        else {
            this.firstText = this.keyAction.hostConnectionId.toString(10);
            const hostConnection = this.hostConnections[this.keyAction.hostConnectionId]
            this.secondText = hostConnection?.name || 'unassigned'
        }

        this.calculateFontSize()
        this.calculateIconPosition()
        this.cdRef.markForCheck()
    }

    private calculateFontSize() {
        this.fontSize = MAX_FONT_SIZE;

        if (!this.secondText) {
            return;
        }

        // the svg element uses 100 x 100 viewBox, so we can hardcode the 96 because it is 100 - 2px left and 2 px right padding.
        const reducedWidth = 96;

        for (let fontSize = MAX_FONT_SIZE; fontSize >= MIN_FONT_SIZE; fontSize = fontSize - 0.5) {
            const style = {
                font: `${fontSize}px Helvetica`
            } as CSSStyleDeclaration;

            const calculatedWidth = getContentWidth(style, this.secondText);

            if (calculatedWidth <= reducedWidth) {
                this.fontSize = fontSize;
                return;
            }
        }

        this.fontSize = MIN_FONT_SIZE;
    }

    private calculateIconPosition(): void {
        if (!this.firstText) {
            this.iconX = (96 - this.iconWidth) / 2;
        }
        else {
            const style = {
                font: '25px Helvetica'
            } as CSSStyleDeclaration;

            const calculatedWidth = getContentWidth(style, this.firstText);

            this.iconX = (96 - this.iconWidth - calculatedWidth) / 2;
            this.firstTextOffset = calculatedWidth / 2 + 5;

        }
    }
}
