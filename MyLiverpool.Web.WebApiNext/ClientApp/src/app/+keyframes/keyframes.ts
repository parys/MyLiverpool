import { trigger, keyframes, animate, transition, state, style } from "@angular/animations";
import { SLIDE_OUT_LEFT, SLIDE_OUT_RIGHT, SLIDE_IN_RIGHT, SLIDE_IN_LEFT } from "../+constants/help.constants";

const initial: string = "initial";
const fixed: string = "fixed";
const slideOutLeft = [
    style({
        left: "-50%",
        offset: 0
    }),
    style({
        left: "-99%",
        position: fixed,
        offset: 1
    })
];

const slideOutRight = [
    style({
        left: "50%",
        offset: 0
    }),
    style({
        left: "99%",
        position: fixed,
        offset: 1
    })
];

const slideInLeft = [
    style({
        left: "-99%",
        position: initial,
        offset: 0
    }),
    style({
        left: "0",
        offset: 1
    })
];

const slideInRight = [
    style({
        left: "99%",
        position: initial,
        offset: 0
    }),
    style({
        left: "0",
        offset: 1
    })
];

export const SlideInOutAnimation = [
    trigger("slideInOut",
        [
            state(SLIDE_OUT_LEFT, style({
                left: "-99%",
                position: fixed
            })),
            state(SLIDE_OUT_RIGHT, style({
                left: "99%",
                position: fixed
            })),
            state(SLIDE_IN_RIGHT, style({
                left: "0%",
            })),
            state(SLIDE_IN_LEFT, style({
                left: "0%",
            })),
            transition(`* => ${SLIDE_OUT_LEFT}`, [animate(250, keyframes(slideOutLeft))]),
            transition(`* => ${SLIDE_OUT_RIGHT}`, [animate(250, keyframes(slideOutRight))]),
            transition(`* => ${SLIDE_IN_RIGHT}`, [animate(500, keyframes(slideInRight))]),
            transition(`* => ${SLIDE_IN_LEFT}`, [animate(500, keyframes(slideInLeft))])
        ])
];