import React, { useEffect, useState } from 'react';

interface Props {
  interval?: number;
  dots?: number;
}

export const LoadingDots = ({ interval = 100, dots = 20 }: Props) => {
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFrame(frame + 1);
    }, interval);
    return () => {
      clearInterval(intervalId);
    };
  });

  const dotCount = frame % (dots + 1);
  const text = '.'.repeat(dotCount);
  return <span>&nbsp;{text}&nbsp;</span>;
};
