export function findNewItem<T>(oldItems: T[], newItems: T[]): T {
    for (let i = 0; i < oldItems.length; ++i) {
        if (oldItems[i] !== newItems[i]) {
            return newItems[i];
        }
    }

    return newItems[newItems.length - 1];
}
