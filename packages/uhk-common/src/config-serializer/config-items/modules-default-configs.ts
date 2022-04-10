import { LeftSlotModules, RightSlotModules } from '../../models/index.js';
import { Module } from './module.js';

export type ModulesDefaultConfigs = { [K in LeftSlotModules | RightSlotModules]?: Module };

export const MODULES_DEFAULT_CONFIGS: ModulesDefaultConfigs = {
    [LeftSlotModules.KeyClusterLeft]: new Module().fromJsonObject({
        id: LeftSlotModules.KeyClusterLeft,
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
    }, [], 4),
    [RightSlotModules.TrackballRight]: new Module().fromJsonObject({
        id: RightSlotModules.TrackballRight,
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
    }, [], 4),
    [RightSlotModules.TrackpointRight]: new Module().fromJsonObject({
        id: RightSlotModules.TrackpointRight,
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
    }, [], 4),
    [RightSlotModules.TouchpadRight]: new Module().fromJsonObject({
        id: RightSlotModules.TouchpadRight,
        keyActions: [
            {
                keyActionType: 'mouse',
                mouseAction: 'leftClick'
            }
        ]
    }, [], 4)
};

export const MODULES_NONE_CONFIGS: ModulesDefaultConfigs = {
    [LeftSlotModules.KeyClusterLeft]: new Module().fromJsonObject({
        id: LeftSlotModules.KeyClusterLeft,
        keyActions: [
            null, // Top button
            null, // Left button
            null, // Right button
            null, // Left micro button
            null, // Ball
            null // Right micro button
        ]
    }, [], 4),
    [RightSlotModules.TrackballRight]: new Module().fromJsonObject({
        id: RightSlotModules.TrackballRight,
        keyActions: [
            null, // Left micro button
            null // Right micro button
        ]
    }, [], 4),
    [RightSlotModules.TrackpointRight]: new Module().fromJsonObject({
        id: RightSlotModules.TrackpointRight,
        keyActions: [
            null, // Left micro button
            null // Right micro button
        ]
    }, [], 4),
    [RightSlotModules.TouchpadRight]: new Module().fromJsonObject({
        id: RightSlotModules.TouchpadRight,
        keyActions: [
            null
        ]
    }, [], 4)
};
