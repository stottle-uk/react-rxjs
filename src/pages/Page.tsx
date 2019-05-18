import React, { useContext, useEffect, useState } from 'react';
import { tap } from 'rxjs/operators';
import { PageTemplateData } from '../pageData/models/pageEntry';
import { PageDataContext } from '../pageData/pageDataServices';
import Router from '../router/Router';

export const Page = () => {
  const [pageData, setPageData] = useState<PageTemplateData>();
  const { pageData$ } = useContext(PageDataContext);

  const pageDataEffect = () => {
    const subscription = pageData$
      .pipe(tap(pageData => setPageData(pageData)))
      .subscribe();
    return () => subscription.unsubscribe();
  };

  useEffect(pageDataEffect, []);

  return pageData && !pageData.loading ? (
    <Router {...pageData} />
  ) : (
    <div>loading!!!</div>
  );
};

export default Page;
