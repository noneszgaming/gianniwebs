/* eslint-disable no-unused-vars */
import React from 'react';

const Hu = (props) => (
  <svg width={24} height={24} viewBox="0 0 512 512" {...props}>
    <mask id="hu_svg__a">
      <circle cx={256} cy={256} r={256} fill="#fff" />
    </mask>
    <g mask="url(#hu_svg__a)">
      <path fill="#eee" d="m0 167 253.8-19.3L512 167v178l-254.9 32.3L0 345z" />
      <path fill="#d80027" d="M0 0h512v167H0z" />
      <path fill="#6da544" d="M0 345h512v167H0z" />
    </g>
  </svg>
);

export default Hu;
