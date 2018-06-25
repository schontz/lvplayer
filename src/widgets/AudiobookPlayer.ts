import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';

import * as css from './styles/audiobookPlayer.m.css';
import * as mdc from './mdc/material-components-web.m.css';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import MdcIconButton from './MdcIconButton';
import MdcLinearProgress from './MdcLinearProgress';
import { AudiobookChapterType, AudiobookType } from '../interfaces';
import Select from '@dojo/widgets/select';
import { diffProperty } from '@dojo/widget-core/decorators/diffProperty';
import { auto } from '@dojo/widget-core/diff';

export interface AudiobookPlayerProperties extends WidgetProperties {
	book: AudiobookType;
	onPause?(): void;
	onPlay?(): void;
	onPlayPause?(): void;
	onTimeUpdate?(currentTime: number): void;
	onGotoChapter?(chapter: AudiobookChapterType, index: number): void;
	onBookChange?(newBook: AudiobookType): void;
	playOnLoad?: boolean;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class AudiobookPlayer extends ThemedBase<AudiobookPlayerProperties> {
	private _audio = new Audio();
	private _newBook = false;

	@diffProperty('book', auto)
	private _onBookChange(oldProperites: AudiobookPlayerProperties, newProperties: AudiobookPlayerProperties) {
		// if oldProperties is empty then we have yet to load a book. Essentially it is onFirstLoad

		this._newBook = true;
		const newBook = newProperties.book;

		// Load in book and chapters -- no need, it will already have its chapters when we get it b/c App Context
		/*

		// Goto proper chapter
		const chapter = newBook.currentChapter || 0;
		const position = newBook.currentPosition;

		// Play at proper position
		this._gotoChapter(chapter, true, position);

		this.properties.onBookChange && this.properties.onBookChange(newBook);
		*/
	}

	private _attached = false;
	onAttach() {
		this._attached = true;
	}

	private _playPause() {
		if(this._isPlaying()) {
			this._audio.pause();
			this.properties.onPause && this.properties.onPause();
		} else {
			this._audio.play();
			this.properties.onPlay && this.properties.onPlay();
		}
		this.properties.onPlayPause && this.properties.onPlayPause();
		this.invalidate();
	}

	private _progressIndeterminate = false;

	private _setSource(src: string, andPlayIt = false, position = 0) {
		// Otherwise nothing plays because the source is constantly reset.
		// This widget probably needs some things to live outside of render land.
		// How can the src be set on creation instead of render?
		if(this._audio.src != src) {
			this._progressIndeterminate = true;
			this._audio.src = src;
			this._audio.ontimeupdate = () => { this._onTimeUpdate(); };
			this._audio.onloadedmetadata = () => {
				this._progressIndeterminate = false;
				this._audio.currentTime = position;
				this._onTimeUpdate();
				andPlayIt && this._audio.play();
				this.invalidate();
			};
			this._audio.onended = () => { this._playNext(); }
			return true;
		}
		return false;
	}

	private _playNext() {
		const chapters = this._getChapters();

		const next = this._getBookChapter() + 1;
		if (next < chapters.length) {
			this._gotoChapter(next, true);
		}
	}

	private _gotoChapter(idx: number, andPlay = false, position = 0) {
		const {
			onGotoChapter
		} = this.properties;
		const chapters = this._getChapters();

		const track = chapters[idx];
		const url = track ? track.url || '' : '';

		const playing = this._isPlaying();
		if (url && this._setSource(url, playing || andPlay, position)) {
			onGotoChapter && onGotoChapter(track, idx);
		}
	}

	private _jump(seconds:number) {
		let time = this._audio.currentTime;
		let newTime = time + seconds;
		if(newTime < 0) {
			newTime = 0;
		} else if(newTime > this._duration) {
			newTime = this._duration;
		}

		if(time != newTime) {
			this._audio.currentTime = newTime;
			this.invalidate();
		}
	}

	private _currentTime = 0;
	private _duration = 0;
	private _shuffling = false;
	private _looping = false;

	protected _onTimeUpdate() {
		this._currentTime = Math.floor(this._audio.currentTime);
		this._duration = Math.floor(this._audio.duration);
		this.properties.onTimeUpdate && this.properties.onTimeUpdate(this._currentTime);
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

	private _getChapters() {
		if(this.properties.book) {
			return this.properties.book.chapters || [];
		}
		return [];
	}

	private _getBookChapter() {
		if(this.properties.book) {
			return this.properties.book.currentChapter || 0;
		}
		return 0;
	}

	private _getBookPosition() {
		if(this.properties.book) {
			return this.properties.book.currentPosition || 0;
		}
		return 0;
	}

	private _renderPlayer() {
		const book: Partial<AudiobookType> = this.properties.book || {};
		const {
			chapters = [],
			title = ''
		} = book;

		/*
		if(this._getBookChapter() <= 0 ) {
			this._gotoChapter(0, this.properties.playOnLoad);
		}
		*/

		const minValue = this._isPlaying() ? 0.01 : 0;
		const progress = this._duration > 0 ?
			Math.max(this._currentTime / this._duration, minValue) :
			1;

		return v('div', {
			key: 'root',
			classes: [mdc.elevation__z4, this.theme(css.root), mdc.theme__surface]
		}, [
				w(MdcLinearProgress, {
					indeterminate: this._progressIndeterminate,
					extraClasses: [this.theme(css.progress)], progress: progress
				}),
			v('div', {
				key: 'controlsAndDisplays',
				classes: this.theme(css.controlsAndDisplays)
				}, [
					v('div', { classes: [mdc.typography__caption, this.theme(css.bookDisplay)] }, [ // left 1/3rd
						v('div', { classes: [mdc.typography__subtitle2, this.theme(css.bookTitle)], title }, [title]),
						chapters.length ? w(Select, {
							key: 'chapterSelector',
							useNativeElement: true,
							getOptionLabel: (option: AudiobookChapterType) => option.title,
							getOptionValue: (option: AudiobookChapterType) => option.index.toString(),
							getOptionSelected: (option: AudiobookChapterType) => option.index == this._getBookChapter(),
							getOptionDisabled: (option: AudiobookChapterType) => false,
							options: chapters.map((ch, index) => {
								return { ...ch, index, key:`${index}_${ch.url}` };
							}),
							value: this._getBookChapter().toString(),
							onChange: (option: AudiobookChapterType) => {
								this._gotoChapter(option.index, true);
								this.invalidate();
							}
						}) : null
					]),
					v('div', { // middle 1/3rd
						key: 'controls',
						classes: this.theme(css.controls)
					}, [
							w(MdcIconButton, {
								icon: 'replay_30',
								onClick: () => this._jump(-30),
								disabled: !this._audio.src,
								extraClasses: this.theme([css.icon, css.rewind])
							}),
							w(MdcIconButton, {
								icon: this._isPlaying() ? 'pause' : 'play_arrow',
								onClick: () => this._playPause(),
								disabled: !this._audio.src,
								extraClasses: this.theme([css.icon, css.playPause])
							}),
							w(MdcIconButton, {
								icon: 'forward_30',
								onClick: () => this._jump(30),
								disabled: !this._audio.src,
								extraClasses: this.theme([css.icon, css.forward])
							})
					]),
					v('div', { // right 1/3rd
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
				])
			]);
	}

	protected render() {
		if(this._newBook) {
			this._newBook = false;
			const {
				book: {
					currentChapter = 0,
					currentPosition = 0
				}
			} = this.properties;

			// Play at proper position
			this._gotoChapter(currentChapter, this._attached, currentPosition);

			this.properties.onBookChange && this.properties.onBookChange(this.properties.book);
		}
		return this._renderPlayer();
	}
}