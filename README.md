# parallax
Parallax on scroll animation effect, used on couleecreative.com

## Usage

```
new ParallaxController(elements, options);
```

## Parameters
### elements
A single DOM node, or an array of nodes.

### options
####  multiplier
The speed at which the elements should move on scroll.  Default is ``0.25``
####  direction
The direction the elements should move on scroll.  Valid values are `up`, `down`, `left` and `right`.  Default is ``up``.  `left` and `right` imply horizontal scrolling.
####  breakpoint
The minimum screenwidth below which the parallax effect is disabled. Default is `1025`.
####  container
The DOM element that is the scrolling container.  Defaults to `Window`.
## Authors
* [**Misha Chitharanjan**](https://www.mishac.com)
## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
