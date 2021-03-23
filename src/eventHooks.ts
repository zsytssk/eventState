import { useEffect, useRef, useState } from 'react';

import { EventState } from './eventState';

export function genUseEventState<T extends EventState>(state: T, oriEventList: string[]) {
  return (eventList?: string[]) => {
    const localEventList = eventList || oriEventList;
    const ref = useRef<() => void>();
    const [changeIndex, setChangeIndex] = useState(0);

    useEffect(() => {
      ref.current = () => {
        setChangeIndex(changeIndex + 1);
      };
      return () => {
        ref.current = undefined;
      };
    }, [changeIndex]);

    useEffect(() => {
      const fn = () => {
        ref.current?.();
      };
      for (const event of localEventList) {
        state.on(event, fn);
      }
      return () => {
        for (const event of localEventList) {
          state.off(event, fn);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, localEventList]);

    return [state, changeIndex] as [T, number];
  };
}

export function genUseEventSelector<T extends EventState>(state: T, oriEventList: string[]) {
  return <U extends (state: T) => any>(fn: U, eventList?: string[]) => {
    const ref = useRef<(state: T) => void>();
    const [localState, setLocalState] = useState<ReturnType<U>>(fn(state));
    const localEventList = eventList || oriEventList;

    useEffect(() => {
      ref.current = (state: T) => {
        setLocalState(fn(state));
      };
      return () => {
        ref.current = undefined;
      };
    }, [fn]);

    useEffect(() => {
      const fn = () => {
        ref.current?.(state);
      };
      for (const event of localEventList) {
        state.on(event, fn);
      }
      return () => {
        for (const event of localEventList) {
          state.off(event, fn);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, localEventList]);

    return localState;
  };
}
