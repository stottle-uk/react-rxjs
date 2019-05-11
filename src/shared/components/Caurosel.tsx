import React, { CSSProperties } from 'react';
import { interval, Observable, Subject } from 'rxjs';
import { filter, map, scan, takeUntil, tap } from 'rxjs/operators';

interface CarouselProps extends React.HTMLProps<HTMLDivElement> {
  useRx: boolean;
  interval: number;
}

interface CarouselState {
  count: number;
  mouseOver: boolean;
  listStyle: CSSProperties;
  swiper: HTMLDivElement;
}

class Carousel extends React.Component<CarouselProps, CarouselState> {
  interval!: NodeJS.Timeout;
  destroy$ = new Subject();
  state: CarouselState = {
    ...this.state,
    count: 0,
    mouseOver: false,
    listStyle: {
      transform: 'translate3d(0px, 0, 0)',
      transition: 'transform 1s',
      whiteSpace: 'nowrap',
      overflow: 'visible'
    }
  };

  get carouselInterval$(): Observable<{}> {
    return interval(this.props.interval).pipe(
      filter(() => !this.state.mouseOver),
      scan(acc => (acc === this.state.count - 1 ? 0 : acc + 1), 0),
      map(count => this.getWidth(count)),
      tap(width => this.translateX(width))
    );
  }

  componentDidMount(): void {
    const { children, interval, useRx } = this.props;

    this.setState({
      count: React.Children.count(children)
    });

    if (useRx) {
      this.carouselInterval$.pipe(takeUntil(this.destroy$)).subscribe();
    } else {
      this.interval = setInterval(this.runCarouselInterval(), interval);
    }
  }

  componentWillUnmount(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.interval);
  }

  private runCarouselInterval(): () => number {
    let acc = 0;
    return () => {
      if (!this.state.mouseOver) {
        acc = acc === this.state.count - 1 ? 0 : acc + 1;
        const width = this.getWidth(acc);
        this.translateX(width);
      }
      return acc;
    };
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
    return -(
      count *
      parseInt(window.getComputedStyle(this.state.swiper).width as string, 10)
    );
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

  private onSwiperRef = (ref: HTMLDivElement): void => {
    this.setState({
      swiper: ref
    });
  };

  render() {
    const { className, children } = this.props;

    return (
      <div
        className={className}
        ref={this.onSwiperRef}
        onMouseEnter={this.onListMouseEnter}
        onMouseLeave={this.onListMouseLeave}
      >
        <div style={this.state.listStyle}>{children}</div>
      </div>
    );
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
