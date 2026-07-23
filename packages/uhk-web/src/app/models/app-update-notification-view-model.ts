export interface AppUpdateNotificationViewModel {
    updateDownloaded: boolean;
    isDownloading: boolean;
    downloadProgressPercent: number | null;
    hasUnsavedChanges: boolean;
}

export const initialAppUpdateNotificationViewModel: AppUpdateNotificationViewModel = {
    updateDownloaded: false,
    isDownloading: false,
    downloadProgressPercent: null,
    hasUnsavedChanges: false,
};
