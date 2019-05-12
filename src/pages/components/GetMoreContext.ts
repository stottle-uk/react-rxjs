import { createContext } from 'react';
import { Paging } from '../../pageData/models/pageEntry';
import { listsService } from '../../pageData/pageDataServices';

interface GetMoreContext {
  getMore: (page: Paging) => void;
}

const context = createContext<GetMoreContext>({
  getMore: listsService.getMore.bind(listsService)
});

export const GetMoreProvider = context.Provider;
export const GetMoreConsumer = context.Consumer;
