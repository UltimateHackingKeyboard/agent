import {
    ConnectionsAction,
    KeyAction,
    KeystrokeAction,
    KeystrokeType,
    Macro,
    MouseAction,
    NoneAction,
    OtherAction,
    PlayMacroAction,
    SecondaryRoleAction,
    SwitchKeymapAction,
    SwitchLayerAction,
} from 'uhk-common';

export const UNASSIGNED_KEY_ACTION_LABEL = 'unassigned';

export interface KeyAccessibleLabelMapper {
    scanCodeToText(scanCode: number, type?: KeystrokeType): string[];
    getSecondaryRoleText(secondaryRoleAction: SecondaryRoleAction): string;
}

export interface BuildKeyAccessibleLabelOptions {
    keyAction?: KeyAction;
    layerOptionMap: Map<number, { name: string }>;
    macroMap?: Map<number, Macro>;
    mapper: KeyAccessibleLabelMapper;
    physicalKeyLabel: string;
}

export function buildKeyAccessibleLabel(options: BuildKeyAccessibleLabelOptions): string {
    const actionLabel = buildKeyActionAccessibleLabel(options);

    return combinePhysicalAndActionLabel(options.physicalKeyLabel, actionLabel);
}

export function combinePhysicalAndActionLabel(physicalKeyLabel: string, actionLabel: string): string {
    if (actionLabel === UNASSIGNED_KEY_ACTION_LABEL) {
        return `${physicalKeyLabel}, ${UNASSIGNED_KEY_ACTION_LABEL}`;
    }

    if (actionLabel === physicalKeyLabel) {
        return physicalKeyLabel;
    }

    return `${physicalKeyLabel}, ${actionLabel}`;
}

function buildKeyActionAccessibleLabel(options: BuildKeyAccessibleLabelOptions): string {
    const keyAction = options.keyAction;

    if (!keyAction || keyAction instanceof NoneAction) {
        return UNASSIGNED_KEY_ACTION_LABEL;
    }

    if (keyAction instanceof KeystrokeAction) {
        const parts: string[] = [];

        if (keyAction.hasActiveModifier()) {
            parts.push(keyAction.getModifierList().join(' + '));
        }

        if (keyAction.hasScancode()) {
            const scancodeText = options.mapper.scanCodeToText(keyAction.scancode, keyAction.type)
                .filter(part => !part.startsWith('icon'))
                .join(' ');

            if (scancodeText) {
                parts.push(scancodeText);
            }
        }

        if (parts.length === 0) {
            parts.push('Keystroke');
        }

        if (keyAction.hasSecondaryRoleAction()) {
            const secondaryRoleText = options.mapper.getSecondaryRoleText(keyAction.secondaryRoleAction);
            parts.push(`secondary role ${secondaryRoleText || 'unknown'}`);
        }

        return parts.join(', ');
    }

    if (keyAction instanceof SwitchLayerAction) {
        const layerName = options.layerOptionMap.get(keyAction.layer)?.name || 'unknown';
        return `Switch to ${layerName} layer`;
    }

    if (keyAction instanceof SwitchKeymapAction) {
        return `Switch to keymap ${keyAction.keymapAbbreviation}`;
    }

    if (keyAction instanceof PlayMacroAction) {
        const macroName = options.macroMap?.get(keyAction.macroId)?.name;
        return macroName ? `Play macro ${macroName}` : 'Play macro';
    }

    if (keyAction instanceof MouseAction) {
        return 'Mouse action';
    }

    if (keyAction instanceof ConnectionsAction) {
        return 'Host connection action';
    }

    if (keyAction instanceof OtherAction) {
        return 'Sleep';
    }

    return 'Assigned key action';
}
