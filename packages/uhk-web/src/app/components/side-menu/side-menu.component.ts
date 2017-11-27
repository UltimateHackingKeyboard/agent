import { AfterContentInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Keymap, Macro } from 'uhk-common';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/let';

import { AppState, getDeviceName, runningInElectron, showAddonMenu, updatingFirmware } from '../../store';
import { MacroActions } from '../../store/actions';
import { getKeymaps, getMacros } from '../../store/reducers/user-configuration';
import * as util from '../../util';
import { RenameUserConfigurationAction } from '../../store/actions/user-config';

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
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements AfterContentInit, OnDestroy {
    showAddonMenu$: Observable<boolean>;
    runInElectron$: Observable<boolean>;
    updatingFirmware$: Observable<boolean>;

    deviceName$: Observable<string>;
    deviceNameSubscription: Subscription;
    keymaps$: Observable<Keymap[]>;
    macros$: Observable<Macro[]>;
    animation: { [key: string]: 'active' | 'inactive' };
    deviceNameValue: string;
    updatingFirmware = false;
    updatingFirmwareSubscription: Subscription;
    @ViewChild('deviceName') deviceName: ElementRef;

    constructor(private store: Store<AppState>, private renderer: Renderer2) {
        this.animation = {
            device: 'active',
            configuration: 'active',
            keymap: 'active',
            macro: 'active',
            addon: 'active'
        };

        this.keymaps$ = store.let(getKeymaps())
            .map(keymaps => keymaps.slice()) // Creating a new array reference, because the sort is working in place
            .do((keymaps: Keymap[]) => {
                keymaps.sort((first: Keymap, second: Keymap) => first.name.localeCompare(second.name));
            });

        this.macros$ = store.let(getMacros())
            .map(macros => macros.slice()) // Creating a new array reference, because the sort is working in place
            .do((macros: Macro[]) => {
                macros.sort((first: Macro, second: Macro) => first.name.localeCompare(second.name));
            });

        this.showAddonMenu$ = this.store.select(showAddonMenu);
        this.runInElectron$ = this.store.select(runningInElectron);
        this.deviceName$ = store.select(getDeviceName);
        this.deviceNameSubscription = this.deviceName$.subscribe(name => {
            this.deviceNameValue = name;
            this.setDeviceName();
        });
        this.updatingFirmware$ = store.select(updatingFirmware);
        this.updatingFirmwareSubscription = this.updatingFirmware$.subscribe(updating => {
            this.updatingFirmware = updating;
        });
    }

    ngAfterContentInit(): void {
        this.setDeviceName();
    }

    ngOnDestroy(): void {
        this.deviceNameSubscription.unsubscribe();
        this.updatingFirmwareSubscription.unsubscribe();
    }

    toggleHide(event: Event, type: string) {
        if (this.updatingFirmware) {
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

    editDeviceName(name): void {
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
            this.renderer.setProperty(this.deviceName.nativeElement, 'value', this.deviceNameValue);
            this.calculateHeaderTextWidth(this.deviceName.nativeElement.value);
        }
    }
}
