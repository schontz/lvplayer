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
		onToggleBookshelf: (e: MouseEvent) => {
			const added = inject.addRemoveFromMyBookshelf(book);
			properties.onToggleBookshelf && properties.onToggleBookshelf(e);
			if(added) {
				const node = <HTMLElement>e.target;
				// TODO how can we animate this button to the bookshelf?
			}
		},
		onListenNow: () => {
			inject.playAudiobook(book);
			properties.onListenNow && properties.onListenNow();
		}
	};
}

const BookListItemContainer = Container(BookListItem, 'state', { getProperties });

export default BookListItemContainer;