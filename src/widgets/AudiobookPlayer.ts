import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';

import * as css from './styles/audiobookPlayer.m.css';
import * as mdc from './mdc/material-components-web.m.css';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import MediaIcon from './MediaIcon';
import Button from '@dojo/widgets/button';
import MdcIconButton from './MdcIconButton';
import MdcLinearProgress from './MdcLinearProgress';

export interface AudiobookItem {
	title?: string;
	url?: string;
	duration?: string;
}

export interface AudiobookPlayerProperties extends WidgetProperties {
	name?: string;
	sources?: AudiobookItem[];
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class AudiobookPlayer extends ThemedBase<AudiobookPlayerProperties> {
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
			console.log('Audio source:',src);
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
		const {
			sources = []
		} = this.properties;

		if (this._currentTrack < sources.length - 1) {
			this._gotoTrack(this._currentTrack + 1, true);
		}
	}

	private _gotoTrack(idx: number, andPlay = false) {
		const {
			sources = []
		} = this.properties;

		const url = sources[idx] ? sources[idx].url || '' : '';

		let playing = this._isPlaying();
		if (this._setSource(url, playing || andPlay)) {
			this._currentTrack = idx;
		}
	}

	private _currentTime = 0;
	private _duration = 0;
	private _currentTrack = -1;
	private _shuffling = false;
	private _looping = false;

	protected _onTimeUpdate() {
		this._currentTime = Math.floor(this._audio.currentTime);
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

	private _isPlaying() {
		return this._audio.duration > 0 && !this._audio.paused;
	}

	protected render() {
		const {
			sources = []
		} = this.properties;

		if(this._currentTrack <= 0 ) {
			this._gotoTrack(0);
		}

		const minValue = this._isPlaying() ? 0.01 : 0;
		const progress = Math.max(this._currentTime / this._duration, minValue);

		return v('div', {
			key: 'root',
			classes: [mdc.elevation__z4, this.theme(css.root), mdc.theme__surface]
		}, [
			w(MdcLinearProgress, { extraClasses: [this.theme(css.progress)], progress: progress }),
			v('div', {
				key: 'controls',
				classes: this.theme(css.controls)
			}, [
				w(MdcIconButton, {
					icon:'replay_10',
					onClick: () => this._gotoTrack(this._currentTrack-1)
				}),
				w(MdcIconButton, {
					icon: this._isPlaying() ? 'pause' : 'play_arrow',
					onClick: () => this._playPause()
				}),
				w(MdcIconButton, {
					icon: 'forward_10',
					onClick: () => this._gotoTrack(this._currentTrack+1)
				})
			]),
			v('div', {
				classes: this.theme(css.timeDisplay)
			}, [
					v('span', {
						key: 'currentTime',
						classes: this.theme([css.currentTime, this._duration <= 0 ? css.none : null])
					}, [this._formatTime(this._currentTime)]),
					' / ',
					v('span', {
						key: 'durationTime',
						classes: [
							...this.theme([css.durationTime, this._duration <= 0 ? this.theme(css.none) : null])
						]
					}, [this._formatTime(this._duration)])
			])
		]);
	}
}
