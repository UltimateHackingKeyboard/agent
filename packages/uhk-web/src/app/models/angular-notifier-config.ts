import { NotifierOptions } from 'angular-notifier';

export const angularNotifierConfig: NotifierOptions = {
    behaviour: {
        autoHide: false
    },
    position: {

        horizontal: {

            /**
             * Defines the horizontal position on the screen
             * @type {'left' | 'middle' | 'right'}
             */
            position: 'right',

            /**
             * Defines the horizontal distance to the screen edge (in px)
             * @type {number}
             */
            distance: 12

        },

        vertical: {

            /**
             * Defines the vertical position on the screen
             * @type {'top' | 'bottom'}
             */
            position: 'top',

            /**
             * Defines the vertical distance to the screen edge (in px)
             * @type {number}
             */
            distance: 12,

            /**
             * Defines the vertical gap, existing between multiple notifications (in px)
             * @type {number}
             */
            gap: 10

        }
    }
};
