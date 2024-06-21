import {Image, StyleSheet} from 'react-native';
import React from 'react';
import utils from '../core/utils';

interface IThumbnailProps {
  url: string | null;
  size: number;
}

const Thumbnail: React.FC<IThumbnailProps> = ({url, size}) => {
  return (
    <Image
      source={utils.thumbnail(url)}
      style={{
        width: size,
        height: size,
        backgroundColor: '#e0e0e0',
        borderRadius: size / 2,
      }}
    />
  );
};

export default Thumbnail;
