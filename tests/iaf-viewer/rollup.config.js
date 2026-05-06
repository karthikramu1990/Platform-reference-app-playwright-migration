/**
 * ****************************************************************************
 *
 * INVICARA INC CONFIDENTIAL __________________
 *
 * Copyright (C) [2012] - [2021] INVICARA INC, INVICARA Pte Ltd, INVICARA INDIA
 * PVT LTD All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains the property of
 * Invicara Inc and its suppliers, if any. The intellectual and technical
 * concepts contained herein are proprietary to Invicara Inc and its suppliers
 * and may be covered by U.S. and Foreign Patents, patents in process, and are
 * protected by trade secret or copyright law. Dissemination of this information
 * or reproduction of this material is strictly forbidden unless prior written
 * permission is obtained from Invicara Inc.
 */

import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
// Convert CJS modules to ES6 so they can be included in bundle
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import copy from "rollup-plugin-copy";
import image from '@rollup/plugin-image'
import path from 'path'

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/components.js',
    format: 'esm',
    name: 'components',
    sourcemap: true
  },

  plugins: [
    json(),
    resolve(),
    postcss({
      extract: path.resolve('dist/iaf-viewer.css')
    }),
    image(),
    babel({
      babelHelpers: 'bundled',
      exclude: ['node_modules/**', 'examples/**'],
      presets: [
        "@babel/preset-react"
      ],
      plugins: [
        "@babel/plugin-proposal-class-properties"
      ]
    }),
    commonjs(),
    copy({
      targets: [
        {src: 'src/img/invicara-logo_white.svg', dest: 'dist/img/'},
        {src: 'src/styles/**/*', dest: 'dist/styles'},
        {src: 'src/lib/**/*', dest: 'dist/lib'}
      ]
    })
  ],
  external: [
    'react',
    'react-dom',
    'prop-types',
    'lodash-es',
    'bootstrap',
    '@dtplatform/platform-api',
    '@mui/material',
    "@dtplatform/react-ifef"
  ],
  // Customize the onwarn function to handle specific warnings
  onwarn(warning, warn) {
   if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
     // Ignore warnings with code 'MODULE_LEVEL_DIRECTIVE'
     return;
   }

   // For other warnings, pass them through to default warning handler
   warn(warning);
 }
};
