import { createContext } from 'react';
import { Paging } from '../../pageData/models/pageEntry';
import { listsService } from '../../pageData/pageDataServices';

interface GetMoreContext {
  getMore: (page: Paging) => void;
}

export const getMoreContext = createContext<GetMoreContext>({
  getMore: listsService.getMore.bind(listsService)
});

export const GetMoreProvider = getMoreContext.Provider;
export const GetMoreConsumer = getMoreContext.Consumer;
