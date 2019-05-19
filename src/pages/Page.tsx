import React, { useContext, useEffect, useState } from 'react';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PageTemplateData } from '../pageData/models/pageEntry';
import { PageDataContext } from '../pageData/pageDataServices';
import Router from '../router/Router';
import PageNotFound from './PageNotFound';

export const Page = () => {
  const [pageData, setPageData] = useState<PageTemplateData>();

  const { pageData$ } = useContext(PageDataContext);

  const pageDataEffect = () => {
    const subscription = pageData$
      .pipe(
        catchError(() =>
          of({
            pageEntry: {},
            lists: {}
          } as PageTemplateData)
        ),
        tap(pageData => setPageData(pageData))
      )
      .subscribe();
    return () => subscription.unsubscribe();
  };

  useEffect(pageDataEffect, []);

  return pageData ? (
    <div>
      <PageLoading {...pageData} />
      <PageBody {...pageData} />
    </div>
  ) : (
    <Loading />
  );
};

export default Page;

const PageBody = (props: PageTemplateData) => {
  return !props.loading ? (
    <Router routeData={props}>
      <PageNotFound />
    </Router>
  ) : null;
};

const PageLoading = (pageData: PageTemplateData) => {
  return pageData.loading || pageData.listsLoading ? <Loading /> : null;
};

const Loading = () => {
  return <div>loading!!!</div>;
};
