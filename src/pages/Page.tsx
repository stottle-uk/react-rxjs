import React, { useEffect, useState } from 'react';
import { tap } from 'rxjs/operators';
import { PageTemplateData } from '../pageData/models/pageEntry';
import { pagesDataService } from '../pageData/pageDataServices';
import Router from '../router/Router';

export const Page = () => {
  const [pageData, setPageData] = useState<PageTemplateData>();

  const pageDataEffect = () => {
    const subscription = pagesDataService.pageData$
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
