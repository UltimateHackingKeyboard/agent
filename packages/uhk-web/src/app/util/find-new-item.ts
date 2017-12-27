export function findNewItem<T>(oldItems: T[], newItems: T[]): T {
    let newItem;
    for (let i = 0; i < oldItems.length; ++i) {
        if (oldItems[i] !== newItems[i]) {
            newItem = newItems[i];
            break;
        }
    }
    newItem = newItem || newItems[newItems.length - 1];
    return newItem;
}
