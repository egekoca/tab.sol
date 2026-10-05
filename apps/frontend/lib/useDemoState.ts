"use client";

import { useCallback, useReducer } from "react";
import { applyDemoAction, initialDemoState, type DemoAction, type DemoState } from "@tab/shared";

export type { DemoState, DemoEvent } from "@tab/shared";

/**
 * Runs the shared demo reducer entirely client-side. No backend required —
 * this is what makes the publicly deployed dashboard work standalone for
 * anyone who opens the live link, with no server/state-persistence concerns.
 * apps/mock-merchant runs the exact same reducer behind a REST API for
 * local multi-process demos (e.g. driving it from the demo-agent CLI).
 */
export function useDemoState() {
  const [state, dispatchAction] = useReducer(
    (s: DemoState, action: DemoAction) => applyDemoAction(s, action),
    undefined,
    initialDemoState
  );

  const dispatch = useCallback((action: string) => {
    dispatchAction(action as DemoAction);
  }, []);

  return { state, connected: true, dispatch };
}
