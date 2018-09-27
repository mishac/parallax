import TweenLite from 'gsap/TweenLite';
import 'gsap/CSSPlugin';
import { Expo } from 'gsap/EasePack';
import _throttle from 'lodash.throttle';

const getOffset = el => {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft,
  };
};

const getSize = el => {
  if (el instanceof Window) {
    return { width: el.innerWidth, height: el.innerHeight };
  }

  return { width: el.clientWidth, height: el.clientHeight };
};

const getScrollPosition = el => {
  if (el instanceof Window) {
    return { top: el.scrollY, left: el.scrollX };
  }

  return { top: el.scrollTop, left: el.scrollLeft };
};

class ParallaxController {
  constructor(elements, options) {
    const parallax = this;
    this.elements = Array.from(elements);
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
  animate(offset = false) {
    if (!this.mq.matches) {
      return;
    }
    const scrollPosition =
      offset ||
      getScrollPosition(this.container)[this.axis === 'y' ? 'top' : 'left'];
    const size = getSize(this.container)[
      this.axis === 'y' ? 'height' : 'width'
    ];
    const middleOfPage = scrollPosition + size / 2;

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

module.exports = ParallaxController;
