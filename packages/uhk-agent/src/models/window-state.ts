import { Rectangle } from 'electron';

export interface WindowState extends Rectangle {
    isMaximized: boolean;
    isFullScreen: boolean;
}
