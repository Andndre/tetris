const LEFT = -1;
const RIGHT = 1;
const DOWN = 0;

const STATE_MAIN_MENU = 0;
const STATE_IN_GAME = 1;
const STATE_GAMEOVER = 2;

const GAMEOVER = -1;
const WALL = 0;
const MOVE = 1;
const SPAWN = 2;
const PAL_FPS = [
	1.66, 1.87, 2.06, 2.4, 2.72, 3.33, 4, 5.45, 8.57, 12, 15, 15, 15, 20, 20,
	20, 30, 30, 30, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60,
];

// const PAL_FRAMES_PER_CELL = [
// 	32, 29, 25, 22, 18, 15, 11, 7, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1,
// 	1, 1, 1, 1, 1, 1,
// ];

// let a = "fpss : [";
// for (let i of PAL_FRAMES_PER_CELL) {
// 	a += ", " + 60 / i;
// }
// a += "]";
// console.log(a);
