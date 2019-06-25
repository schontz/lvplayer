import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/widget-core/mixins/Themed';
import { v } from '@dojo/framework/widget-core/d';
import { CustomAriaProperties } from '@dojo/widgets/common/interfaces';
import { formatAriaProperties } from '@dojo/widgets/common/util';
import * as css from '../theme/mediaIcon.m.css';
import * as baseCss from '@dojo/widgets/common/styles/base.m.css';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';

export type IconType = keyof typeof css;

/**
 * @type IconProperties
 *
 * Properties that can be set on an Icon component
 *
 * @property type           Icon type, e.g. downIcon, searchIcon, etc.
 * @property altText        An optional, visually hidden label for the icon
 */
export interface MediaIconProperties extends ThemedProperties, CustomAriaProperties {
	type: IconType;
	altText?: string;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@customElement<MediaIconProperties>({
	tag: 'media-icon',
	properties: [
		'theme',
		'aria',
		'extraClasses'
	],
	attributes: [ 'type', 'altText' ]
})
export class MediaIconBase<P extends MediaIconProperties = MediaIconProperties> extends ThemedBase<P, null> {

	protected renderAltText(altText: string): DNode {
		return v('span', { classes: [ baseCss.visuallyHidden ] }, [ altText ]);
	}

	render(): DNode {
		const {
			aria = {
				hidden: 'true'
			},
			type,
			altText
		} = this.properties;

		return v('span', { key: 'root', classes: this.theme(css.root) }, [
			v('i', {
				...formatAriaProperties(aria),
				classes: this.theme([ css.icon, css[type] ])
			}),
			altText ? this.renderAltText(altText as string) : null
		]);
	}
}

export default class MediaIcon extends MediaIconBase<MediaIconProperties> {}
