/**
 * Thin mutable wrapper around the shared pure demo reducer (@tab/shared),
 * exposed over REST for local multi-process demos (e.g. the demo-agent CLI
 * hitting a real server). The publicly deployed dashboard does NOT depend
 * on this — it runs the same reducer client-side. See @tab/shared/demoEngine.
 */
import { applyDemoAction, initialDemoState, type DemoAction, type DemoState } from "@tab/shared";

export type { DemoAction, DemoState };

let state: DemoState = initialDemoState();

export function getState(): DemoState {
  return state;
}

export function applyAction(action: DemoAction): DemoState {
  state = applyDemoAction(state, action);
  return state;
}
