import React from 'react';
import { interval, Observable, Subject } from 'rxjs';
import { filter, map, scan, takeUntil, tap } from 'rxjs/operators';
import Link from '../../router/Link';
import { Item, List } from '../models/pageEntry';
import './HeroStandard3x1.css';

interface Stuff {
  deltaX: number;
  index: number;
}

interface PropsState {
  mouseOver: boolean;
  listStyle: {
    transition: string;
    transform: string;
  };
}

class HeroStandard3x1 extends React.Component<List, PropsState> {
  destroy$ = new Subject();
  state = {
    mouseOver: false,
    listStyle: {
      transform: 'translate3d(0px, 0, 0)',
      transition: 'transform 0.25s'
    }
  };

  get carouselTimer$(): Observable<{}> {
    return interval(1500).pipe(
      filter(() => !this.state.mouseOver),
      scan(acc => (acc === this.props.items.length - 1 ? 0 : acc + 1), 0),
      map(count => this.getWidth(count)),
      tap(width => this.translateX(width))
    );
  }

  componentDidMount(): void {
    this.carouselTimer$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  componentWillUnmount(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private translateX = (width: number): void => {
    this.setState({
      listStyle: {
        ...this.state.listStyle,
        transform: `translate3d(${width}px, 0, 0)`
      }
    });
  };

  private getWidth = (count: number): number => {
    return -(count * 640);
  };

  private onListMouseEnter = (): void => {
    this.setState({
      mouseOver: true
    });
  };

  private onListMouseLeave = (): void => {
    this.setState({
      mouseOver: false
    });
  };

  render() {
    return (
      <div>
        <h1>
          <Link to={this.props.path}>
            {this.props.title} <small>{this.props.id}</small>
          </Link>
        </h1>

        <div
          className="swiper"
          onMouseEnter={this.onListMouseEnter}
          onMouseLeave={this.onListMouseLeave}
        >
          <ul
            className="swiper__list"
            style={this.state && this.state.listStyle}
          >
            {this.renderList(this.props.items)}{' '}
          </ul>
        </div>
      </div>
    );
  }

  private renderList(items: Item[]): React.ReactNodeArray {
    return (
      items &&
      items.map(item => (
        <li className="swiper__item" key={item.id}>
          <div className="product-card">
            <div className="product-card__poster">
              <img
                className="product-card__image"
                src={item.images ? item.images.poster : ''}
              />
            </div>
          </div>
        </li>
      ))
    );
  }
}

export default HeroStandard3x1;

// const elSwiper = document.querySelector('.swiper');
// const elList = elSwiper.querySelector('.swiper__list');
// const elIndicator = elSwiper.querySelector('.swiper__indicator');
// const elPrevious = elSwiper.querySelector('.swiper__button--prev');
// const elNext = elSwiper.querySelector('.swiper__button--next');
// const count = elList.querySelectorAll('.swiper__item').length - 1;
// const pointerdown$ = Rx.Observable.fromEvent(elList, 'pointerdown', {passive: true});
// const pointermove$ = Rx.Observable.fromEvent(window, 'pointermove', {passive: true});
// const pointerup$ = Rx.Observable.fromEvent(window, 'pointerup', {passive: true});
// const dragstart$ = Rx.Observable.fromEvent(elList, 'dragstart');

// const dragging$ = pointerdown$
//     .mergeMap((start) => pointermove$
//         .takeUntil(pointerup$)
//         .map(move => move.pageX - start.pageX))
//     .map(deltaX => (state) => Object.assign({}, state, {deltaX}));

// const dragend$ = dragging$
//     .switchMap(() => pointerup$
//         .take(1))
//     .withLatestFrom(dragging$)
//     .map(([, fn]) => ({index}) => {
//         const {deltaX} = fn();
//         index = index < count && deltaX < -50 ? index + 1 : index;
//         index = index > 0 && deltaX > 50 ? index - 1 : index;
//         return {index};
//     });

// const previous$ = Rx.Observable.fromEvent(elPrevious, 'click')
//     .map(() => ({index}) => ({index: index > 0 ? index - 1 : index}));

// const next$ = Rx.Observable.fromEvent(elNext, 'click')
//     .map(() => ({index}) => ({index: index < count ? index + 1 : index}));

// const indication$ = Rx.Observable.fromEvent(elIndicator, 'click')
//     .map(el => el.target.closest('.swiper__indication'))
//     .filter(el => el !== null)
//     .map(el => () => ({index: parseInt(el.dataset.index, 10)}));

// Rx.Observable.merge(dragging$, dragend$, previous$, next$, indication$)
//     .scan((state, changeFn) => changeFn(state), {deltaX: 0, index: 0})
//     .subscribe(({deltaX, index}) => {
//         const width = -(index * (parseInt(window.getComputedStyle(elSwiper).width, 10) + 10));
//         if (deltaX !== undefined) {
//             translateX(elList, width + deltaX);
//         } else {
//             translateX(elList, width, .2, () => {
//                 updateIndicator(elIndicator, index);
//             });
//         }
//     });

// dragstart$
//     .filter(e => e.target.closest('.product-card__image'))
//     .subscribe((e) => e.preventDefault());

// function translateX(element, deltaX, duration = 0, callback = null) {
//     element.style.transition = `transform ${duration}s`;
//     element.style.transform = `translate3d(${deltaX}px, 0, 0)`;
//     if (duration > 0 && callback) {
//         element.addEventListener('transitionend', callback, {once: true})
//     }
// }

// function updateIndicator(element, index) {
//     element.querySelector('.swiper__indication--active').classNameList.remove('swiper__indication--active');
//     element.querySelector(`.swiper__indication:nth-child(${index + 1})`).classNameList.add('swiper__indication--active');
// }
