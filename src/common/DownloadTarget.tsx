import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from '@mui/material';

export interface DownloadTargetProps<Store, State> {
  target: (store: Store) => State;
  filename?: string;
}

export function DownloadTarget<Store, State>({ target, filename = 'download.json' }: DownloadTargetProps<Store, State>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [link, setLink] = useState<string>();
  const json = useSelector(target);

  useEffect(() => {
    if (json) {
      const blob = new Blob([JSON.stringify(json)]);
      const blobLink = URL.createObjectURL(blob);
      setLink(blobLink);
    }
  }, [json]);

  useEffect(() => {
    if (ref.current && link) {
      ref.current.click();
      URL.revokeObjectURL(link);
      setLink(undefined);
    }
  }, [link]);

  return <Link component="a" sx={{ display: 'none' }} download={filename} ref={ref} href={link} />;
}
