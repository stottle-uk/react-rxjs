import React from 'react';
import { interval } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Item } from '../../pageData/models/pageEntry';
import './HeroStandard3x1.css';

class Carousel extends React.PureComponent<Item[]> {
  swiperEl: HTMLDivElement;

  onSwiper(el: HTMLDivElement) {
    const t = window.getComputedStyle(el);
    console.log(t);
  }

  componentDidMount(): void {
    interval(500)
      .pipe(
        take(20),
        tap(console.log)
      )
      .subscribe();
  }

  render() {
    return <div>{/* <pre>{JSON.stringify(this.props, null, 2)}</pre> */}</div>;
  }
}

export default Carousel;

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
