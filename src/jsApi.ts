// @ts-nocheck
import * as ws from "ws";

// HACK: Prevent typescript compiler from converting dynamic `import` to `require`
const dynamicImport = new Function("specifier", "return import(specifier)");

export async function initJsApi() {
  class Event {
    constructor(type, dict) {
      this.type = type;
      if (dict) {
        this.detail = dict.detail;
      }
    }
  }

  class CustomEvent extends Event {
    constructor(...args) {
      super(...args);
    }
  }

  // Copied from https://github.com/deephaven/deephaven.io/blob/main/tools/run-examples/includeAPI.mjs
  /* @ts-ignore */
  global.self = global;
  global.window = global;
  global.this = global;
  global.Event = Event;
  global.CustomEvent = CustomEvent;
  global.WebSocket = ws;
  global.window.location = new URL("http://localhost:10000");

  const dh = (await dynamicImport("../lib/dh-core.mjs")).default;

  return dh;
}
