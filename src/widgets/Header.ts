import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';

import * as mdc from './mdc/material-components-web.m.css';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';

export interface HeaderProperties extends WidgetProperties {
	title: string;
	onClick?: (value: string) => void;
}

export const ThemedBase = ThemedMixin(WidgetBase);

export default class Header extends ThemedBase<HeaderProperties> {

	protected render() {
		const {
			title
		} = this.properties;

		return v("header", { classes: [mdc.topAppBar] }, [
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
					v("span", { classes: [mdc.topAppBar__title] }, [title])
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
							 this.properties.onClick && this.properties.onClick('bookshelf');
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
							 this.properties.onClick && this.properties.onClick('search');
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