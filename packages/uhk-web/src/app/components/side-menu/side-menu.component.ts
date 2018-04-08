import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy, OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/let';

import { AppState, getSideMenuPageState } from '../../store';
import { MacroActions } from '../../store/actions';
import * as util from '../../util';
import { RenameUserConfigurationAction } from '../../store/actions/user-config';
import { SideMenuPageState } from '../../models/side-menu-page-state';

@Component({
    animations: [
        trigger('toggler', [
            state('inactive', style({
                height: '0px'
            })),
            state('active', style({
                height: '*'
            })),
            transition('inactive <=> active', animate('500ms ease-out'))
        ])
    ],
    selector: 'side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuComponent implements AfterContentInit, OnInit, OnDestroy {
    state: SideMenuPageState;
    animation: { [key: string]: 'active' | 'inactive' };
    @ViewChild('deviceName') deviceName: ElementRef;

    private stateSubscription: Subscription;

    constructor(private store: Store<AppState>,
                private renderer: Renderer2,
                private cdRef: ChangeDetectorRef) {
        this.animation = {
            device: 'active',
            configuration: 'active',
            keymap: 'active',
            macro: 'active',
            addon: 'active'
        };
    }

    ngOnInit(): void {
        this.stateSubscription = this.store.select(getSideMenuPageState).subscribe(data => {
            this.state = data;
            this.cdRef.markForCheck();
        });
    }

    ngAfterContentInit(): void {
        this.setDeviceName();
    }

    ngOnDestroy(): void {
        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
    }

    toggleHide(event: Event, type: string) {
        if (this.state.updatingFirmware) {
            return;
        }

        const header: DOMTokenList = (<Element>event.target).classList;
        let show = false;

        if (header.contains('fa-chevron-down')) {
            show = true;
            this.animation[type] = 'active';
        } else {
            this.animation[type] = 'inactive';
        }

        if (show) {
            this.renderer.addClass(event.target, 'fa-chevron-up');
            this.renderer.removeClass(event.target, 'fa-chevron-down');
        } else {
            this.renderer.removeClass(event.target, 'fa-chevron-up');
            this.renderer.addClass(event.target, 'fa-chevron-down');
        }
    }

    addMacro() {
        this.store.dispatch(MacroActions.addMacro());
    }

    editDeviceName(name: string): void {
        if (!util.isValidName(name) || name.trim() === this.state.deviceName) {
            this.setDeviceName();
            return;
        }
        this.store.dispatch(new RenameUserConfigurationAction(name));
    }

    calculateHeaderTextWidth(text): void {
        const htmlInput = this.deviceName.nativeElement as HTMLInputElement;
        const maxWidth = htmlInput.parentElement.offsetWidth * 0.66;
        const textWidth = util.getContentWidth(window.getComputedStyle(htmlInput), text);
        this.renderer.setStyle(htmlInput, 'width', Math.min(maxWidth, textWidth) + 'px');
    }

    private setDeviceName(): void {
        if (this.deviceName) {
            this.renderer.setProperty(this.deviceName.nativeElement, 'value', this.state.deviceName);
            this.calculateHeaderTextWidth(this.deviceName.nativeElement.value);
        }
    }
}
