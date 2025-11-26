// lib/realtime.ts
// Système d’événements interne Hemut-link (serveur → client)

class HemutRealtime {
  emitter = new EventTarget();

  send(eventName: string, data?: any) {
    const event = new CustomEvent(eventName, { detail: data });
    this.emitter.dispatchEvent(event);

    // Envoyer au navigateur via BroadcastChannel
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel("hemut-realtime");
      bc.postMessage({ eventName, data });
    }
  }

  on(eventName: string, callback: (d: any) => void) {
    this.emitter.addEventListener(eventName, (e: any) =>
      callback(e.detail)
    );
  }
}

export const hemutRealtime = new HemutRealtime();
