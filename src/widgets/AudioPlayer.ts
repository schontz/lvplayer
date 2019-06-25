import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Slider from '@dojo/widgets/slider';
import { v, w } from '@dojo/framework/widget-core/d';

import * as css from './styles/audioPlayer.m.css';
import { WidgetProperties } from '@dojo/framework/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/framework/widget-core/mixins/Themed';
import MediaIcon from './MediaIcon';
import Button from '@dojo/widgets/button';

/*
The slider is a little funky because of the ms delay. Somehow I need to stop listening to _currentTime
when you are sliding the slider. I don't think there's a slider start/end event though.
*/

export interface AudioPlayerProperties extends WidgetProperties {
	name?: string;
	sources: string[];
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class AudioPlayer extends ThemedBase<AudioPlayerProperties> {
	private _audio = new Audio();

	private _playPause() {
		if(this._isPlaying()) {
			this._audio.pause();
		} else {
			this._audio.play();
		}
		this.invalidate();
	}

	private _setSource(src: string, andPlayIt = false) {
		// Otherwise nothing plays because the source is constantly reset.
		// This widget probably needs some things to live outside of render land.
		// How can the src be set on creation instead of render?
		if(this._audio.src != src) {
			this._audio.src = src;
			this._audio.ontimeupdate = () => { this._onTimeUpdate(); };
			this._audio.onloadedmetadata = () => {
				this._onTimeUpdate();
				andPlayIt && this._audio.play();
			};
			this._audio.onended = () => { this._playNext(); }
			return true;
		}
		return false;
	}

	private _playNext() {
		if (this._currentTrack < this.properties.sources.length - 1) {
			this._gotoTrack(this._currentTrack + 1, true);
		}
	}

	private _gotoTrack(idx: number, andPlay = false) {
		let playing = this._isPlaying();
		if (this._setSource(this.properties.sources[idx], playing || andPlay)) {
			this._currentTrack = idx;
		}
	}

	private _currentTime = 0;
	private _duration = 0;
	private _sliderTime = 0;
	private _currentTrack = -1;
	private _shuffling = false;
	private _looping = false;

	protected _onTimeUpdate() {
		this._currentTime = this._sliderTime = Math.floor(this._audio.currentTime);
		this._duration = Math.floor(this._audio.duration);
		this.invalidate();
	}

	private _formatTime(time: number) {
		time = time || 0;
		let m = Math.floor(time / 60);
		let s = Math.floor(time - m * 60);
		let h = 0;
		while(m >= 60) {
			m -= 60;
			h++;
		}
		return [h,m,s].map((v) => {
			return v.toString().length < 2 ? `0${v}` : v;
		}).join(':');
	}

	private _sliderRateTO = 0;
	private _onSliderInput(num: number) {
		clearTimeout(this._sliderRateTO);
		this._sliderRateTO = window.setTimeout(() => { this._audio.currentTime = num; }, 100);
	}

	private _isPlaying() {
		return this._audio.duration > 0 && !this._audio.paused;
	}

	protected render() {
		if(this._currentTrack <= 0 ) {
			this._gotoTrack(0);
		}

		return v('div', {
			key: 'root',
			classes: this.theme(css.root)
		}, [
			v('div', {
				key: 'controls',
				classes: this.theme(css.controls)
			}, [
				w(Button, {
					key: 'previousTrack',
					extraClasses: { root: css.controlIcon },
					disabled: this._currentTrack == 0,
					onClick: () => { this._gotoTrack(this._currentTrack-1) }
				}, [w(MediaIcon, { type: 'previousTrackIcon'})]),
				w(Button, {
					key: 'playPause',
					extraClasses: { root: css.controlIcon },
					onClick: () => { this._playPause(); }
				}, [ w(MediaIcon, { type: this._isPlaying() ? 'pauseIcon' : 'playIcon' }) ]),
				w(Button, {
					key: 'nextTrack',
					extraClasses: { root: css.controlIcon },
					disabled: this._currentTrack == this.properties.sources.length - 1,
					onClick: () => { this._gotoTrack(this._currentTrack+1) }
				}, [w(MediaIcon, { type: 'nextTrackIcon'})]),
				w(Button, {
					key: 'shuffle',
					extraClasses: { root: css.controlIcon },
					pressed: this._shuffling,
					onClick: () => {
						this._shuffling = !this._shuffling;
						this.invalidate();
					}
				}, [w(MediaIcon, { type: 'shuffleIcon'})]),
				w(Button, {
					key: 'loop',
					extraClasses: { root: css.controlIcon },
					pressed: this._looping,
					onClick: () => {
						this._looping = !this._looping;
						this.invalidate();
					}
				}, [w(MediaIcon, { type: 'loopIcon'})]),
			]),
			v('span', {
				key: 'currentTime',
				classes: this.theme([css.trackTime, css.currentTime, this._duration <= 0 ? css.none : null])
			}, [ this._formatTime(this._currentTime) ]),
			v('div', {
					key: 'slider-container',
					classes: this.theme(css.sliderContainer)
				}, [
				w(Slider, {
					theme: this.properties.theme,
					key: 'slider',
					min: 0,
					max: this._duration,
					value: this._sliderTime,
					disabled: this._duration <= 0,
					onInput: (num: number) => {
						this._onSliderInput(num);
						this._sliderTime = num;
						this.invalidate();
					},
				})
			]),
			v('span', {
				key: 'durationTime',
				classes: this.theme([css.trackTime, css.durationTime, this._duration <= 0 ? this.theme(css.none) : null])
			}, [ this._formatTime(this._duration) ])
		]);
	}
}
