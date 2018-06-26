import { Container } from '@dojo/widget-core/Container';
import ApplicationContext from '../ApplicationContext';
import Bookshelf, { BookshelfProperties } from '../widgets/Bookshelf';

function getProperties(inject: ApplicationContext, properties: any): BookshelfProperties {
	return {
		books: inject.myBookshelf
	};
}

const BookshelfContainer = Container(Bookshelf, 'state', { getProperties });

export default BookshelfContainer;