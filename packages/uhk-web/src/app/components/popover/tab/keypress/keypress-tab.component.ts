import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    inject,
} from '@angular/core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
    copyRgbColor,
    getScancodesForKeyLanguage,
    KeyAction,
    KeyLanguage,
    KeystrokeAction,
    KeystrokeType,
    SecondaryRoleAction,
} from 'uhk-common';

import { Tab } from '../tab';
import { MapperService } from '../../../../services/mapper.service';
import { SelectOptionData } from '../../../../models/select-option-data';
import { KeyModifierModel } from '../../../../models/key-modifier-model';
import { mapLeftRightModifierToKeyActionModifier } from '../../../../util';
import { RemapInfo } from '../../../../models/remap-info';
import { AppState, getKeyLanguage } from '../../../../store';
import { ScancodeSelectOption } from './scancode-select';

interface SearchResult {
    isMatch: boolean;
    scancode?: number;
}

@Component({
    selector: 'keypress-tab',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './keypress-tab.component.html',
    styleUrls: ['./keypress-tab.component.scss']
})
export class KeypressTabComponent extends Tab implements OnChanges, OnDestroy {
    @Input() defaultKeyAction: KeyAction;
    @Input() secondaryRoleEnabled: boolean;
    @Input() allowRemapOnAllKeymapWarning: boolean;
    @Input() remapInfo: RemapInfo;
    @Input() secondaryRoleOptions: SelectOptionData[];

    @Output() keyActionChange = new EventEmitter<KeystrokeAction>();

    leftModifiers: KeyModifierModel[];
    rightModifiers: KeyModifierModel[];

    scanCodeGroups: Array<ScancodeSelectOption>;
    secondaryRoleGroups: Array<ScancodeSelectOption> = [];

    selectedScancodeOption: ScancodeSelectOption;
    selectedSecondaryRoleIndex: number;
    warningVisible: boolean;
    faInfoCircle = faInfoCircle;

    private readonly mapper = inject(MapperService);
    private readonly cdRef = inject(ChangeDetectorRef);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly subscriptions = new Subscription();

    constructor() {
        super();
        this.leftModifiers = this.mapper.getLeftKeyModifiers();
        this.rightModifiers = this.mapper.getRightKeyModifiers();
        this.selectedSecondaryRoleIndex = -1;
        this.buildScanCodeGroups(KeyLanguage.Us);
        this.selectedScancodeOption = this.scanCodeGroups[0];

        this.subscriptions.add(
            this.store.select(getKeyLanguage).subscribe(keyLanguage => {
                const selectedId = this.selectedScancodeOption?.id;
                this.buildScanCodeGroups(keyLanguage);
                this.selectedScancodeOption = this.scanCodeGroups.find(option => option.id === selectedId)
                    || this.scanCodeGroups[0];
                this.cdRef.markForCheck();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.secondaryRoleOptions) {
            this.fillSecondaryRoles();
        }
        this.fromKeyAction(this.defaultKeyAction);
        this.keyActionChanged(false);
    }

    keyActionValid(keystrokeAction?: KeystrokeAction): boolean {
        if (!keystrokeAction) {
            keystrokeAction = this.toKeyAction();
        }

        return (keystrokeAction) ? (keystrokeAction.scancode > 0 || keystrokeAction.modifierMask > 0) : false;
    }

    onKeysCapture(event: { code: number, left: KeyModifierModel[], right: KeyModifierModel[] }) {
        if (event.code) {
            this.selectedScancodeOption = this.findScancodeOptionByScancode(event.code, KeystrokeType.basic);
        } else {
            this.selectedScancodeOption = this.scanCodeGroups[0];
        }

        this.leftModifiers = event.left;
        this.rightModifiers = event.right;
        this.keyActionChanged();
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (!(keyAction instanceof KeystrokeAction)) {
            return false;
        }
        const keystrokeAction: KeystrokeAction = <KeystrokeAction>keyAction;
        // Restore selectedScancodeOption
        this.selectedScancodeOption = this.findScancodeOptionByScancode(keystrokeAction.scancode || 0, keystrokeAction.type);

        for (const modifier of this.leftModifiers) {
            modifier.checked = (keystrokeAction.modifierMask & modifier.value) > 0;
        }

        for (const modifier of this.rightModifiers) {
            modifier.checked = (keystrokeAction.modifierMask & modifier.value) > 0;
        }

        // Restore secondaryRoleAction
        if (keystrokeAction.secondaryRoleAction !== undefined) {
            this.selectedSecondaryRoleIndex = keystrokeAction.secondaryRoleAction;
        } else {
            this.selectedSecondaryRoleIndex = -1;
        }

        return true;
    }

    toKeyAction(): KeystrokeAction {
        const keystrokeAction: KeystrokeAction = new KeystrokeAction();
        copyRgbColor(this.defaultKeyAction, keystrokeAction);
        const scTypePair = this.toScancodeTypePair(this.selectedScancodeOption);
        keystrokeAction.scancode = scTypePair[0];
        if (scTypePair[1] === 'media') {
            keystrokeAction.type = keystrokeAction.scancode > 255 ? KeystrokeType.longMedia : KeystrokeType.shortMedia;
        } else {
            keystrokeAction.type = KeystrokeType[scTypePair[1]];
        }
        keystrokeAction.modifierMask = mapLeftRightModifierToKeyActionModifier(this.leftModifiers, this.rightModifiers);

        keystrokeAction.secondaryRoleAction = this.selectedSecondaryRoleIndex === -1
            ? undefined
            : this.selectedSecondaryRoleIndex;

        if (this.keyActionValid(keystrokeAction)) {
            return keystrokeAction;
        }
    }

    toggleModifier(modifier: KeyModifierModel): void {
        modifier.checked = !modifier.checked;
        this.keyActionChanged();
    }

    onSecondaryRoleChange(id: string) {
        this.selectedSecondaryRoleIndex = +id;
        this.keyActionChanged();
    }

    onScancodeChange(id: string) {
        this.selectedScancodeOption = this.findScancodeOptionById(id);

        this.keyActionChanged();
    }

    addTag = (name: string): ScancodeSelectOption | boolean => this.addTagFn(name);

    getAddTagText = (term: string): string => this.addTagText(term);

    addTagFn (name: string): ScancodeSelectOption | boolean {
        const mediaSearchResult = isMediaSearch(name);
        if (mediaSearchResult.isMatch) {
            const option = {
                id: name,
                text: name,
                group: 'Media',
                additional: {
                    type: 'media',
                    scancode: mediaSearchResult.scancode
                }
            };
            this.scanCodeGroups = [...this.scanCodeGroups, option];

            return option;
        }

        const basicSearchResult = isBasicSearch(name);
        if (basicSearchResult.isMatch) {
            const option = {
                id: name,
                text: name,
                group: 'Basic',
                additional: {
                    type: 'basic',
                    scancode: basicSearchResult.scancode
                }
            };
            this.scanCodeGroups = [...this.scanCodeGroups, option];

            return option;
        }

        const systemSearchResult = isSystemSearch(name);
        if (systemSearchResult.isMatch) {
            const option = {
                id: name,
                text: name,
                group: 'System',
                additional: {
                    type: 'system',
                    scancode: systemSearchResult.scancode
                }
            };
            this.scanCodeGroups = [...this.scanCodeGroups, option];

            return option;
        }

        return false;
    }

    addTagText(term: string): string {
        const normalizedTerm = term.trim();
        if (!normalizedTerm) {
            return '';
        }

        // Allow M/B/S tags whenever that exact id is new. A named key may already
        // use the same scancode (e.g. letter "B" is basic scancode 5), but users
        // still need to be able to add "B5" as an explicit custom entry.
        const idExists = this.scanCodeGroups
            .some(option => option.id.toLowerCase() === normalizedTerm.toLowerCase());
        if (idExists) {
            return '';
        }

        const mediaSearchResult = isMediaSearch(normalizedTerm);
        if (mediaSearchResult.isMatch) {
            return `Media scancode: ${mediaSearchResult.scancode}`;
        }

        const basicSearchResult = isBasicSearch(normalizedTerm);
        if (basicSearchResult.isMatch) {
            return `Basic scancode: ${basicSearchResult.scancode}`;
        }

        const systemSearchResult = isSystemSearch(normalizedTerm);
        if (systemSearchResult.isMatch) {
            return `System scancode: ${systemSearchResult.scancode}`;
        }

        return '';
    }

    searchFn = (term: string, item: ScancodeSelectOption): boolean => {
        term = term.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
        if (new RegExp(term, 'i').test(item.text)) {
            return true;
        }

        const mediaSearchResult = isMediaSearch(term);
        if (mediaSearchResult.isMatch &&
            item.additional?.type === 'media' && item.additional?.scancode === mediaSearchResult.scancode) {
            return true;
        }

        const basicSearchResult = isBasicSearch(term);
        if (basicSearchResult.isMatch &&
            item.additional?.type === 'basic' && item.additional?.scancode === basicSearchResult.scancode) {
            return true;
        }

        const systemSearchResult = isSystemSearch(term);
        if (systemSearchResult.isMatch &&
            item.additional?.type === 'system' && item.additional?.scancode === systemSearchResult.scancode) {
            return true;
        }

        return false;
    };

    modifiersTrackBy(index: number, modifier: KeyModifierModel): string {
        return `${modifier.value}${modifier.checked}`;
    }

    remapInfoChanged(remapInfo: RemapInfo): void {
        this.remapInfo = remapInfo;
        const keystrokeAction = this.toKeyAction();
        this.calculateRemapOnAllLayerWarningVisibility(keystrokeAction);
        this.cdRef.markForCheck();
    }

    private findScancodeOptionById(id: string): ScancodeSelectOption {
        return this.scanCodeGroups.find(scancode => scancode.id === id) ||
            this.addTagFn(id) as ScancodeSelectOption;
    }

    private findScancodeOptionByScancode(scancode: number, type: KeystrokeType): ScancodeSelectOption {
        const typeToFind: string =
            (type === KeystrokeType.shortMedia || type === KeystrokeType.longMedia) ? 'media' : KeystrokeType[type];
        const option = this.scanCodeGroups.find(x => x.additional.scancode === scancode && x.additional.type === typeToFind);

        if (option) {
            return option;
        }

        switch (typeToFind) {
            case 'media':
                return this.addTagFn(`M${scancode}`) as ScancodeSelectOption;

            case 'basic':
                return this.addTagFn(`B${scancode}`) as ScancodeSelectOption;

            case 'system':
                return this.addTagFn(`S${scancode}`) as ScancodeSelectOption;

            default:
                break;
        }
    }

    private toScancodeTypePair(option: ScancodeSelectOption): [number, string] {
        if (!option) {
            return [0, 'basic'];
        }

        return [option.additional.scancode, option.additional.type || 'basic'];
    }

    private keyActionChanged(dispatch = true): void {
        const keystrokeAction = this.toKeyAction();
        this.validAction.emit(this.keyActionValid(keystrokeAction));
        this.calculateRemapOnAllLayerWarningVisibility(keystrokeAction);

        if (dispatch) {
            this.keyActionChange.emit(keystrokeAction);
        }
    }

    private calculateRemapOnAllLayerWarningVisibility(keystrokeAction: KeystrokeAction): void {
        this.warningVisible = this.allowRemapOnAllKeymapWarning &&
            this.remapInfo &&
            !this.remapInfo.remapOnAllLayer &&
            keystrokeAction &&
            !keystrokeAction.hasScancode() &&
            keystrokeAction.hasOnlyOneActiveModifier();
    }

    private fillSecondaryRoles(): void {
        this.secondaryRoleGroups = [
            {
                id: '-1',
                text: 'None'
            }
        ];

        if (this.secondaryRoleOptions.length > 0) {
            this.secondaryRoleGroups.push(
                ...this.secondaryRoleOptions.map(option => ({
                    id: option.id,
                    text: option.text,
                    additional: option.additional,
                    group: 'Layer switcher',
                }))
            );
        }

        this.secondaryRoleGroups.push(
            ...[
                this.getSecondaryRoleDropdownItem(SecondaryRoleAction.leftShift),
                this.getSecondaryRoleDropdownItem(SecondaryRoleAction.leftCtrl),
                this.getSecondaryRoleDropdownItem(SecondaryRoleAction.leftSuper),
                this.getSecondaryRoleDropdownItem(SecondaryRoleAction.leftAlt),
                this.getSecondaryRoleDropdownItem(SecondaryRoleAction.rightShift),
                this.getSecondaryRoleDropdownItem(SecondaryRoleAction.rightCtrl),
                this.getSecondaryRoleDropdownItem(SecondaryRoleAction.rightSuper),
                this.getSecondaryRoleDropdownItem(SecondaryRoleAction.rightAlt)
            ].map(option => ({
                id: option.id,
                text: option.text,
                additional: option.additional,
                group: 'Modifier',
            }))
        );
    }

    private getSecondaryRoleDropdownItem(action: SecondaryRoleAction): SelectOptionData {
        return {
            id: `${action}`,
            text: this.mapper.getSecondaryRoleText(action)
        };
    }

    private buildScanCodeGroups(keyLanguage: KeyLanguage): void {
        this.scanCodeGroups = [{
            id: '0',
            text: 'None',
            additional: {
                type: 'basic',
                scancode: 0
            }
        }];

        getScancodesForKeyLanguage(keyLanguage).forEach(group => {
            group.children.forEach(child => {
                this.scanCodeGroups.push({
                    id: child.id,
                    text: child.text,
                    group: group.text,
                    additional: {
                        type: 'basic',
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        scancode: Number.parseInt(child.id, 10),
                        ...child.additional
                    }
                });
            });
        });
    }
}

const mediaRegExp = new RegExp('^M([0-9]*)', 'i');
function isMediaSearch(term: string): SearchResult {
    const match = mediaRegExp.exec(term);
    if (match) {
        const nr = parseInt(match[1], 10);

        if (nr > 0 && nr <= 65535) {
            return {
                isMatch: true,
                scancode: nr
            };
        }
    }

    return {
        isMatch: false
    };
}

const basicRegExp = new RegExp('^B([0-9]*)', 'i');
function isBasicSearch(term: string): SearchResult {
    const match = basicRegExp.exec(term);
    if (match) {
        const nr = parseInt(match[1], 10);

        if (nr > 0 && nr <= 255) {
            return {
                isMatch: true,
                scancode: nr
            };
        }
    }

    return {
        isMatch: false
    };
}

const systemRegExp = new RegExp('^S([0-9]*)', 'i');
function isSystemSearch(term: string): SearchResult {
    const match = systemRegExp.exec(term);
    if (match) {
        const nr = parseInt(match[1], 10);

        if (nr > 0 && nr <= 255) {
            return {
                isMatch: true,
                scancode: nr
            };
        }
    }

    return {
        isMatch: false
    };
}
