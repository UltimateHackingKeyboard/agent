import { LeftSlotModules, RightSlotModules } from '../../models/index.js';
import { Module } from './module.js';
import { defaultRgbColor } from './rgb-color.js';

export type ModulesDefaultConfigs = { [K in LeftSlotModules | RightSlotModules]?: Module };

export const MODULES_DEFAULT_CONFIGS: ModulesDefaultConfigs = {
    [LeftSlotModules.KeyClusterLeft]: new Module().fromJsonObject({
        id: LeftSlotModules.KeyClusterLeft,
        ledColors: [
            defaultRgbColor(),
            defaultRgbColor(),
            defaultRgbColor(),
            defaultRgbColor(),
            defaultRgbColor(),
            defaultRgbColor()
        ],
        keyActions: [
            {
                keyActionType: 'keystroke',
                type: 'basic',
                scancode: 76 // Delete
            }, // Top button
            {
                keyActionType: 'keystroke',
                type: 'basic',
                scancode: 42 // Backspace
            }, // Left button
            {
                keyActionType: 'keystroke',
                type: 'basic',
                scancode: 40 // Enter
            }, // Right button
            {
                keyActionType: 'mouse',
                mouseAction: 'leftClick'
            }, // Left micro button
            {
                keyActionType: 'mouse',
                mouseAction: 'middleClick'
            }, // Ball
            {
                keyActionType: 'mouse',
                mouseAction: 'rightClick'
            } // Right micro button
        ]
    }, [], 6),
    [RightSlotModules.TrackballRight]: new Module().fromJsonObject({
        id: RightSlotModules.TrackballRight,
        ledColors: [
            defaultRgbColor(),
            defaultRgbColor()
        ],
        keyActions: [
            {
                keyActionType: 'mouse',
                mouseAction: 'leftClick'
            }, // Left micro button
            {
                keyActionType: 'mouse',
                mouseAction: 'rightClick'
            } // Right micro button
        ]
    }, [], 6),
    [RightSlotModules.TrackpointRight]: new Module().fromJsonObject({
        id: RightSlotModules.TrackpointRight,
        ledColors: [
            defaultRgbColor(),
            defaultRgbColor()
        ],
        keyActions: [
            {
                keyActionType: 'mouse',
                mouseAction: 'leftClick'
            }, // Left micro button
            {
                keyActionType: 'mouse',
                mouseAction: 'rightClick'
            } // Right micro button
        ]
    }, [], 6),
    [RightSlotModules.TouchpadRight]: new Module().fromJsonObject({
        id: RightSlotModules.TouchpadRight,
        ledColors: [
            defaultRgbColor(),
        ],
        keyActions: [
            {
                keyActionType: 'mouse',
                mouseAction: 'leftClick'
            }
        ]
    }, [], 6)
};

export const MODULES_NONE_CONFIGS: ModulesDefaultConfigs = {
    [LeftSlotModules.KeyClusterLeft]: new Module().fromJsonObject({
        id: LeftSlotModules.KeyClusterLeft,
        ledColors: [
            defaultRgbColor(),
            defaultRgbColor(),
            defaultRgbColor(),
            defaultRgbColor(),
            defaultRgbColor(),
            defaultRgbColor()
        ],
        keyActions: [
            null, // Top button
            null, // Left button
            null, // Right button
            null, // Left micro button
            null, // Ball
            null // Right micro button
        ]
    }, [], 6),
    [RightSlotModules.TrackballRight]: new Module().fromJsonObject({
        id: RightSlotModules.TrackballRight,
        ledColors: [
            defaultRgbColor(),
            defaultRgbColor()
        ],
        keyActions: [
            null, // Left micro button
            null // Right micro button
        ]
    }, [], 6),
    [RightSlotModules.TrackpointRight]: new Module().fromJsonObject({
        id: RightSlotModules.TrackpointRight,
        ledColors: [
            defaultRgbColor(),
            defaultRgbColor()
        ],
        keyActions: [
            null, // Left micro button
            null // Right micro button
        ]
    }, [], 6),
    [RightSlotModules.TouchpadRight]: new Module().fromJsonObject({
        id: RightSlotModules.TouchpadRight,
        ledColors: [
            defaultRgbColor()
        ],
        keyActions: [
            null
        ]
    }, [], 6)
};
