import { MouseSpeedConfiguration } from 'uhk-common';

export function getDefaultPcMouseSpeeds(): MouseSpeedConfiguration {
    return {
        mouseMoveInitialSpeed: 4,
        mouseMoveAcceleration: 68,
        mouseMoveDeceleratedSpeed: 8,
        mouseMoveBaseSpeed: 32,
        mouseMoveAcceleratedSpeed: 64,
        mouseScrollInitialSpeed: 20,
        mouseScrollAcceleration: 20,
        mouseScrollDeceleratedSpeed: 10,
        mouseScrollBaseSpeed: 20,
        mouseScrollAcceleratedSpeed: 50
    };
}

export function getDefaultMacMouseSpeeds(): MouseSpeedConfiguration {
    return {
        mouseMoveInitialSpeed: 8,
        mouseMoveAcceleration: 180,
        mouseMoveDeceleratedSpeed: 80,
        mouseMoveBaseSpeed: 112,
        mouseMoveAcceleratedSpeed: 160,
        mouseScrollInitialSpeed: 10,
        mouseScrollAcceleration: 10,
        mouseScrollDeceleratedSpeed: 7,
        mouseScrollBaseSpeed: 10,
        mouseScrollAcceleratedSpeed: 12
    };
}
