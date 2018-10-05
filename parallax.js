import { TweenLite, Expo } from 'gsap';
import _throttle from 'lodash.throttle';

const getOffset = el => {
  let top = 0;
  let left = 0;

  do {
    top += el.offsetTop;
    left += el.offsetLeft;

    el = el.offsetParent;
  } while (el);

  return {
    left,
    top,
  };
};

const getSize = el => {
  if (el instanceof Window) {
    return { width: el.innerWidth, height: el.innerHeight };
  }

  return { width: el.offsetWidth, height: el.offsetHeight };
};

const getScrollPosition = el => {
  if (el instanceof Window) {
    return { top: el.scrollY, left: el.scrollX };
  }

  return { top: el.scrollTop, left: el.scrollLeft };
};

export default class ParallaxController {
  constructor(elements, options) {
    const parallax = this;
    this.elements = Array.isArray(elements) ? elements : [elements];
    this.multiplier = options.multiplier || 0.25;
    this.direction = options.direction || 'up';
    this.breakpoint = options.breakpoint || 1025;
    this.axis =
      this.direction === 'up' || this.direction === 'down' ? 'y' : 'x';
    this.container = options.container || window;
    this.data = new WeakMap();
    this.elements.forEach((el, index) => {
      const offset = getOffset(el);
      const elementOptions = {
        initialOffset: this.axis === 'y' ? offset.top : offset.left,
        initialWidth: el.offsetWidth,
        initialHeight: el.offsetHeight,
        currentDelta: 0,
        newDelta: 0,
        tween: null,
      };
      this.elements[index].dataset.parallaxOptions = this.data.set(
        el,
        elementOptions,
      );
    });
    this.mq = window.matchMedia(`(min-width: ${this.breakpoint}px)`);

    const animate = parallax.animate.bind(parallax);

    this.container.addEventListener(
      'scroll',
      _throttle(() => {
        animate();
      }, 200),
    );
    window.addEventListener('load ', () => animate());
    animate();
  }
  animate() {
    if (!this.mq.matches) {
      return;
    }
    const scrollPosition = getScrollPosition(this.container)[
      this.axis === 'y' ? 'top' : 'left'
    ];
    const size = getSize(this.container)[
      this.axis === 'y' ? 'height' : 'width'
    ];
    const middleOfPage = scrollPosition - size / 2;

    this.elements.forEach((el, index) => {
      const options = this.data.get(this.elements[index]);
      const middleOfElement =
        options.initialOffset +
        getSize(el)[this.axis === 'y' ? 'height' : 'width'] / 2;

      if (options) {
        let tweenDelta;
        options.newDelta = this.multiplier * (middleOfElement - middleOfPage);

        if (options.tween) {
          options.tween.kill();
        }

        if (this.direction === 'down' || this.direction === 'right') {
          tweenDelta =
            options.currentDelta +
            (options.currentDelta - options.newDelta) * 0.3;
        } else {
          tweenDelta =
            options.currentDelta -
            (options.currentDelta - options.newDelta) * 0.3;
        }

        const tweenOptions = {
          [this.axis]: tweenDelta,
          ease: Expo.easeOut,
        };
        options.tween = TweenLite.to(el, 3 * this.multiplier, tweenOptions);
        this.data.set(this.elements[index], options);
      }
    });
  }
}
