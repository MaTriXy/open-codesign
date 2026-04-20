/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function () {
  ((c, x) => {
    'object' === typeof exports && 'undefined' !== typeof module
      ? x(exports)
      : 'function' === typeof define && define.amd
        ? define(['exports'], x)
        : ((c = c || self), x((c.React = {})));
  })(this, (c) => {
    function x(a) {
      if (null === a || 'object' !== typeof a) return null;
      a = (V && a[V]) || a['@@iterator'];
      return 'function' === typeof a ? a : null;
    }
    function w(a, b, e) {
      this.props = a;
      this.context = b;
      this.refs = W;
      this.updater = e || X;
    }
    function Y() {}
    function K(a, b, e) {
      this.props = a;
      this.context = b;
      this.refs = W;
      this.updater = e || X;
    }
    function Z(a, b, e) {
      let m;
      const d = {};
      let c = null;
      let h = null;
      if (null != b)
        for (m in (void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (c = `${b.key}`), b))
          aa.call(b, m) && !ba.hasOwnProperty(m) && (d[m] = b[m]);
      let l = arguments.length - 2;
      if (1 === l) d.children = e;
      else if (1 < l) {
        for (let f = Array(l), k = 0; k < l; k++) f[k] = arguments[k + 2];
        d.children = f;
      }
      if (a?.defaultProps)
        for (m in ((l = a.defaultProps), l)) void 0 === d[m] && (d[m] = l[m]);
      return { $$typeof: y, type: a, key: c, ref: h, props: d, _owner: L.current };
    }
    function oa(a, b) {
      return { $$typeof: y, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
    }
    function M(a) {
      return 'object' === typeof a && null !== a && a.$$typeof === y;
    }
    function pa(a) {
      const b = { '=': '=0', ':': '=2' };
      return `$${a.replace(/[=:]/g, (a) => b[a])}`;
    }
    function N(a, b) {
      return 'object' === typeof a && null !== a && null != a.key ? pa(`${a.key}`) : b.toString(36);
    }
    function B(a, b, e, m, d) {
      let c = typeof a;
      if ('undefined' === c || 'boolean' === c) a = null;
      let h = !1;
      if (null === a) h = !0;
      else
        switch (c) {
          case 'string':
          case 'number':
            h = !0;
            break;
          case 'object':
            switch (a.$$typeof) {
              case y:
              case qa:
                h = !0;
            }
        }
      if (h)
        return (
          (h = a),
          (d = d(h)),
          (a = '' === m ? `.${N(h, 0)}` : m),
          ca(d)
            ? ((e = ''), null != a && (e = `${a.replace(da, '$&/')}/`), B(d, b, e, '', (a) => a))
            : null != d &&
              (M(d) &&
                (d = oa(
                  d,
                  e +
                    (!d.key || (h && h.key === d.key)
                      ? ''
                      : `${(`${d.key}`).replace(da, '$&/')}/`) +
                    a,
                )),
              b.push(d)),
          1
        );
      h = 0;
      m = '' === m ? '.' : `${m}:`;
      if (ca(a))
        for (let l = 0; l < a.length; l++) {
          c = a[l];
          const f = m + N(c, l);
          h += B(c, b, e, f, d);
        }
      else if (((f = x(a)), 'function' === typeof f))
        for (a = f.call(a), l = 0; !(c = a.next()).done; )
          (c = c.value), (f = m + N(c, l++)), (h += B(c, b, e, f, d));
      else if ('object' === c)
        throw (
          ((b = String(a)),
          Error(
            `Objects are not valid as a React child (found: ${'[object Object]' === b
                ? `object with keys {${Object.keys(a).join(', ')}}`
                : b}). If you meant to render a collection of children, use an array instead.`,
          ))
        );
      return h;
    }
    function C(a, b, e) {
      if (null == a) return a;
      const c = [];
      let d = 0;
      B(a, c, '', '', (a) => b.call(e, a, d++));
      return c;
    }
    function ra(a) {
      if (-1 === a._status) {
        let b = a._result;
        b = b();
        b.then(
          (b) => {
            if (0 === a._status || -1 === a._status) (a._status = 1), (a._result = b);
          },
          (b) => {
            if (0 === a._status || -1 === a._status) (a._status = 2), (a._result = b);
          },
        );
        -1 === a._status && ((a._status = 0), (a._result = b));
      }
      if (1 === a._status) return a._result.default;
      throw a._result;
    }
    function O(a, b) {
      let e = a.length;
      a.push(b);
      while (0 < e) {
        const c = (e - 1) >>> 1;
        const d = a[c];
        if (0 < D(d, b)) (a[c] = b), (a[e] = d), (e = c);
        else break;
      }
    }
    function p(a) {
      return 0 === a.length ? null : a[0];
    }
    function E(a) {
      if (0 === a.length) return null;
      const b = a[0];
      const e = a.pop();
      if (e !== b) {
        a[0] = e;
        for (let c = 0, d = a.length, k = d >>> 1; c < k; ) {
          const h = 2 * (c + 1) - 1;
          const l = a[h];
          const f = h + 1;
          const g = a[f];
          if (0 > D(l, e))
            f < d && 0 > D(g, l)
              ? ((a[c] = g), (a[f] = e), (c = f))
              : ((a[c] = l), (a[h] = e), (c = h));
          else if (f < d && 0 > D(g, e)) (a[c] = g), (a[f] = e), (c = f);
          else break;
        }
      }
      return b;
    }
    function D(a, b) {
      const c = a.sortIndex - b.sortIndex;
      return 0 !== c ? c : a.id - b.id;
    }
    function P(a) {
      for (let b = p(r); null !== b; ) {
        if (null === b.callback) E(r);
        else if (b.startTime <= a) E(r), (b.sortIndex = b.expirationTime), O(q, b);
        else break;
        b = p(r);
      }
    }
    function Q(a) {
      z = !1;
      P(a);
      if (!u)
        if (null !== p(q)) (u = !0), R(S);
        else {
          const b = p(r);
          null !== b && T(Q, b.startTime - a);
        }
    }
    function S(a, b) {
      u = !1;
      z && ((z = !1), ea(A), (A = -1));
      F = !0;
      const c = k;
      try {
        P(b);
        for (n = p(q); null !== n && (!(n.expirationTime > b) || (a && !fa())); ) {
          const m = n.callback;
          if ('function' === typeof m) {
            n.callback = null;
            k = n.priorityLevel;
            const d = m(n.expirationTime <= b);
            b = v();
            'function' === typeof d ? (n.callback = d) : n === p(q) && E(q);
            P(b);
          } else E(q);
          n = p(q);
        }
        if (null !== n) let g = !0;
        else {
          const h = p(r);
          null !== h && T(Q, h.startTime - b);
          g = !1;
        }
        return g;
      } finally {
        (n = null), (k = c), (F = !1);
      }
    }
    function fa() {
      return v() - ha < ia ? !1 : !0;
    }
    function R(a) {
      G = a;
      H || ((H = !0), I());
    }
    function T(a, b) {
      A = ja(() => {
        a(v());
      }, b);
    }
    function ka(a) {
      throw Error('act(...) is not supported in production builds of React.');
    }
    const y = Symbol.for('react.element');
    const qa = Symbol.for('react.portal');
    const sa = Symbol.for('react.fragment');
    const ta = Symbol.for('react.strict_mode');
    const ua = Symbol.for('react.profiler');
    const va = Symbol.for('react.provider');
    const wa = Symbol.for('react.context');
    const xa = Symbol.for('react.forward_ref');
    const ya = Symbol.for('react.suspense');
    const za = Symbol.for('react.memo');
    const Aa = Symbol.for('react.lazy');
    const V = Symbol.iterator;
    const X = {
        isMounted: (a) => !1,
        enqueueForceUpdate: (a, b, c) => {},
        enqueueReplaceState: (a, b, c, m) => {},
        enqueueSetState: (a, b, c, m) => {},
      };
    const la = Object.assign;
    const W = {};
    w.prototype.isReactComponent = {};
    w.prototype.setState = function (a, b) {
      if ('object' !== typeof a && 'function' !== typeof a && null != a)
        throw Error(
          'setState(...): takes an object of state variables to update or a function which returns an object of state variables.',
        );
      this.updater.enqueueSetState(this, a, b, 'setState');
    };
    w.prototype.forceUpdate = function (a) {
      this.updater.enqueueForceUpdate(this, a, 'forceUpdate');
    };
    Y.prototype = w.prototype;
    let t = (K.prototype = new Y());
    t.constructor = K;
    la(t, w.prototype);
    t.isPureReactComponent = !0;
    const ca = Array.isArray;
    const aa = Object.prototype.hasOwnProperty;
    const L = { current: null };
    const ba = { key: !0, ref: !0, __self: !0, __source: !0 };
    const da = /\/+/g;
    const g = { current: null };
    const J = { transition: null };
    if ('object' === typeof performance && 'function' === typeof performance.now) {
      const Ba = performance;
      const v = () => Ba.now();
    } else {
      const ma = Date;
      const Ca = ma.now();
      v = () => ma.now() - Ca;
    }
    const q = [];
    const r = [];
    let Da = 1;
    let n = null;
    let k = 3;
    let F = !1;
    let u = !1;
    let z = !1;
    const ja = 'function' === typeof setTimeout ? setTimeout : null;
    const ea = 'function' === typeof clearTimeout ? clearTimeout : null;
    const na = 'undefined' !== typeof setImmediate ? setImmediate : null;
    'undefined' !== typeof navigator &&
      void 0 !== navigator.scheduling &&
      void 0 !== navigator.scheduling.isInputPending &&
      navigator.scheduling.isInputPending.bind(navigator.scheduling);
    let H = !1;
    let G = null;
    let A = -1;
    let ia = 5;
    let ha = -1;
    const U = () => {
        if (null !== G) {
          const a = v();
          ha = a;
          let b = !0;
          try {
            b = G(!0, a);
          } finally {
            b ? I() : ((H = !1), (G = null));
          }
        } else H = !1;
      };
    if ('function' === typeof na)
      let I = () => {
        na(U);
      };
    else if ('undefined' !== typeof MessageChannel) {
      t = new MessageChannel();
      const Ea = t.port2;
      t.port1.onmessage = U;
      I = () => {
        Ea.postMessage(null);
      };
    } else
      I = () => {
        ja(U, 0);
      };
    t = {
      ReactCurrentDispatcher: g,
      ReactCurrentOwner: L,
      ReactCurrentBatchConfig: J,
      Scheduler: {
        __proto__: null,
        unstable_ImmediatePriority: 1,
        unstable_UserBlockingPriority: 2,
        unstable_NormalPriority: 3,
        unstable_IdlePriority: 5,
        unstable_LowPriority: 4,
        unstable_runWithPriority: (a, b) => {
          switch (a) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
              break;
            default:
              a = 3;
          }
          const c = k;
          k = a;
          try {
            return b();
          } finally {
            k = c;
          }
        },
        unstable_next: (a) => {
          switch (k) {
            case 1:
            case 2:
            case 3: {
              const b = 3;
              break;
            }
            default:
              b = k;
          }
          const c = k;
          k = b;
          try {
            return a();
          } finally {
            k = c;
          }
        },
        unstable_scheduleCallback: (a, b, c) => {
          const e = v();
          'object' === typeof c && null !== c
            ? ((c = c.delay), (c = 'number' === typeof c && 0 < c ? e + c : e))
            : (c = e);
          switch (a) {
            case 1: {
              const d = -1;
              break;
            }
            case 2:
              d = 250;
              break;
            case 5:
              d = 1073741823;
              break;
            case 4:
              d = 1e4;
              break;
            default:
              d = 5e3;
          }
          d = c + d;
          a = {
            id: Da++,
            callback: b,
            priorityLevel: a,
            startTime: c,
            expirationTime: d,
            sortIndex: -1,
          };
          c > e
            ? ((a.sortIndex = c),
              O(r, a),
              null === p(q) && a === p(r) && (z ? (ea(A), (A = -1)) : (z = !0), T(Q, c - e)))
            : ((a.sortIndex = d), O(q, a), u || F || ((u = !0), R(S)));
          return a;
        },
        unstable_cancelCallback: (a) => {
          a.callback = null;
        },
        unstable_wrapCallback: (a) => {
          const b = k;
          return function () {
            const c = k;
            k = b;
            try {
              return a.apply(this, arguments);
            } finally {
              k = c;
            }
          };
        },
        unstable_getCurrentPriorityLevel: () => k,
        unstable_shouldYield: fa,
        unstable_requestPaint: () => {},
        unstable_continueExecution: () => {
          u || F || ((u = !0), R(S));
        },
        unstable_pauseExecution: () => {},
        unstable_getFirstCallbackNode: () => p(q),
        get unstable_now() {
          return v;
        },
        unstable_forceFrameRate: (a) => {
          0 > a || 125 < a
            ? console.error(
                'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
              )
            : (ia = 0 < a ? Math.floor(1e3 / a) : 5);
        },
        unstable_Profiling: null,
      },
    };
    c.Children = {
      map: C,
      forEach: (a, b, c) => {
        C(
          a,
          function () {
            b.apply(this, arguments);
          },
          c,
        );
      },
      count: (a) => {
        let b = 0;
        C(a, () => {
          b++;
        });
        return b;
      },
      toArray: (a) => C(a, (a) => a) || [],
      only: (a) => {
        if (!M(a))
          throw Error('React.Children.only expected to receive a single React element child.');
        return a;
      },
    };
    c.Component = w;
    c.Fragment = sa;
    c.Profiler = ua;
    c.PureComponent = K;
    c.StrictMode = ta;
    c.Suspense = ya;
    c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = t;
    c.act = ka;
    c.cloneElement = (a, b, c) => {
      if (null === a || void 0 === a)
        throw Error(
          `React.cloneElement(...): The argument must be a React element, but you passed ${a}.`,
        );
      const e = la({}, a.props);
      let d = a.key;
      let k = a.ref;
      let h = a._owner;
      if (null != b) {
        void 0 !== b.ref && ((k = b.ref), (h = L.current));
        void 0 !== b.key && (d = `${b.key}`);
        if (a.type?.defaultProps) const l = a.type.defaultProps;
        for (f in b)
          aa.call(b, f) &&
            !ba.hasOwnProperty(f) &&
            (e[f] = void 0 === b[f] && void 0 !== l ? l[f] : b[f]);
      }
      let f = arguments.length - 2;
      if (1 === f) e.children = c;
      else if (1 < f) {
        l = Array(f);
        for (let g = 0; g < f; g++) l[g] = arguments[g + 2];
        e.children = l;
      }
      return { $$typeof: y, type: a.type, key: d, ref: k, props: e, _owner: h };
    };
    c.createContext = (a) => {
      a = {
        $$typeof: wa,
        _currentValue: a,
        _currentValue2: a,
        _threadCount: 0,
        Provider: null,
        Consumer: null,
        _defaultValue: null,
        _globalName: null,
      };
      a.Provider = { $$typeof: va, _context: a };
      return (a.Consumer = a);
    };
    c.createElement = Z;
    c.createFactory = (a) => {
      const b = Z.bind(null, a);
      b.type = a;
      return b;
    };
    c.createRef = () => ({ current: null });
    c.forwardRef = (a) => ({ $$typeof: xa, render: a });
    c.isValidElement = M;
    c.lazy = (a) => ({ $$typeof: Aa, _payload: { _status: -1, _result: a }, _init: ra });
    c.memo = (a, b) => ({ $$typeof: za, type: a, compare: void 0 === b ? null : b });
    c.startTransition = (a, b) => {
      b = J.transition;
      J.transition = {};
      try {
        a();
      } finally {
        J.transition = b;
      }
    };
    c.unstable_act = ka;
    c.useCallback = (a, b) => g.current.useCallback(a, b);
    c.useContext = (a) => g.current.useContext(a);
    c.useDebugValue = (a, b) => {};
    c.useDeferredValue = (a) => g.current.useDeferredValue(a);
    c.useEffect = (a, b) => g.current.useEffect(a, b);
    c.useId = () => g.current.useId();
    c.useImperativeHandle = (a, b, c) => g.current.useImperativeHandle(a, b, c);
    c.useInsertionEffect = (a, b) => g.current.useInsertionEffect(a, b);
    c.useLayoutEffect = (a, b) => g.current.useLayoutEffect(a, b);
    c.useMemo = (a, b) => g.current.useMemo(a, b);
    c.useReducer = (a, b, c) => g.current.useReducer(a, b, c);
    c.useRef = (a) => g.current.useRef(a);
    c.useState = (a) => g.current.useState(a);
    c.useSyncExternalStore = (a, b, c) => g.current.useSyncExternalStore(a, b, c);
    c.useTransition = () => g.current.useTransition();
    c.version = '18.3.1';
  });
})();
