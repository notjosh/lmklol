#!/bin/ts-node

import lmklol from '../src';

(async () => {
  const out = await lmklol();

  console.log({ out });
})();
