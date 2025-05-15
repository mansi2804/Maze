import { Howl } from 'howler';

// Sound effects
const sounds = {
  move: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2093/2093-preview.mp3'],
    volume: 0.3,
  }),
  win: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2088/2088-preview.mp3'],
    volume: 0.5,
  }),
  click: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/219/219-preview.mp3'],
    volume: 0.2,
  }),
  error: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'],
    volume: 0.3,
  })
};

export const playMoveSound = () => {
  sounds.move.play();
};

export const playWinSound = () => {
  sounds.win.play();
};

export const playClickSound = () => {
  sounds.click.play();
};

export const playErrorSound = () => {
  sounds.error.play();
};
