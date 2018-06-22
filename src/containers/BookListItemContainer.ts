import { Container } from '@dojo/widget-core/Container';
import ApplicationContext from '../ApplicationContext';
import BookListItem, { BookListItemProperties } from '../widgets/BookListItem';

function getProperties(inject: ApplicationContext, properties: any): BookListItemProperties {
	const book = properties.book;
	const inBookshelf = inject.inBookshelf(book);
	const currentlyPlaying = inject.isCurrentBook(book);

	return {
		...properties,
		key: book.id,
		inBookshelf,
		currentlyPlaying,
		onToggleBookshelf: () => {
			inject.addRemoveFromMyBookshelf(book);
		},
		onListenNow: () => {
			inject.playAudiobook(book);
		}
	};
}

const BookListItemContainer = Container(BookListItem, 'state', { getProperties });

export default BookListItemContainer;