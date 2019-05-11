import { first } from 'rxjs/operators';
import { BrowserHistory } from '../BrowserHistory';

describe('Browser History', () => {
  let browserHistory: BrowserHistory;

  beforeAll(() => {
    browserHistory = new BrowserHistory();
  });

  describe('Pages', () => {
    fit('initial path should be current the current path', done => {
      browserHistory.activatedPath$.pipe(first()).subscribe(val => {
        expect(val).toEqual('/');
        done();
      });
    });

    fit('initial route should be current', done => {
      console.log('hello2');

      browserHistory.go('/2');

      browserHistory.activatedPath$.subscribe(val => {
        console.log(val);
        done();
      });
    });

    fit('initial route should be current', done => {
      console.log('hello3');

      browserHistory.back();

      browserHistory.activatedPath$.subscribe(val => {
        console.log(val);
        done();
      });
    });

    fit('initial route should be current', done => {
      console.log('hello3');

      browserHistory.forward();

      browserHistory.activatedPath$.subscribe(val => {
        console.log(val);
        done();
      });
    });
  });
});
