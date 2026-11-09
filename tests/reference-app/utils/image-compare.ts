import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

// True if `expected` appears somewhere inside `actual`: slides an expected-sized window over the
// screenshot in 10px steps and accepts a window where under 40% of pixels differ.
export function isImageFound(actual: PNG, expected: PNG): boolean {
  const stride = 10;
  const maxDiff = Math.floor(expected.width * expected.height * 0.4);
  for (let y = 0; y <= actual.height - expected.height; y += stride) {
    for (let x = 0; x <= actual.width - expected.width; x += stride) {
      const crop = new PNG({ width: expected.width, height: expected.height });
      PNG.bitblt(actual, crop, x, y, expected.width, expected.height, 0, 0);
      const diff = pixelmatch(crop.data, expected.data, null, expected.width, expected.height, { threshold: 0.1 });
      if (diff < maxDiff) return true;
    }
  }
  return false;
}
