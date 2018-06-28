import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';

import * as css from './styles/header.m.css';
import * as mdc from '../material/styles/material-components-web.m.css';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import uuid from '@dojo/core/uuid';
import WebAnimation, { AnimationProperties } from '@dojo/widget-core/meta/WebAnimation';
import { Dimensions } from '@dojo/widget-core/meta/Dimensions';

export interface HeaderProperties extends WidgetProperties {
	title: string;
	onNavigate?: (value: string) => void;
	addingBook?: AddAnimationBundle
}

export interface AddAnimationBundle {
	timestamp: Date;
	event: MouseEvent;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class Header extends ThemedBase<HeaderProperties> {
	private _homeId = uuid();
	private _bookshelfId = uuid();
	private _searchId = uuid();
	private _lastAdd: AddAnimationBundle;
	private _animating = false;
	private _wiggle = false;

	private _checkAddRequest(bundle?: AddAnimationBundle) {
		let newAdd = false;
		if(bundle) {
			if(this._lastAdd) {
				newAdd = this._lastAdd.timestamp !== bundle.timestamp;
			} else {
				newAdd = true;
			}

			if(newAdd) {
				this._lastAdd = bundle;
			}
		}
		return newAdd;
	}

	private _getAddAnimation() {
		const { position } = this.meta(Dimensions).get('bookshelf-link');
		const { event } = this._lastAdd;

		this._animating = true;
		this._wiggle = false;

		const dy = Math.abs(event.clientY - position.top);
		console.log(dy);

		const addBookAnimation: AnimationProperties = {
			id: 'addBook',
			effects: [
				// start
				{ left: `${event.clientX}px`, top: `${event.clientY}px`, transform: 'scale(1)', opacity: 1 },
				// middle
				{ transform: 'scale(2.5)', opacity: 0.7 },
				// end
				{ left: `${position.left+10}px`, top: `${position.top+10}px`, transform: 'scale(0.5)', opacity: 0.0 }
			],
			timing: {
				duration: 450,
				easing: 'ease-in',
				fill: 'forwards'
			},
			controls: {
				play: true,
				onFinish: () => {
					this._animating = false;
					this._wiggle = true;
					this.invalidate();
				}
			}
		}

		return addBookAnimation;
	}

	protected render() {
		console.log('render')
		const {
			title,
			onNavigate,
			addingBook
		} = this.properties;

		const shouldAnimate = this._checkAddRequest(addingBook);
		if(shouldAnimate) {
			this.meta(WebAnimation).animate('book-adding', this._getAddAnimation());
		}

		return v("header", { classes: [mdc.topAppBar, this.theme(css.root)] }, [
			v("div", { classes: [mdc.topAppBar__row] }, [
			  v(
				 "section",
				 {
					classes: [
					  mdc.topAppBar__section,
					  mdc.topAppBar__section__alignStart
					]
				 },
				 [
					v("span", { classes: [mdc.topAppBar__title] }, [
						v('a', {
							href: '#',
							id: this._homeId,
							classes: this.theme(css.titleLink),
							onclick: (e: MouseEvent) => {
								e.preventDefault();
								onNavigate && onNavigate('home');
							}
						}, [title])
					])
				 ]
			  ),
			  v(
				 "section",
				 {
					role: "toolbar",
					classes: [
						mdc.topAppBar__section,
						mdc.topAppBar__section__alignEnd
					]
				 },
				 [
					v(
					  "a",
					  {
						  key: 'bookshelf-link',
						  href: "#",
						  id: this._bookshelfId,
						  "aria-label": "My Bookshelf",
						  alt: "My Bookshelf",
						  title: "My Bookshelf",
						  classes: [mdc.icon, mdc.topAppBar__actionItem, this._wiggle ? css.wiggle : null],
						  onclick: (e: MouseEvent) => {
							  e.preventDefault();
							  onNavigate && onNavigate('bookshelf');
						  }
					  },
					  ["library_books"]
					 ),
					 ' ',
					 v(
					  "a",
					  {
						 href: "#",
						 id: this._searchId,
						 "aria-label": "Search",
						 alt: "Search",
						 title: "Search",
						 classes: [mdc.icon, mdc.topAppBar__actionItem],
						 onclick: (e:MouseEvent) => {
							 e.preventDefault();
							 onNavigate && onNavigate('search');
						 }
					  },
					  ["search"]
					)
				 ]
			  )
			]),
			v('div', {
				key: 'book-adding',
				classes: [this.theme(css.bookAdding), mdc.icon, mdc.topAppBar__actionItem],
				style: `display: ${this._animating ? 'block' : 'none'}`
			}, ["library_books"])
		]);		 
	}
}