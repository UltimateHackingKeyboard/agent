import { MouseSpeedConfiguration } from 'uhk-common';

export function getDefaultPcMouseSpeeds(): MouseSpeedConfiguration {
    return {
        mouseMoveInitialSpeed: 4,
        mouseMoveAcceleration: 68,
        mouseMoveDeceleratedSpeed: 8,
        mouseMoveBaseSpeed: 32,
        mouseMoveAcceleratedSpeed: 64,
        mouseMoveAxisSkew: 1,

        mouseScrollInitialSpeed: 20,
        mouseScrollAcceleration: 20,
        mouseScrollDeceleratedSpeed: 10,
        mouseScrollBaseSpeed: 20,
        mouseScrollAcceleratedSpeed: 50,
        mouseScrollAxisSkew: 1,

        diagonalSpeedCompensation: false
    };
}

export function getDefaultMacMouseSpeeds(): MouseSpeedConfiguration {
    return {
        mouseMoveInitialSpeed: 8,
        mouseMoveAcceleration: 180,
        mouseMoveDeceleratedSpeed: 80,
        mouseMoveBaseSpeed: 112,
        mouseMoveAcceleratedSpeed: 160,
        mouseMoveAxisSkew: 1,

        mouseScrollInitialSpeed: 10,
        mouseScrollAcceleration: 10,
        mouseScrollDeceleratedSpeed: 7,
        mouseScrollBaseSpeed: 10,
        mouseScrollAcceleratedSpeed: 12,
        mouseScrollAxisSkew: 1,

        diagonalSpeedCompensation: false
    };
}
