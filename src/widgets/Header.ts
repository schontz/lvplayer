import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';

import * as css from './styles/header.m.css';
import * as mdc from '../material/styles/material-components-web.m.css';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';

export interface HeaderProperties extends WidgetProperties {
	title: string;
	onNavigate?: (value: string) => void;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class Header extends ThemedBase<HeaderProperties> {

	protected render() {
		const {
			title,
			onNavigate
		} = this.properties;

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
						 href: "#",
						 "aria-label": "My Bookshelf",
						 alt: "My Bookshelf",
						 title: "My Bookshelf",
						 classes: [mdc.icon, mdc.topAppBar__actionItem],
						 onclick: (e:MouseEvent) => {
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
			])
		 ]);		 
	}
}