import { Container } from '@dojo/framework/widget-core/Container';
import ApplicationContext from '../ApplicationContext';
import { AudiobookChapterType, AudiobookType } from '../interfaces';
import Search, { SearchProperties } from '../widgets/Search';

function getProperties(inject: ApplicationContext, properties: any): SearchProperties {
	const {
		searchResults: results,
	} = inject;

	return {
		results,
		onSearch: (v: string) => { inject.search(v) }
	};

}

const SearchContainer = Container(Search, 'state', { getProperties });

export default SearchContainer;