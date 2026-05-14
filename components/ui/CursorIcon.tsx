'use client';

import React from 'react';
import { Cursor } from '@lobehub/icons';

export const CursorIcon = (props: any) => {
  const { className = "", ...restProps } = props;
  return (
    <div className={`${className} opacity-80 hover:opacity-100 transition-opacity`} style={{ color: '#424242' }}>
      <Cursor.Avatar size={32} {...restProps} />
    </div>
  );
};

