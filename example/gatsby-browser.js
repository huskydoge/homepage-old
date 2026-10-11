/** Site-level browser hooks: first-party visit log beacon (see workers/visit-log). */

// Set to the deployed worker URL, e.g. 'https://visit-log.<account>.workers.dev'. Empty disables logging.
const VISIT_LOG_ENDPOINT = '';

const VISITOR_ID_KEY = 'vl-id';
const OPT_OUT_KEY = 'vl-optout';

/** Read localStorage without throwing in private modes. */
const readStore = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
};

const writeStore = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    // Storage blocked; logging still works without a stable visitor id.
  }
};

/** Return a random id that stays stable for this browser. */
const getVisitorId = () => {
  let id = readStore(VISITOR_ID_KEY);
  if (!id) {
    id = Array.from(window.crypto.getRandomValues(new Uint8Array(12)), (byte) => byte.toString(16).padStart(2, '0')).join('');
    writeStore(VISITOR_ID_KEY, id);
  }
  return id;
};

/** Pull ?r=<token> (and the owner's ?notrack switch) out of the address bar. */
const takeUrlParams = () => {
  const url = new URL(window.location.href);
  const ref = url.searchParams.get('r');
  const notrack = url.searchParams.get('notrack');
  if (ref === null && notrack === null) {
    return ref;
  }
  if (notrack !== null) {
    writeStore(OPT_OUT_KEY, notrack === '0' ? '' : '1');
  }
  url.searchParams.delete('r');
  url.searchParams.delete('notrack');
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  return ref;
};

/** Send one page view to the visit log worker. */
export const onRouteUpdate = ({ location, prevLocation }) => {
  if (!VISIT_LOG_ENDPOINT || ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return;
  }
  const ref = takeUrlParams();
  if (readStore(OPT_OUT_KEY) === '1') {
    return;
  }

  const payload = JSON.stringify({
    vid: getVisitorId(),
    ref,
    path: location.pathname,
    referrer: prevLocation ? null : document.referrer || null,
  });
  const endpoint = `${VISIT_LOG_ENDPOINT.replace(/\/$/, '')}/v`;
  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([payload], { type: 'text/plain' }));
  } else {
    window.fetch(endpoint, {
      method: 'POST', body: payload, keepalive: true, headers: { 'Content-Type': 'text/plain' },
    }).catch(() => {});
  }
};
