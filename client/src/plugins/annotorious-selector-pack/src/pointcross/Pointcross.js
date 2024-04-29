import { toRectFragment } from '@recogito/annotorious/src/selectors/RectFragment';

export const isPointcross = annotation =>
  annotation.target.renderedVia?.name === 'pointcross';

export const toFragment = (x, y, image, fragmentUnit) => ({
  ...toRectFragment(x, y, 0, 0, image, fragmentUnit),
  renderedVia: {
    name: 'pointcross'
  }
});