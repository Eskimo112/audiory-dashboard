/* eslint-disable n/no-callback-literal */
/* eslint-disable no-throw-literal */
import { useCallback, useEffect, useRef } from 'react';

import { useRouter } from 'next/router';

/**
 * Throwing an actual error class trips the Next.JS 500 Page, this string literal does not.
 */
const throwFakeErrorToFoolNextRouter = () => {
  throw 'Intentionally abort route change. Please ignore this error.';
};

const waitor = (cb) =>
  new Promise((res, rej) => {
    cb().then(() => {
      res(null);
    });
  });

const message = 'Are you sure that you want to leave?';

export default function useNextNavigateAway(shouldWarn, cb) {
  const router = useRouter();

  const lastHistoryState = useRef(global.history?.state);

  useEffect(() => {
    const storeLastHistoryState = () => {
      lastHistoryState.current = history.state;
    };
    router.events.on('routeChangeComplete', storeLastHistoryState);

    return () => {
      router.events.off('routeChangeComplete', storeLastHistoryState);
    };
  }, [router]);

  /**
   * @experimental HACK - idx is not documented
   * Determines which direction to travel in history.
   */
  const revertTheChangeRouterJustMade = useCallback(() => {
    const state = lastHistoryState.current;
    if (
      state !== null &&
      history.state !== null &&
      state.idx !== history.state.idx
    ) {
      history.go(lastHistoryState.current.idx < history.state.idx ? -1 : 1);
    }
  }, []);

  const killRouterEvent = useCallback(() => {
    router.events.emit('routeChangeError');
    revertTheChangeRouterJustMade();
    throwFakeErrorToFoolNextRouter();
  }, [revertTheChangeRouterJustMade, router]);

  useEffect(() => {
    let isWarned = false;
    const routeChangeStart = (url) => {
      if (router.asPath !== url && shouldWarn && !isWarned) {
        isWarned = true;

        if (cb(() => router.push(url))) {
          // router.push(url);
          return;
        }
        isWarned = false;
        killRouterEvent();
      }
    };

    const beforeUnload = (e) => {
      if (shouldWarn && !isWarned) {
        const event = e ?? window.event;
        event.returnValue = message;
        return message;
      }
      return null;
    };

    router.events.on('routeChangeStart', routeChangeStart);
    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [shouldWarn, killRouterEvent, router, cb]);
}
