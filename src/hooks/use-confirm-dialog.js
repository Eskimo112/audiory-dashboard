import { useRef, useState } from 'react';

export function useConfirmDialog() {
  const [show, setShow] = useState(false);
  const confirmCbRef = useRef(async () => {});

  return { confirmCbRef, show, setShow };
}
