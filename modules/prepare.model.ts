import { ICard } from "./car.model";

export interface IPrepare {
    cards?: ICard[];
    selectedCard_1?: ICard;
    selectedCard_2?: ICard;
    selectedIndex_1?: number; //to know which inex im on
    selectedIndex_2?: number;
    progress?: number;
    fullTrack?: HTMLAudioElement;
    flipAudio?: HTMLAudioElement;
    goodAudio?: HTMLAudioElement;
    failAudio?: HTMLAudioElement;
    gameOverAudio?: HTMLAudioElement;
}