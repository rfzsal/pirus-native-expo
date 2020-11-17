import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';

const Skeleton = (props) => {
  let height = props.height || 100;
  let width = props.width || 100;

  if (props.width === 'full') {
    width = '100%';
  }

  return (
    <ContentLoader
      backgroundColor="#f7fafc"
      foregroundColor="#f2f5f7"
      height={height}
      width={width}>
      <Rect x="0" y="0" rx="0" ry="0" height={height} width={width} />
    </ContentLoader>
  );
};

export default Skeleton;
