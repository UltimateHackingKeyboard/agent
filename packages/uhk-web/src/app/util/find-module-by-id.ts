import { Module } from 'uhk-common';

export function findModuleById(id: number) {
    return function moduleFinder(module: Module): boolean {
        return module.id === id;
    };
}
