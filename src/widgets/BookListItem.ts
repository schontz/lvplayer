import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';

import * as css from './styles/bookListItem.m.css';
import * as mdc from './mdc/material-components-web.m.css';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import MdcIconButton from './MdcIconButton';
import MdcButton from './MdcButton';

export interface AuthorType {
	id: number;
	first_name: string;
	last_name: string;
	dob: string | number;
	dod?: string | number;
}

export interface BookType {
	title: string;
	authors: AuthorType[];
	description: string;
	copyright_year?: number | string;
	language?: string;
	totaltime?: string;
	totaltimesecs?: number;
	num_sections?: number;
}

export interface BookListItemProperties extends WidgetProperties, BookType {
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class BookListItem extends ThemedBase<BookListItemProperties> {
	private _expanded = false;
	private _inLibrary = false; // TODO make part of properties

	private _bookMeta() {
		const {
			language,
			totaltime,
			num_sections
		} = this.properties;

		let length = totaltime ? `Audio length: ${totaltime}.` : '';
		let chapters = num_sections && num_sections > 1 ? `Chapters: ${num_sections}.` : '';
		let lang = language ? `Language: ${language}` : '';

		return [
			v('p', {
				classes: [this.theme(css.meta), mdc.typography__subtitle2]
			}, [ `${length} ${chapters} ${lang}` ])
		];
	}

	private _bookActions () {
		return [
			w(MdcButton, {
				variant: 'outlined',
				icon: 'play_arrow',
				onClick: () => this._listenToMe()
			}, ['Listen Now']),
			' ',
			w(MdcButton, {
				icon: this._inLibrary ? 'playlist_add_check' : 'playlist_add',
				onClick: this._toggleLibrary,
			}, [this._inLibrary ? 'Remove from My Bookshelf' : 'Add to My Bookshelf'])
		];
	}

	private _listenToMe() {}

	private _toggleLibrary() {
		if(!this._inLibrary) {
			// POST addToLibrary 
		} else {
			// POST removeFromLibrary
		}
		this._inLibrary = !this._inLibrary;
		this.invalidate();
	}

	protected render() {
		const {
			title,
			authors,
			description,
			// copyright_year = ' '
		} = this.properties;


		let auths = authors.map((a) => {
			return v('span', {}, [
				v('cite', [a.first_name, ' ', a.last_name]),
				a.dob ? ` (${a.dob}-${a.dod})` : null
			]);
		});

		return [
			v('li', {
				classes: [mdc.listItem, this._expanded ? mdc.listItem__activated : null],
				onclick: () => {
					this._expanded = !this._expanded;
					this.invalidate();
				}
			}, [
					v('span', { classes: [mdc.listItem__graphic, mdc.icon ] },
						[this._expanded ? 'expand_more' : 'chevron_right']),
					v('span', { classes: [mdc.listItem__text] },
						[
							title,
							v('span', { classes: [mdc.listItem__secondaryText] }, auths)
						]),
					w(MdcIconButton, {
						icon: this._inLibrary ? 'check' : 'library_add',
						title: this._inLibrary ? 'Remove from My Bookshelf' : 'Add to My Bookshelf',
						onClick: (e: MouseEvent) => { e.preventDefault(); e.cancelBubble = true; this._toggleLibrary() },
						extraClasses: [mdc.listItem__meta]
					}),
				]),
				this._expanded ? v('li', {
					classes: [ this.theme(css.bookMore), mdc.elevation__z4 ]
					}, [
						...this._bookActions(),
						...this._bookMeta(),
						v('div', { classes: [mdc.typography__body2, this.theme(css.description)], innerHTML: description })
				]) : v('span', {}) // need to use an empty node because of 2.0.0 bug. fixed in 2.0.3
		];
	}
}