import React from 'react';

import style from './Mask.module.css';

const Mask = () => {
  const handleClickMask = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={style.mask}>
      Locked
      <ul className={style.list} onClick={handleClickMask}>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
};

export default Mask;
