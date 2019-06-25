import { Container } from '@dojo/framework/widget-core/Container';
import ApplicationContext from '../ApplicationContext';
import BookListItem, { BookListItemProperties } from '../widgets/BookListItem';
import { DimensionResults } from '@dojo/framework/widget-core/meta/Dimensions';

function getProperties(inject: ApplicationContext, properties: any): BookListItemProperties {
	const book = properties.book;
	const inBookshelf = inject.inBookshelf(book);
	const currentlyPlaying = inject.isCurrentBook(book);

	return {
		...properties,
		key: book.id,
		inBookshelf,
		currentlyPlaying,
		onToggleBookshelf: (e: MouseEvent, dimensions: DimensionResults) => {
			const added = inject.addRemoveFromMyBookshelf(book);
			properties.onToggleBookshelf && properties.onToggleBookshelf(e, dimensions);
			added && properties.onAddToBookshelf && properties.onAddToBookshelf(book, e, dimensions);
		},
		onListenNow: () => {
			inject.playAudiobook(book);
			properties.onListenNow && properties.onListenNow();
		}
	};
}

const BookListItemContainer = Container(BookListItem, 'state', { getProperties });

export default BookListItemContainer;