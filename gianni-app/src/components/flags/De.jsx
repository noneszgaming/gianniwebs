/* eslint-disable no-unused-vars */
import React from 'react';

const De = (props) => (
  <svg width={24} height={24} viewBox="0 0 512 512" {...props}>
    <mask id="de_svg__a">
      <circle cx={256} cy={256} r={256} fill="#fff" />
    </mask>
    <g mask="url(#de_svg__a)">
      <path fill="#ffda44" d="m0 345 256.7-25.5L512 345v167H0z" />
      <path fill="#d80027" d="m0 167 255-23 257 23v178H0z" />
      <path fill="#333" d="M0 0h512v167H0z" />
    </g>
  </svg>
);

export default De;
