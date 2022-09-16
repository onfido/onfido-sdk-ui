var f, crypto
f || (f = 'undefined' != typeof Module ? Module : {}),
  f.nd || (f.nd = 0),
  f.nd++,
  (function (e) {
    function n() {
      function n(e, n, t) {
        ;(this.start = e), (this.end = n), (this.audio = t)
      }
      function t(t) {
        if (!t) throw 'Loading data file failed.' + Error().stack
        if (!(t instanceof ArrayBuffer))
          throw 'bad input to processPackageData' + Error().stack
        ;(t = new Uint8Array(t)), (n.prototype.$d = t), (t = e.files)
        for (var r = 0; r < t.length; ++r)
          n.prototype.wd[t[r].filename].onload()
        f.removeRunDependency(
          'datafile_011c90516755d702cfb4205ca9d93e21fe6683b8.data'
        )
      }
      f.FS_createPath('/', 'models', !0, !0),
        (n.prototype = {
          wd: {},
          open: function (e, n) {
            ;(this.name = n),
              (this.wd[n] = this),
              f.addRunDependency('fp ' + this.name)
          },
          send: function () {},
          onload: function () {
            this.finish(this.$d.subarray(this.start, this.end))
          },
          finish: function (e) {
            f.FS_createDataFile(this.name, null, e, !0, !0, !0),
              f.removeRunDependency('fp ' + this.name),
              (this.wd[this.name] = null)
          },
        })
      for (var r = e.files, i = 0; i < r.length; ++i)
        new n(r[i].start, r[i].end, r[i].audio).open('GET', r[i].filename)
      f.addRunDependency(
        'datafile_011c90516755d702cfb4205ca9d93e21fe6683b8.data'
      ),
        f.Jd || (f.Jd = {}),
        (f.Jd['011c90516755d702cfb4205ca9d93e21fe6683b8.data'] = { Te: !1 }),
        d ? (t(d), (d = null)) : (l = t)
    }
    if ('object' == typeof window)
      window.encodeURIComponent(
        window.location.pathname
          .toString()
          .substring(0, window.location.pathname.toString().lastIndexOf('/')) +
          '/'
      )
    else {
      if ('undefined' == typeof location)
        throw 'using preloaded data can only be done on a web page or in a web worker'
      encodeURIComponent(
        location.pathname
          .toString()
          .substring(0, location.pathname.toString().lastIndexOf('/')) + '/'
      )
    }
    'function' != typeof f.locateFilePackage ||
      f.locateFile ||
      ((f.locateFile = f.locateFilePackage),
      t(
        'warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)'
      ))
    var r,
      i,
      a,
      c,
      o = f.locateFile
        ? f.locateFile('011c90516755d702cfb4205ca9d93e21fe6683b8.data', '')
        : '011c90516755d702cfb4205ca9d93e21fe6683b8.data',
      u = e.remote_package_size,
      l = null,
      d = f.getPreloadedPackage ? f.getPreloadedPackage(o, u) : null
    d ||
      ((r = o),
      (i = u),
      (a = function (e) {
        l ? (l(e), (l = null)) : (d = e)
      }),
      (c = new XMLHttpRequest()).open('GET', r, !0),
      (c.responseType = 'arraybuffer'),
      (c.onprogress = function (e) {
        var n = i
        if ((e.total && (n = e.total), e.loaded)) {
          c.Xd
            ? (f.Jc[r].loaded = e.loaded)
            : ((c.Xd = !0),
              f.Jc || (f.Jc = {}),
              (f.Jc[r] = { loaded: e.loaded, total: n }))
          var t,
            a = (n = e = 0)
          for (t in f.Jc) {
            var o = f.Jc[t]
            ;(e += o.total), (n += o.loaded), a++
          }
          ;(e = Math.ceil((e * f.nd) / a)),
            f.setStatus &&
              f.setStatus('Downloading data... (' + n + '/' + e + ')')
        } else !f.Jc && f.setStatus && f.setStatus('Downloading data...')
      }),
      (c.onerror = function () {
        throw Error('NetworkError for: ' + r)
      }),
      (c.onload = function () {
        if (
          !(
            200 == c.status ||
            304 == c.status ||
            206 == c.status ||
            (0 == c.status && c.response)
          )
        )
          throw Error(c.statusText + ' : ' + c.responseURL)
        a(c.response)
      }),
      c.send(null)),
      f.calledRun ? n() : (f.preRun || (f.preRun = []), f.preRun.push(n))
  })({
    files: [
      { filename: '/models/f2.xml', start: 0, end: 127521, audio: 0 },
      {
        filename:
          '/models/6b3133f0f39ff89a2a169d61176ee17cafacc5e288f334e2b64ee82892d11ccd',
        start: 127521,
        end: 1627953,
        audio: 0,
      },
      {
        filename: '/models/66388dc76dc16bc6b76b682edd218a575bf45b9b',
        start: 1627953,
        end: 1676550,
        audio: 0,
      },
      {
        filename:
          '/models/1f5b84f51ce0fcfbb76e904b7bcaa7560f601e1394a0b29367a09385312287eb',
        start: 1676550,
        end: 1688398,
        audio: 0,
      },
      {
        filename:
          '/models/a74f2afb9d20f2375ccbd14e67c094b85c89ceb608f7cf8ae04f3f646a6c5672',
        start: 1688398,
        end: 1743299,
        audio: 0,
      },
      {
        filename:
          '/models/dbd7a353f0130bb983d6ba05917e9be991d70e8f028df4b74e30bc6497ef7f71',
        start: 1743299,
        end: 1796182,
        audio: 0,
      },
      {
        filename:
          '/models/4c4774668f9b9333977fc891e7695420a0b4c27cc2c1cd3920ce9e0870e3c0e8',
        start: 1796182,
        end: 1849220,
        audio: 0,
      },
      {
        filename:
          '/models/b501893e75f62ee1707643e35b21109927b07ed5b202321c961b424cbc2e4695',
        start: 1849220,
        end: 1902154,
        audio: 0,
      },
      {
        filename:
          '/models/2b075ac1a6132b5b8a4c9ef0ba6b0cd84db7838aca9a000e50d907f40770a4ab',
        start: 1902154,
        end: 1914145,
        audio: 0,
      },
      {
        filename:
          '/models/9077d16225f9314163ef1e7db6fc7d4088bb903d134bd95f23d5591ca4dfbfca',
        start: 1914145,
        end: 1967219,
        audio: 0,
      },
      {
        filename:
          '/models/59cc2a9af81aaca2376702c2490650f4da2775fa673274db98aad41b7ef101c0',
        start: 1967219,
        end: 2019831,
        audio: 0,
      },
      {
        filename:
          '/models/b82962a4847bcf6d1bf89ea7543f83e184a1df7c4e7e3c343dd3e3e17cb9a645',
        start: 2019831,
        end: 2137885,
        audio: 0,
      },
    ],
    remote_package_size: 2137885,
    package_uuid: '5313e56a-0dd2-47a9-aa8a-14deb10749c6',
  }),
  crypto ||
    (crypto = {
      getRandomValues: function (e) {
        for (var n = 0; n < e.length; n++) e[n] = f.eJcfPvLCbm.apply(null)
      },
    }),
  (f.init = function (e, n, t) {
    e = JSON.stringify(e)
    var r = f.o1BHvPWDzd
    r || (r = f.o1BHvPWDzd = {}),
      (r.a = function (e) {
        n(e.target)
      }),
      (r.b = function (e) {
        n(e)
      }),
      f.i(e, t),
      f.p()
  }),
  (f.f = function () {
    return f._f.apply(null, arguments).slice(0)
  }),
  (f.g = function () {
    var e = (0, f._g)()
    return Uint8Array.from(e)
  }),
  (f.c = function () {
    var e = (0, f._c)()
    return Uint8Array.from(e)
  }),
  (f.tt = function () {
    var e = (0, f._tt)()
    return Uint8Array.from(e)
  }),
  (f.tl = function () {
    var e = (0, f._tl)()
    return Uint8Array.from(e)
  }),
  (f.hh = function () {
    var e = (0, f._hh)()
    return Uint8Array.from(e)
  }),
  (f.jj = function () {
    var e = (0, f._jj)()
    return Uint8Array.from(e)
  }),
  (f.sd = function () {
    f._sd()
  }),
  (f.ca = function (e) {
    var n = f.o1BHvPWDzd
    n || (n = f.o1BHvPWDzd = {}), (n.c = e), f._ca()
  })
var aa = {},
  ba
for (ba in f) f.hasOwnProperty(ba) && (aa[ba] = f[ba])
var ca = [],
  da = './this.program'
function ea(e, n) {
  throw n
}
var fa = !1,
  ha = !1
;(fa = 'object' == typeof window), (ha = 'function' == typeof importScripts)
var ia = '',
  ja,
  ka
;(fa || ha) &&
  (ha
    ? (ia = self.location.href)
    : document.currentScript && (ia = document.currentScript.src),
  (ia = 0 !== ia.indexOf('blob:') ? ia.substr(0, ia.lastIndexOf('/') + 1) : ''),
  (ja = function (e) {
    var n = new XMLHttpRequest()
    return n.open('GET', e, !1), n.send(null), n.responseText
  }),
  ha &&
    (ka = function (e) {
      var n = new XMLHttpRequest()
      return (
        n.open('GET', e, !1),
        (n.responseType = 'arraybuffer'),
        n.send(null),
        new Uint8Array(n.response)
      )
    }))
var la = f.print || console.log.bind(console),
  t = f.printErr || console.warn.bind(console)
for (ba in aa) aa.hasOwnProperty(ba) && (f[ba] = aa[ba])
;(aa = null),
  f.arguments && (ca = f.arguments),
  f.thisProgram && (da = f.thisProgram),
  f.quit && (ea = f.quit)
var u = 0,
  ma,
  noExitRuntime
f.wasmBinary && (ma = f.wasmBinary),
  f.noExitRuntime && (noExitRuntime = f.noExitRuntime),
  'object' != typeof WebAssembly && x('no native wasm support detected')
var na,
  oa = new WebAssembly.Table({
    initial: 4523,
    maximum: 4523,
    element: 'anyfunc',
  }),
  pa = !1
function qa(e) {
  e || x('Assertion failed: undefined')
}
var sa = 'undefined' != typeof TextDecoder ? new TextDecoder('utf8') : void 0
function ta(e, n, t) {
  var r = n + t
  for (t = n; e[t] && !(t >= r); ) ++t
  if (16 < t - n && e.subarray && sa) return sa.decode(e.subarray(n, t))
  for (r = ''; n < t; ) {
    var i = e[n++]
    if (128 & i) {
      var a = 63 & e[n++]
      if (192 == (224 & i)) r += String.fromCharCode(((31 & i) << 6) | a)
      else {
        var c = 63 & e[n++]
        65536 >
        (i =
          224 == (240 & i)
            ? ((15 & i) << 12) | (a << 6) | c
            : ((7 & i) << 18) | (a << 12) | (c << 6) | (63 & e[n++]))
          ? (r += String.fromCharCode(i))
          : ((i -= 65536),
            (r += String.fromCharCode(55296 | (i >> 10), 56320 | (1023 & i))))
      }
    } else r += String.fromCharCode(i)
  }
  return r
}
function y(e, n) {
  return e ? ta(A, e, n) : ''
}
function ua(e, n, t, r) {
  if (!(0 < r)) return 0
  var i = t
  r = t + r - 1
  for (var a = 0; a < e.length; ++a) {
    var c = e.charCodeAt(a)
    if (55296 <= c && 57343 >= c)
      c = (65536 + ((1023 & c) << 10)) | (1023 & e.charCodeAt(++a))
    if (127 >= c) {
      if (t >= r) break
      n[t++] = c
    } else {
      if (2047 >= c) {
        if (t + 1 >= r) break
        n[t++] = 192 | (c >> 6)
      } else {
        if (65535 >= c) {
          if (t + 2 >= r) break
          n[t++] = 224 | (c >> 12)
        } else {
          if (t + 3 >= r) break
          ;(n[t++] = 240 | (c >> 18)), (n[t++] = 128 | ((c >> 12) & 63))
        }
        n[t++] = 128 | ((c >> 6) & 63)
      }
      n[t++] = 128 | (63 & c)
    }
  }
  return (n[t] = 0), t - i
}
function va(e) {
  for (var n = 0, t = 0; t < e.length; ++t) {
    var r = e.charCodeAt(t)
    55296 <= r &&
      57343 >= r &&
      (r = (65536 + ((1023 & r) << 10)) | (1023 & e.charCodeAt(++t))),
      127 >= r ? ++n : (n = 2047 >= r ? n + 2 : 65535 >= r ? n + 3 : n + 4)
  }
  return n
}
var wa =
    'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
  Ja,
  C,
  A,
  za,
  ya,
  B,
  E,
  Ka,
  La
function xa(e, n) {
  for (var t = e >> 1, r = t + n / 2; !(t >= r) && ya[t]; ) ++t
  if (32 < (t <<= 1) - e && wa) return wa.decode(A.subarray(e, t))
  for (t = 0, r = ''; ; ) {
    var i = za[(e + 2 * t) >> 1]
    if (0 == i || t == n / 2) return r
    ++t, (r += String.fromCharCode(i))
  }
}
function Aa(e, n, t) {
  if ((void 0 === t && (t = 2147483647), 2 > t)) return 0
  var r = n
  t = (t -= 2) < 2 * e.length ? t / 2 : e.length
  for (var i = 0; i < t; ++i) (za[n >> 1] = e.charCodeAt(i)), (n += 2)
  return (za[n >> 1] = 0), n - r
}
function Ba(e) {
  return 2 * e.length
}
function Ca(e, n) {
  for (var t = 0, r = ''; !(t >= n / 4); ) {
    var i = B[(e + 4 * t) >> 2]
    if (0 == i) break
    ++t,
      65536 <= i
        ? ((i -= 65536),
          (r += String.fromCharCode(55296 | (i >> 10), 56320 | (1023 & i))))
        : (r += String.fromCharCode(i))
  }
  return r
}
function Da(e, n, t) {
  if ((void 0 === t && (t = 2147483647), 4 > t)) return 0
  var r = n
  t = r + t - 4
  for (var i = 0; i < e.length; ++i) {
    var a = e.charCodeAt(i)
    if (55296 <= a && 57343 >= a)
      a = (65536 + ((1023 & a) << 10)) | (1023 & e.charCodeAt(++i))
    if (((B[n >> 2] = a), (n += 4) + 4 > t)) break
  }
  return (B[n >> 2] = 0), n - r
}
function Ea(e) {
  for (var n = 0, t = 0; t < e.length; ++t) {
    var r = e.charCodeAt(t)
    55296 <= r && 57343 >= r && ++t, (n += 4)
  }
  return n
}
function Fa(e) {
  var n = va(e) + 1,
    t = Ga(n)
  return t && ua(e, C, t, n), t
}
function Ha(e) {
  var n = va(e) + 1,
    t = Ia(n)
  return ua(e, C, t, n), t
}
function Ma(e) {
  ;(Ja = e),
    (f.HEAP8 = C = new Int8Array(e)),
    (f.HEAP16 = za = new Int16Array(e)),
    (f.HEAP32 = B = new Int32Array(e)),
    (f.HEAPU8 = A = new Uint8Array(e)),
    (f.HEAPU16 = ya = new Uint16Array(e)),
    (f.HEAPU32 = E = new Uint32Array(e)),
    (f.HEAPF32 = Ka = new Float32Array(e)),
    (f.HEAPF64 = La = new Float64Array(e))
}
var Na = f.INITIAL_MEMORY || 134217728
function Oa(e) {
  for (; 0 < e.length; ) {
    var n = e.shift()
    if ('function' == typeof n) n(f)
    else {
      var t = n.de
      'number' == typeof t
        ? void 0 === n.md
          ? f.dynCall_v(t)
          : f.dynCall_vi(t, n.md)
        : t(void 0 === n.md ? null : n.md)
    }
  }
}
;(na = f.wasmMemory
  ? f.wasmMemory
  : new WebAssembly.Memory({ initial: Na / 65536, maximum: 32768 })) &&
  (Ja = na.buffer),
  (Na = Ja.byteLength),
  Ma(Ja),
  (B[108360] = 5676496)
var Pa = [],
  Qa = [],
  Ra = [],
  Sa = [],
  Ta = !1
function Ua() {
  var e = f.preRun.shift()
  Pa.unshift(e)
}
var Va = Math.abs,
  Wa = Math.ceil,
  Xa = Math.floor,
  Ya = Math.min,
  Za = 0,
  $a = null,
  ab = null
function bb() {
  Za++, f.monitorRunDependencies && f.monitorRunDependencies(Za)
}
function cb() {
  if (
    (Za--,
    f.monitorRunDependencies && f.monitorRunDependencies(Za),
    0 == Za && (null !== $a && (clearInterval($a), ($a = null)), ab))
  ) {
    var e = ab
    ;(ab = null), e()
  }
}
function x(e) {
  throw (
    (f.onAbort && f.onAbort(e),
    t((e += '')),
    (pa = !0),
    new WebAssembly.RuntimeError(
      'abort(' + e + '). Build with -s ASSERTIONS=1 for more info.'
    ))
  )
}
function db() {
  var e = eb
  return String.prototype.startsWith
    ? e.startsWith('data:application/octet-stream;base64,')
    : 0 === e.indexOf('data:application/octet-stream;base64,')
}
;(f.preloadedImages = {}), (f.preloadedAudios = {})
var eb = '011c90516755d702cfb4205ca9d93e21fe6683b8.wasm',
  ib,
  jb,
  lb
if (!db()) {
  var fb = eb
  eb = f.locateFile ? f.locateFile(fb, ia) : ia + fb
}
function gb() {
  try {
    if (ma) return new Uint8Array(ma)
    if (ka) return ka(eb)
    throw 'both async and sync fetching of the wasm failed'
  } catch (e) {
    x(e)
  }
}
function hb() {
  return ma || (!fa && !ha) || 'function' != typeof fetch
    ? new Promise(function (e) {
        e(gb())
      })
    : fetch(eb, { credentials: 'same-origin' })
        .then(function (e) {
          if (!e.ok) throw "failed to load wasm binary file at '" + eb + "'"
          return e.arrayBuffer()
        })
        .catch(function () {
          return gb()
        })
}
function mb(e) {
  B[nb() >> 2] = e
}
function ob(e, n) {
  if (0 === e) e = Date.now()
  else {
    if (1 !== e && 4 !== e) return mb(28), -1
    e = lb()
  }
  return (
    (B[n >> 2] = (e / 1e3) | 0), (B[(n + 4) >> 2] = ((e % 1e3) * 1e6) | 0), 0
  )
}
Qa.push({
  de: function () {
    kb()
  },
}),
  (lb = function () {
    return performance.now()
  })
var G = {},
  pb = []
function qb(e) {
  if (!e || G[e]) return e
  for (var n in G)
    for (var t = +n, r = G[t].ld, i = r.length, a = 0; a < i; a++)
      if (r[a] === e) return t
  return e
}
function rb() {
  return 0 < rb.jd
}
var sb = 0
function tb(e, n) {
  for (var t = 0, r = e.length - 1; 0 <= r; r--) {
    var i = e[r]
    '.' === i
      ? e.splice(r, 1)
      : '..' === i
      ? (e.splice(r, 1), t++)
      : t && (e.splice(r, 1), t--)
  }
  if (n) for (; t; t--) e.unshift('..')
  return e
}
function ub(e) {
  var n = '/' === e.charAt(0),
    t = '/' === e.substr(-1)
  return (
    (e = tb(
      e.split('/').filter(function (e) {
        return !!e
      }),
      !n
    ).join('/')) ||
      n ||
      (e = '.'),
    e && t && (e += '/'),
    (n ? '/' : '') + e
  )
}
function vb(e) {
  var n = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
    .exec(e)
    .slice(1)
  return (
    (e = n[0]),
    (n = n[1]),
    e || n ? (n && (n = n.substr(0, n.length - 1)), e + n) : '.'
  )
}
function wb(e) {
  if ('/' === e) return '/'
  var n = e.lastIndexOf('/')
  return -1 === n ? e : e.substr(n + 1)
}
function xb() {
  for (var e = '', n = !1, t = arguments.length - 1; -1 <= t && !n; t--) {
    if ('string' != typeof (n = 0 <= t ? arguments[t] : '/'))
      throw new TypeError('Arguments to path.resolve must be strings')
    if (!n) return ''
    ;(e = n + '/' + e), (n = '/' === n.charAt(0))
  }
  return (
    (n ? '/' : '') +
      (e = tb(
        e.split('/').filter(function (e) {
          return !!e
        }),
        !n
      ).join('/')) || '.'
  )
}
var yb = []
function zb(e, n) {
  ;(yb[e] = { input: [], rc: [], Nc: n }), Ab(e, Bb)
}
var Bb = {
    open: function (e) {
      var n = yb[e.node.bd]
      if (!n) throw new H(43)
      ;(e.qc = n), (e.seekable = !1)
    },
    close: function (e) {
      e.qc.Nc.flush(e.qc)
    },
    flush: function (e) {
      e.qc.Nc.flush(e.qc)
    },
    read: function (e, n, t, r) {
      if (!e.qc || !e.qc.Nc.Fd) throw new H(60)
      for (var i = 0, a = 0; a < r; a++) {
        try {
          var c = e.qc.Nc.Fd(e.qc)
        } catch (e) {
          throw new H(29)
        }
        if (void 0 === c && 0 === i) throw new H(6)
        if (null == c) break
        i++, (n[t + a] = c)
      }
      return i && (e.node.timestamp = Date.now()), i
    },
    write: function (e, n, t, r) {
      if (!e.qc || !e.qc.Nc.td) throw new H(60)
      try {
        for (var i = 0; i < r; i++) e.qc.Nc.td(e.qc, n[t + i])
      } catch (e) {
        throw new H(29)
      }
      return r && (e.node.timestamp = Date.now()), i
    },
  },
  Db = {
    Fd: function (e) {
      if (!e.input.length) {
        var n = null
        if (
          ('undefined' != typeof window && 'function' == typeof window.prompt
            ? null !== (n = window.prompt('Input: ')) && (n += '\n')
            : 'function' == typeof readline &&
              null !== (n = readline()) &&
              (n += '\n'),
          !n)
        )
          return null
        e.input = Cb(n, !0)
      }
      return e.input.shift()
    },
    td: function (e, n) {
      null === n || 10 === n
        ? (la(ta(e.rc, 0)), (e.rc = []))
        : 0 != n && e.rc.push(n)
    },
    flush: function (e) {
      e.rc && 0 < e.rc.length && (la(ta(e.rc, 0)), (e.rc = []))
    },
  },
  Eb = {
    td: function (e, n) {
      null === n || 10 === n
        ? (t(ta(e.rc, 0)), (e.rc = []))
        : 0 != n && e.rc.push(n)
    },
    flush: function (e) {
      e.rc && 0 < e.rc.length && (t(ta(e.rc, 0)), (e.rc = []))
    },
  },
  I = {
    Ac: null,
    Cc: function () {
      return I.createNode(null, '/', 16895, 0)
    },
    createNode: function (e, n, t, r) {
      if (24576 == (61440 & t) || 4096 == (61440 & t)) throw new H(63)
      return (
        I.Ac ||
          (I.Ac = {
            dir: {
              node: {
                Ec: I.kc.Ec,
                vc: I.kc.vc,
                Qc: I.kc.Qc,
                $c: I.kc.$c,
                Md: I.kc.Md,
                kd: I.kc.kd,
                dd: I.kc.dd,
                Ld: I.kc.Ld,
                ed: I.kc.ed,
              },
              stream: { Hc: I.lc.Hc },
            },
            file: {
              node: { Ec: I.kc.Ec, vc: I.kc.vc },
              stream: {
                Hc: I.lc.Hc,
                read: I.lc.read,
                write: I.lc.write,
                xd: I.lc.xd,
                Hd: I.lc.Hd,
                ad: I.lc.ad,
              },
            },
            link: {
              node: { Ec: I.kc.Ec, vc: I.kc.vc, Sc: I.kc.Sc },
              stream: {},
            },
            Ad: { node: { Ec: I.kc.Ec, vc: I.kc.vc }, stream: Fb },
          }),
        K((t = Gb(e, n, t, r)).mode)
          ? ((t.kc = I.Ac.dir.node), (t.lc = I.Ac.dir.stream), (t.jc = {}))
          : 32768 == (61440 & t.mode)
          ? ((t.kc = I.Ac.file.node),
            (t.lc = I.Ac.file.stream),
            (t.oc = 0),
            (t.jc = null))
          : 40960 == (61440 & t.mode)
          ? ((t.kc = I.Ac.link.node), (t.lc = I.Ac.link.stream))
          : 8192 == (61440 & t.mode) &&
            ((t.kc = I.Ac.Ad.node), (t.lc = I.Ac.Ad.stream)),
        (t.timestamp = Date.now()),
        e && (e.jc[n] = t),
        t
      )
    },
    Ue: function (e) {
      if (e.jc && e.jc.subarray) {
        for (var n = [], t = 0; t < e.oc; ++t) n.push(e.jc[t])
        return n
      }
      return e.jc
    },
    Ve: function (e) {
      return e.jc
        ? e.jc.subarray
          ? e.jc.subarray(0, e.oc)
          : new Uint8Array(e.jc)
        : new Uint8Array(0)
    },
    Cd: function (e, n) {
      var t = e.jc ? e.jc.length : 0
      t >= n ||
        ((n = Math.max(n, (t * (1048576 > t ? 2 : 1.125)) >>> 0)),
        0 != t && (n = Math.max(n, 256)),
        (t = e.jc),
        (e.jc = new Uint8Array(n)),
        0 < e.oc && e.jc.set(t.subarray(0, e.oc), 0))
    },
    qe: function (e, n) {
      if (e.oc != n)
        if (0 == n) (e.jc = null), (e.oc = 0)
        else {
          if (!e.jc || e.jc.subarray) {
            var t = e.jc
            ;(e.jc = new Uint8Array(n)),
              t && e.jc.set(t.subarray(0, Math.min(n, e.oc)))
          } else if ((e.jc || (e.jc = []), e.jc.length > n)) e.jc.length = n
          else for (; e.jc.length < n; ) e.jc.push(0)
          e.oc = n
        }
    },
    kc: {
      Ec: function (e) {
        var n = {}
        return (
          (n.Se = 8192 == (61440 & e.mode) ? e.id : 1),
          (n.Ye = e.id),
          (n.mode = e.mode),
          (n.cf = 1),
          (n.uid = 0),
          (n.We = 0),
          (n.bd = e.bd),
          (n.size = K(e.mode)
            ? 4096
            : 32768 == (61440 & e.mode)
            ? e.oc
            : 40960 == (61440 & e.mode)
            ? e.link.length
            : 0),
          (n.Pe = new Date(e.timestamp)),
          (n.bf = new Date(e.timestamp)),
          (n.Re = new Date(e.timestamp)),
          (n.Zd = 4096),
          (n.Qe = Math.ceil(n.size / n.Zd)),
          n
        )
      },
      vc: function (e, n) {
        void 0 !== n.mode && (e.mode = n.mode),
          void 0 !== n.timestamp && (e.timestamp = n.timestamp),
          void 0 !== n.size && I.qe(e, n.size)
      },
      Qc: function () {
        throw Hb[44]
      },
      $c: function (e, n, t, r) {
        return I.createNode(e, n, t, r)
      },
      Md: function (e, n, t) {
        if (K(e.mode)) {
          try {
            var r = Ib(n, t)
          } catch (e) {}
          if (r) for (var i in r.jc) throw new H(55)
        }
        delete e.parent.jc[e.name], (e.name = t), (n.jc[t] = e), (e.parent = n)
      },
      kd: function (e, n) {
        delete e.jc[n]
      },
      dd: function (e, n) {
        var t,
          r = Ib(e, n)
        for (t in r.jc) throw new H(55)
        delete e.jc[n]
      },
      Ld: function (e) {
        var n,
          t = ['.', '..']
        for (n in e.jc) e.jc.hasOwnProperty(n) && t.push(n)
        return t
      },
      ed: function (e, n, t) {
        return ((e = I.createNode(e, n, 41471, 0)).link = t), e
      },
      Sc: function (e) {
        if (40960 != (61440 & e.mode)) throw new H(28)
        return e.link
      },
    },
    lc: {
      read: function (e, n, t, r, i) {
        var a = e.node.jc
        if (i >= e.node.oc) return 0
        if (8 < (e = Math.min(e.node.oc - i, r)) && a.subarray)
          n.set(a.subarray(i, i + e), t)
        else for (r = 0; r < e; r++) n[t + r] = a[i + r]
        return e
      },
      write: function (e, n, t, r, i, a) {
        if ((n.buffer === C.buffer && (a = !1), !r)) return 0
        if (
          (((e = e.node).timestamp = Date.now()),
          n.subarray && (!e.jc || e.jc.subarray))
        ) {
          if (a) return (e.jc = n.subarray(t, t + r)), (e.oc = r)
          if (0 === e.oc && 0 === i)
            return (e.jc = n.slice(t, t + r)), (e.oc = r)
          if (i + r <= e.oc) return e.jc.set(n.subarray(t, t + r), i), r
        }
        if ((I.Cd(e, i + r), e.jc.subarray && n.subarray))
          e.jc.set(n.subarray(t, t + r), i)
        else for (a = 0; a < r; a++) e.jc[i + a] = n[t + a]
        return (e.oc = Math.max(e.oc, i + r)), r
      },
      Hc: function (e, n, t) {
        if (
          (1 === t
            ? (n += e.position)
            : 2 === t && 32768 == (61440 & e.node.mode) && (n += e.node.oc),
          0 > n)
        )
          throw new H(28)
        return n
      },
      xd: function (e, n, t) {
        I.Cd(e.node, n + t), (e.node.oc = Math.max(e.node.oc, n + t))
      },
      Hd: function (e, n, t, r, i, a) {
        if ((qa(0 === n), 32768 != (61440 & e.node.mode))) throw new H(43)
        if (((e = e.node.jc), 2 & a || e.buffer !== Ja)) {
          for (
            (0 < r || r + t < e.length) &&
              (e = e.subarray
                ? e.subarray(r, r + t)
                : Array.prototype.slice.call(e, r, r + t)),
              r = !0,
              a = 16384 * Math.ceil(t / 16384),
              n = Ga(a);
            t < a;

          )
            C[n + t++] = 0
          if (!(t = n)) throw new H(48)
          C.set(e, t)
        } else (r = !1), (t = e.byteOffset)
        return { nc: t, Yd: r }
      },
      ad: function (e, n, t, r, i) {
        if (32768 != (61440 & e.node.mode)) throw new H(43)
        return 2 & i || I.lc.write(e, n, 0, r, t, !1), 0
      },
    },
  },
  Jb = null,
  Kb = {},
  Lb = [],
  Mb = 1,
  Nb = null,
  Ob = !0,
  L = {},
  H = null,
  Hb = {}
function M(e, n) {
  if (((n = n || {}), !(e = xb('/', e)))) return { path: '', node: null }
  var t,
    r = { Ed: !0, vd: 0 }
  for (t in r) void 0 === n[t] && (n[t] = r[t])
  if (8 < n.vd) throw new H(32)
  e = tb(
    e.split('/').filter(function (e) {
      return !!e
    }),
    !1
  )
  var i = Jb
  for (r = '/', t = 0; t < e.length; t++) {
    var a = t === e.length - 1
    if (a && n.parent) break
    if (
      ((i = Ib(i, e[t])),
      (r = ub(r + '/' + e[t])),
      i.Lc && (!a || (a && n.Ed)) && (i = i.Lc.root),
      !a || n.od)
    )
      for (a = 0; 40960 == (61440 & i.mode); )
        if (
          ((i = Pb(r)),
          (i = M((r = xb(vb(r), i)), { vd: n.vd }).node),
          40 < a++)
        )
          throw new H(32)
  }
  return { path: r, node: i }
}
function Qb(e) {
  for (var n; ; ) {
    if (e === e.parent)
      return (
        (e = e.Cc.Id), n ? ('/' !== e[e.length - 1] ? e + '/' + n : e + n) : e
      )
    ;(n = n ? e.name + '/' + n : e.name), (e = e.parent)
  }
}
function Rb(e, n) {
  for (var t = 0, r = 0; r < n.length; r++)
    t = ((t << 5) - t + n.charCodeAt(r)) | 0
  return ((e + t) >>> 0) % Nb.length
}
function Sb(e) {
  var n = Rb(e.parent.id, e.name)
  if (Nb[n] === e) Nb[n] = e.Mc
  else
    for (n = Nb[n]; n; ) {
      if (n.Mc === e) {
        n.Mc = e.Mc
        break
      }
      n = n.Mc
    }
}
function Ib(e, n) {
  var t
  if ((t = (t = Tb(e, 'x')) ? t : e.kc.Qc ? 0 : 2)) throw new H(t, e)
  for (t = Nb[Rb(e.id, n)]; t; t = t.Mc) {
    var r = t.name
    if (t.parent.id === e.id && r === n) return t
  }
  return e.kc.Qc(e, n)
}
function Gb(e, n, t, r) {
  return (
    (n = Rb((e = new Ub(e, n, t, r)).parent.id, e.name)),
    (e.Mc = Nb[n]),
    (Nb[n] = e)
  )
}
function K(e) {
  return 16384 == (61440 & e)
}
var Vb = {
  r: 0,
  rs: 1052672,
  'r+': 2,
  w: 577,
  wx: 705,
  xw: 705,
  'w+': 578,
  'wx+': 706,
  'xw+': 706,
  a: 1089,
  ax: 1217,
  xa: 1217,
  'a+': 1090,
  'ax+': 1218,
  'xa+': 1218,
}
function Wb(e) {
  var n = ['r', 'w', 'rw'][3 & e]
  return 512 & e && (n += 'w'), n
}
function Tb(e, n) {
  return Ob ||
    ((-1 === n.indexOf('r') || 292 & e.mode) &&
      (-1 === n.indexOf('w') || 146 & e.mode) &&
      (-1 === n.indexOf('x') || 73 & e.mode))
    ? 0
    : 2
}
function Xb(e, n) {
  try {
    return Ib(e, n), 20
  } catch (e) {}
  return Tb(e, 'wx')
}
function Yb(e, n, t) {
  try {
    var r = Ib(e, n)
  } catch (e) {
    return e.uc
  }
  if ((e = Tb(e, 'wx'))) return e
  if (t) {
    if (!K(r.mode)) return 54
    if (r === r.parent || '/' === Qb(r)) return 10
  } else if (K(r.mode)) return 31
  return 0
}
function Zb(e) {
  for (e = e || 0; e <= 4096; e++) if (!Lb[e]) return e
  throw new H(33)
}
function $b(e, n) {
  ac ||
    ((ac = function () {}).prototype = {
      object: {
        get: function () {
          return this.node
        },
        set: function (e) {
          this.node = e
        },
      },
    })
  var t,
    r = new ac()
  for (t in e) r[t] = e[t]
  return (e = r), (n = Zb(n)), (e.Bc = n), (Lb[n] = e)
}
var Fb = {
    open: function (e) {
      ;(e.lc = Kb[e.node.bd].lc), e.lc.open && e.lc.open(e)
    },
    Hc: function () {
      throw new H(70)
    },
  },
  oc
function Ab(e, n) {
  Kb[e] = { lc: n }
}
function bc(e, n) {
  var t = '/' === n,
    r = !n
  if (t && Jb) throw new H(10)
  if (!t && !r) {
    var i = M(n, { Ed: !1 })
    if (((n = i.path), (i = i.node).Lc)) throw new H(10)
    if (!K(i.mode)) throw new H(54)
  }
  ;(n = { type: e, ef: {}, Id: n, me: [] }),
    ((e = e.Cc(n)).Cc = n),
    (n.root = e),
    t ? (Jb = e) : i && ((i.Lc = n), i.Cc && i.Cc.me.push(n))
}
function cc(e, n, t) {
  var r = M(e, { parent: !0 }).node
  if (!(e = wb(e)) || '.' === e || '..' === e) throw new H(28)
  var i = Xb(r, e)
  if (i) throw new H(i)
  if (!r.kc.$c) throw new H(63)
  return r.kc.$c(r, e, n, t)
}
function N(e, n) {
  return cc(e, (1023 & (void 0 !== n ? n : 511)) | 16384, 0)
}
function dc(e, n, t) {
  return void 0 === t && ((t = n), (n = 438)), cc(e, 8192 | n, t)
}
function ec(e, n) {
  if (!xb(e)) throw new H(44)
  var t = M(n, { parent: !0 }).node
  if (!t) throw new H(44)
  var r = Xb(t, (n = wb(n)))
  if (r) throw new H(r)
  if (!t.kc.ed) throw new H(63)
  return t.kc.ed(t, n, e)
}
function fc(e) {
  var n = M(e, { parent: !0 }).node,
    r = wb(e),
    i = Ib(n, r),
    a = Yb(n, r, !1)
  if (a) throw new H(a)
  if (!n.kc.kd) throw new H(63)
  if (i.Lc) throw new H(10)
  try {
    L.willDeletePath && L.willDeletePath(e)
  } catch (n) {
    t(
      "FS.trackingDelegate['willDeletePath']('" +
        e +
        "') threw an exception: " +
        n.message
    )
  }
  n.kc.kd(n, r), Sb(i)
  try {
    L.onDeletePath && L.onDeletePath(e)
  } catch (n) {
    t(
      "FS.trackingDelegate['onDeletePath']('" +
        e +
        "') threw an exception: " +
        n.message
    )
  }
}
function Pb(e) {
  if (!(e = M(e).node)) throw new H(44)
  if (!e.kc.Sc) throw new H(28)
  return xb(Qb(e.parent), e.kc.Sc(e))
}
function gc(e, n) {
  if (!(e = 'string' == typeof e ? M(e, { od: !0 }).node : e).kc.vc)
    throw new H(63)
  e.kc.vc(e, { mode: (4095 & n) | (-4096 & e.mode), timestamp: Date.now() })
}
function hc(e, n, r, i) {
  if ('' === e) throw new H(44)
  if ('string' == typeof n) {
    var a = Vb[n]
    if (void 0 === a) throw Error('Unknown file open mode: ' + n)
    n = a
  }
  if (
    ((r = 64 & n ? (4095 & (void 0 === r ? 438 : r)) | 32768 : 0),
    'object' == typeof e)
  )
    var c = e
  else {
    e = ub(e)
    try {
      c = M(e, { od: !(131072 & n) }).node
    } catch (e) {}
  }
  if (((a = !1), 64 & n))
    if (c) {
      if (128 & n) throw new H(20)
    } else (c = cc(e, r, 0)), (a = !0)
  if (!c) throw new H(44)
  if ((8192 == (61440 & c.mode) && (n &= -513), 65536 & n && !K(c.mode)))
    throw new H(54)
  if (
    !a &&
    (r = c
      ? 40960 == (61440 & c.mode)
        ? 32
        : K(c.mode) && ('r' !== Wb(n) || 512 & n)
        ? 31
        : Tb(c, Wb(n))
      : 44)
  )
    throw new H(r)
  if (512 & n) {
    if (!(r = 'string' == typeof (r = c) ? M(r, { od: !0 }).node : r).kc.vc)
      throw new H(63)
    if (K(r.mode)) throw new H(31)
    if (32768 != (61440 & r.mode)) throw new H(28)
    if ((a = Tb(r, 'w'))) throw new H(a)
    r.kc.vc(r, { size: 0, timestamp: Date.now() })
  }
  ;(n &= -131713),
    (i = $b(
      {
        node: c,
        path: Qb(c),
        flags: n,
        seekable: !0,
        position: 0,
        lc: c.lc,
        Be: [],
        error: !1,
      },
      i
    )).lc.open && i.lc.open(i),
    !f.logReadFiles ||
      1 & n ||
      (ic || (ic = {}),
      e in ic ||
        ((ic[e] = 1), t('FS.trackingDelegate error on read file: ' + e)))
  try {
    L.onOpenFile &&
      ((c = 0),
      1 != (2097155 & n) && (c |= 1),
      0 != (2097155 & n) && (c |= 2),
      L.onOpenFile(e, c))
  } catch (n) {
    t(
      "FS.trackingDelegate['onOpenFile']('" +
        e +
        "', flags) threw an exception: " +
        n.message
    )
  }
  return i
}
function jc(e) {
  if (null === e.Bc) throw new H(8)
  e.pd && (e.pd = null)
  try {
    e.lc.close && e.lc.close(e)
  } catch (e) {
    throw e
  } finally {
    Lb[e.Bc] = null
  }
  e.Bc = null
}
function kc(e, n, t) {
  if (null === e.Bc) throw new H(8)
  if (!e.seekable || !e.lc.Hc) throw new H(70)
  if (0 != t && 1 != t && 2 != t) throw new H(28)
  ;(e.position = e.lc.Hc(e, n, t)), (e.Be = [])
}
function lc(e, n, t, r) {
  var i = C
  if (0 > t || 0 > r) throw new H(28)
  if (null === e.Bc) throw new H(8)
  if (1 == (2097155 & e.flags)) throw new H(8)
  if (K(e.node.mode)) throw new H(31)
  if (!e.lc.read) throw new H(28)
  var a = void 0 !== r
  if (a) {
    if (!e.seekable) throw new H(70)
  } else r = e.position
  return (n = e.lc.read(e, i, n, t, r)), a || (e.position += n), n
}
function mc(e, n, r, i, a, c) {
  if (0 > i || 0 > a) throw new H(28)
  if (null === e.Bc) throw new H(8)
  if (0 == (2097155 & e.flags)) throw new H(8)
  if (K(e.node.mode)) throw new H(31)
  if (!e.lc.write) throw new H(28)
  e.seekable && 1024 & e.flags && kc(e, 0, 2)
  var o = void 0 !== a
  if (o) {
    if (!e.seekable) throw new H(70)
  } else a = e.position
  ;(n = e.lc.write(e, n, r, i, a, c)), o || (e.position += n)
  try {
    e.path && L.onWriteToFile && L.onWriteToFile(e.path)
  } catch (n) {
    t(
      "FS.trackingDelegate['onWriteToFile']('" +
        e.path +
        "') threw an exception: " +
        n.message
    )
  }
  return n
}
function nc() {
  H ||
    (((H = function (e, n) {
      ;(this.node = n),
        (this.se = function (e) {
          this.uc = e
        }),
        this.se(e),
        (this.message = 'FS error')
    }).prototype = Error()),
    (H.prototype.constructor = H),
    [44].forEach(function (e) {
      ;(Hb[e] = new H(e)), (Hb[e].stack = '<generic error, no stack>')
    }))
}
function pc(e, n) {
  var t = 0
  return e && (t |= 365), n && (t |= 146), t
}
function qc(e, n, t, r) {
  return N((e = ub(('string' == typeof e ? e : Qb(e)) + '/' + n)), pc(t, r))
}
function rc(e, n) {
  for (
    e = 'string' == typeof e ? e : Qb(e), n = n.split('/').reverse();
    n.length;

  ) {
    var t = n.pop()
    if (t) {
      var r = ub(e + '/' + t)
      try {
        N(r)
      } catch (e) {}
      e = r
    }
  }
  return r
}
function sc(e, n, t, r) {
  return cc(
    (e = ub(('string' == typeof e ? e : Qb(e)) + '/' + n)),
    (4095 & (void 0 !== (t = pc(t, r)) ? t : 438)) | 32768,
    0
  )
}
function tc(e, n, t, r, i, a) {
  if (
    ((i = cc(
      (e = n ? ub(('string' == typeof e ? e : Qb(e)) + '/' + n) : e),
      (4095 & (void 0 !== (r = pc(r, i)) ? r : 438)) | 32768,
      0
    )),
    t)
  ) {
    if ('string' == typeof t) {
      ;(e = Array(t.length)), (n = 0)
      for (var c = t.length; n < c; ++n) e[n] = t.charCodeAt(n)
      t = e
    }
    gc(i, 146 | r), mc((e = hc(i, 'w')), t, 0, t.length, 0, a), jc(e), gc(i, r)
  }
  return i
}
function O(e, n, t, r) {
  ;(e = ub(('string' == typeof e ? e : Qb(e)) + '/' + n)),
    (n = pc(!!t, !!r)),
    O.Gd || (O.Gd = 64)
  var i = (O.Gd++ << 8) | 0
  return (
    Ab(i, {
      open: function (e) {
        e.seekable = !1
      },
      close: function () {
        r && r.buffer && r.buffer.length && r(10)
      },
      read: function (e, n, r, i) {
        for (var a = 0, c = 0; c < i; c++) {
          try {
            var o = t()
          } catch (e) {
            throw new H(29)
          }
          if (void 0 === o && 0 === a) throw new H(6)
          if (null == o) break
          a++, (n[r + c] = o)
        }
        return a && (e.node.timestamp = Date.now()), a
      },
      write: function (e, n, t, i) {
        for (var a = 0; a < i; a++)
          try {
            r(n[t + a])
          } catch (e) {
            throw new H(29)
          }
        return i && (e.node.timestamp = Date.now()), a
      },
    }),
    dc(e, n, i)
  )
}
function uc(e, n, t) {
  return ec(t, (e = ub(('string' == typeof e ? e : Qb(e)) + '/' + n)))
}
function vc(e) {
  if (e.ke || e.le || e.link || e.jc) return !0
  var n = !0
  if ('undefined' != typeof XMLHttpRequest)
    throw Error(
      'Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.'
    )
  if (!ja) throw Error('Cannot load without read() or XMLHttpRequest.')
  try {
    ;(e.jc = Cb(ja(e.url), !0)), (e.oc = e.jc.length)
  } catch (e) {
    n = !1
  }
  return n || mb(29), n
}
function wc(e, n, t, r, i) {
  function a() {
    ;(this.rd = !1), (this.Wc = [])
  }
  if (
    ((a.prototype.get = function (e) {
      if (!(e > this.length - 1 || 0 > e)) {
        var n = e % this.Bd
        return this.Xc((e / this.Bd) | 0)[n]
      }
    }),
    (a.prototype.re = function (e) {
      this.Xc = e
    }),
    (a.prototype.yd = function () {
      var e = new XMLHttpRequest()
      if (
        (e.open('HEAD', t, !1),
        e.send(null),
        !((200 <= e.status && 300 > e.status) || 304 === e.status))
      )
        throw Error("Couldn't load " + t + '. Status: ' + e.status)
      var n,
        r = Number(e.getResponseHeader('Content-length')),
        i = (n = e.getResponseHeader('Accept-Ranges')) && 'bytes' === n
      e = (n = e.getResponseHeader('Content-Encoding')) && 'gzip' === n
      var a = 1048576
      i || (a = r)
      var c = this
      c.re(function (e) {
        var n = e * a,
          i = (e + 1) * a - 1
        if (((i = Math.min(i, r - 1)), void 0 === c.Wc[e])) {
          var o = c.Wc
          if (n > i)
            throw Error(
              'invalid range (' + n + ', ' + i + ') or no bytes requested!'
            )
          if (i > r - 1)
            throw Error('only ' + r + ' bytes available! programmer error!')
          var f = new XMLHttpRequest()
          if (
            (f.open('GET', t, !1),
            r !== a && f.setRequestHeader('Range', 'bytes=' + n + '-' + i),
            'undefined' != typeof Uint8Array &&
              (f.responseType = 'arraybuffer'),
            f.overrideMimeType &&
              f.overrideMimeType('text/plain; charset=x-user-defined'),
            f.send(null),
            !((200 <= f.status && 300 > f.status) || 304 === f.status))
          )
            throw Error("Couldn't load " + t + '. Status: ' + f.status)
          ;(n =
            void 0 !== f.response
              ? new Uint8Array(f.response || [])
              : Cb(f.responseText || '', !0)),
            (o[e] = n)
        }
        if (void 0 === c.Wc[e]) throw Error('doXHR failed!')
        return c.Wc[e]
      }),
        (!e && r) ||
          ((a = r = 1),
          (a = r = this.Xc(0).length),
          la(
            'LazyFiles on gzip forces download of the whole file when length is accessed'
          )),
        (this.Wd = r),
        (this.Vd = a),
        (this.rd = !0)
    }),
    'undefined' != typeof XMLHttpRequest)
  ) {
    if (!ha)
      throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc'
    var c = new a()
    Object.defineProperties(c, {
      length: {
        get: function () {
          return this.rd || this.yd(), this.Wd
        },
      },
      Bd: {
        get: function () {
          return this.rd || this.yd(), this.Vd
        },
      },
    })
    var o = void 0
  } else (o = t), (c = void 0)
  var f = sc(e, n, r, i)
  c ? (f.jc = c) : o && ((f.jc = null), (f.url = o)),
    Object.defineProperties(f, {
      oc: {
        get: function () {
          return this.jc.length
        },
      },
    })
  var u = {}
  return (
    Object.keys(f.lc).forEach(function (e) {
      var n = f.lc[e]
      u[e] = function () {
        if (!vc(f)) throw new H(29)
        return n.apply(null, arguments)
      }
    }),
    (u.read = function (e, n, t, r, i) {
      if (!vc(f)) throw new H(29)
      if (i >= (e = e.node.jc).length) return 0
      if (((r = Math.min(e.length - i, r)), e.slice))
        for (var a = 0; a < r; a++) n[t + a] = e[i + a]
      else for (a = 0; a < r; a++) n[t + a] = e.get(i + a)
      return r
    }),
    (f.lc = u),
    f
  )
}
function xc(e, n, t, r, i, a, c, o, u, l) {
  function d(t) {
    function d(t) {
      l && l(), o || tc(e, n, t, r, i, u), a && a(), cb(p)
    }
    var h = !1
    f.preloadPlugins.forEach(function (e) {
      !h &&
        e.canHandle(s) &&
        (e.handle(t, s, d, function () {
          c && c(), cb(p)
        }),
        (h = !0))
    }),
      h || d(t)
  }
  yc.Xe()
  var s = n ? xb(ub(e + '/' + n)) : e,
    p = 'cp ' + s
  bb(p),
    'string' == typeof t
      ? yc.Oe(
          t,
          function (e) {
            d(e)
          },
          c
        )
      : d(t)
}
var P = {},
  ac,
  ic,
  zc = {},
  Ac = void 0
function Bc() {
  return B[((Ac += 4) - 4) >> 2]
}
function Cc(e) {
  if (!(e = Lb[e])) throw new H(8)
  return e
}
var Dc = {}
function Ec(e) {
  for (; e.length; ) {
    var n = e.pop()
    e.pop()(n)
  }
}
function Fc(e) {
  return this.fromWireType(E[e >> 2])
}
var Gc = {},
  Hc = {},
  Ic = {}
function Jc(e) {
  if (void 0 === e) return '_unknown'
  var n = (e = e.replace(/[^a-zA-Z0-9_]/g, '$')).charCodeAt(0)
  return 48 <= n && 57 >= n ? '_' + e : e
}
function Kc(e, n) {
  return (
    (e = Jc(e)),
    new Function(
      'body',
      'return function ' +
        e +
        '() {\n    "use strict";    return body.apply(this, arguments);\n};\n'
    )(n)
  )
}
function Lc(e) {
  var n = Error,
    t = Kc(e, function (n) {
      ;(this.name = e),
        (this.message = n),
        void 0 !== (n = Error(n).stack) &&
          (this.stack =
            this.toString() + '\n' + n.replace(/^Error(:[^\n]*)?\n/, ''))
    })
  return (
    (t.prototype = Object.create(n.prototype)),
    (t.prototype.constructor = t),
    (t.prototype.toString = function () {
      return void 0 === this.message
        ? this.name
        : this.name + ': ' + this.message
    }),
    t
  )
}
var Mc = void 0
function Nc(e) {
  throw new Mc(e)
}
function Oc(e, n, t) {
  function r(n) {
    ;(n = t(n)).length !== e.length && Nc('Mismatched type converter count')
    for (var r = 0; r < e.length; ++r) Q(e[r], n[r])
  }
  e.forEach(function (e) {
    Ic[e] = n
  })
  var i = Array(n.length),
    a = [],
    c = 0
  n.forEach(function (e, n) {
    Hc.hasOwnProperty(e)
      ? (i[n] = Hc[e])
      : (a.push(e),
        Gc.hasOwnProperty(e) || (Gc[e] = []),
        Gc[e].push(function () {
          ;(i[n] = Hc[e]), ++c === a.length && r(i)
        }))
  }),
    0 === a.length && r(i)
}
function Pc(e) {
  switch (e) {
    case 1:
      return 0
    case 2:
      return 1
    case 4:
      return 2
    case 8:
      return 3
    default:
      throw new TypeError('Unknown type size: ' + e)
  }
}
var Qc = void 0
function R(e) {
  for (var n = ''; A[e]; ) n += Qc[A[e++]]
  return n
}
var Rc = void 0
function S(e) {
  throw new Rc(e)
}
function Q(e, n, t) {
  if (((t = t || {}), !('argPackAdvance' in n)))
    throw new TypeError(
      'registerType registeredInstance requires argPackAdvance'
    )
  var r = n.name
  if (
    (e || S('type "' + r + '" must have a positive integer typeid pointer'),
    Hc.hasOwnProperty(e))
  ) {
    if (t.ie) return
    S("Cannot register type '" + r + "' twice")
  }
  ;(Hc[e] = n),
    delete Ic[e],
    Gc.hasOwnProperty(e) &&
      ((n = Gc[e]),
      delete Gc[e],
      n.forEach(function (e) {
        e()
      }))
}
function Sc(e) {
  return {
    count: e.count,
    Kc: e.Kc,
    Rc: e.Rc,
    nc: e.nc,
    pc: e.pc,
    wc: e.wc,
    yc: e.yc,
  }
}
function Tc(e) {
  S(e.ic.pc.mc.name + ' instance already deleted')
}
var Uc = !1
function Vc() {}
function Wc(e) {
  --e.count.value,
    0 === e.count.value && (e.wc ? e.yc.Dc(e.wc) : e.pc.mc.Dc(e.nc))
}
function Xc(e) {
  return 'undefined' == typeof FinalizationGroup
    ? ((Xc = function (e) {
        return e
      }),
      e)
    : ((Uc = new FinalizationGroup(function (e) {
        for (var n = e.next(); !n.done; n = e.next())
          (n = n.value).nc
            ? Wc(n)
            : console.warn('object already deleted: ' + n.nc)
      })),
      (Vc = function (e) {
        Uc.unregister(e.ic)
      }),
      (Xc = function (e) {
        return Uc.register(e, e.ic, e.ic), e
      })(e))
}
var Yc = void 0,
  Zc = []
function $c() {
  for (; Zc.length; ) {
    var e = Zc.pop()
    ;(e.ic.Kc = !1), e.delete()
  }
}
function ad() {}
var bd = {}
function cd(e, n, t) {
  if (void 0 === e[n].sc) {
    var r = e[n]
    ;(e[n] = function () {
      return (
        e[n].sc.hasOwnProperty(arguments.length) ||
          S(
            "Function '" +
              t +
              "' called with an invalid number of arguments (" +
              arguments.length +
              ') - expects one of (' +
              e[n].sc +
              ')!'
          ),
        e[n].sc[arguments.length].apply(this, arguments)
      )
    }),
      (e[n].sc = []),
      (e[n].sc[r.Vc] = r)
  }
}
function dd(e, n, t) {
  f.hasOwnProperty(e)
    ? ((void 0 === t || (void 0 !== f[e].sc && void 0 !== f[e].sc[t])) &&
        S("Cannot register public name '" + e + "' twice"),
      cd(f, e, e),
      f.hasOwnProperty(t) &&
        S(
          'Cannot register multiple overloads of a function with the same number of arguments (' +
            t +
            ')!'
        ),
      (f[e].sc[t] = n))
    : ((f[e] = n), void 0 !== t && (f[e].df = t))
}
function ed(e, n, t, r, i, a, c, o) {
  ;(this.name = e),
    (this.constructor = n),
    (this.Fc = t),
    (this.Dc = r),
    (this.zc = i),
    (this.ee = a),
    (this.Uc = c),
    (this.be = o),
    (this.oe = [])
}
function fd(e, n, t) {
  for (; n !== t; )
    n.Uc ||
      S(
        'Expected null or instance of ' +
          t.name +
          ', got an instance of ' +
          n.name
      ),
      (e = n.Uc(e)),
      (n = n.zc)
  return e
}
function gd(e, n) {
  return null === n
    ? (this.qd && S('null is not a valid ' + this.name), 0)
    : (n.ic || S('Cannot pass "' + hd(n) + '" as a ' + this.name),
      n.ic.nc ||
        S('Cannot pass deleted object as a pointer of type ' + this.name),
      fd(n.ic.nc, n.ic.pc.mc, this.mc))
}
function id(e, n) {
  if (null === n) {
    if ((this.qd && S('null is not a valid ' + this.name), this.Zc)) {
      var t = this.ud()
      return null !== e && e.push(this.Dc, t), t
    }
    return 0
  }
  if (
    (n.ic || S('Cannot pass "' + hd(n) + '" as a ' + this.name),
    n.ic.nc ||
      S('Cannot pass deleted object as a pointer of type ' + this.name),
    !this.Yc &&
      n.ic.pc.Yc &&
      S(
        'Cannot convert argument of type ' +
          (n.ic.yc ? n.ic.yc.name : n.ic.pc.name) +
          ' to parameter type ' +
          this.name
      ),
    (t = fd(n.ic.nc, n.ic.pc.mc, this.mc)),
    this.Zc)
  )
    switch (
      (void 0 === n.ic.wc &&
        S('Passing raw pointer to smart pointer is illegal'),
      this.we)
    ) {
      case 0:
        n.ic.yc === this
          ? (t = n.ic.wc)
          : S(
              'Cannot convert argument of type ' +
                (n.ic.yc ? n.ic.yc.name : n.ic.pc.name) +
                ' to parameter type ' +
                this.name
            )
        break
      case 1:
        t = n.ic.wc
        break
      case 2:
        if (n.ic.yc === this) t = n.ic.wc
        else {
          var r = n.clone()
          ;(t = this.pe(
            t,
            jd(function () {
              r.delete()
            })
          )),
            null !== e && e.push(this.Dc, t)
        }
        break
      default:
        S('Unsupporting sharing policy')
    }
  return t
}
function kd(e, n) {
  return null === n
    ? (this.qd && S('null is not a valid ' + this.name), 0)
    : (n.ic || S('Cannot pass "' + hd(n) + '" as a ' + this.name),
      n.ic.nc ||
        S('Cannot pass deleted object as a pointer of type ' + this.name),
      n.ic.pc.Yc &&
        S(
          'Cannot convert argument of type ' +
            n.ic.pc.name +
            ' to parameter type ' +
            this.name
        ),
      fd(n.ic.nc, n.ic.pc.mc, this.mc))
}
function ld(e, n, t) {
  return n === t
    ? e
    : void 0 === t.zc || null === (e = ld(e, n, t.zc))
    ? null
    : t.be(e)
}
var md = {}
function nd(e, n) {
  for (void 0 === n && S('ptr should not be undefined'); e.zc; )
    (n = e.Uc(n)), (e = e.zc)
  return md[n]
}
function od(e, n) {
  return (
    (n.pc && n.nc) || Nc('makeClassHandle requires ptr and ptrType'),
    !!n.yc != !!n.wc && Nc('Both smartPtrType and smartPtr must be specified'),
    (n.count = { value: 1 }),
    Xc(Object.create(e, { ic: { value: n } }))
  )
}
function pd(e, n, t, r) {
  ;(this.name = e),
    (this.mc = n),
    (this.qd = t),
    (this.Yc = r),
    (this.Zc = !1),
    (this.Dc = this.pe = this.ud = this.Kd = this.we = this.ne = void 0),
    void 0 !== n.zc
      ? (this.toWireType = id)
      : ((this.toWireType = r ? gd : kd), (this.xc = null))
}
function qd(e, n, t) {
  f.hasOwnProperty(e) || Nc('Replacing nonexistant public symbol'),
    void 0 !== f[e].sc && void 0 !== t
      ? (f[e].sc[t] = n)
      : ((f[e] = n), (f[e].Vc = t))
}
function T(e, n) {
  e = R(e)
  for (var t = f['dynCall_' + e], r = [], i = 1; i < e.length; ++i)
    r.push('a' + i)
  return (
    (i =
      'return function dynCall_' + e + '_' + n + '(' + r.join(', ') + ') {\n'),
    (i +=
      '    return dynCall(rawFunction' +
      (r.length ? ', ' : '') +
      r.join(', ') +
      ');\n'),
    'function' !=
      typeof (t = new Function('dynCall', 'rawFunction', i + '};\n')(t, n)) &&
      S('unknown function pointer with signature ' + e + ': ' + n),
    t
  )
}
var rd = void 0
function sd(e) {
  var n = R((e = td(e)))
  return U(e), n
}
function ud(e, n) {
  var t = [],
    r = {}
  throw (
    (n.forEach(function e(n) {
      r[n] || Hc[n] || (Ic[n] ? Ic[n].forEach(e) : (t.push(n), (r[n] = !0)))
    }),
    new rd(e + ': ' + t.map(sd).join([', '])))
  )
}
function vd(e, n) {
  for (var t = [], r = 0; r < e; r++) t.push(B[(n >> 2) + r])
  return t
}
function wd(e) {
  var n = Function
  if (!(n instanceof Function))
    throw new TypeError(
      'new_ called with constructor type ' +
        typeof n +
        ' which is not a function'
    )
  var t = Kc(n.name || 'unknownFunctionName', function () {})
  return (
    (t.prototype = n.prototype),
    (t = new t()),
    (e = n.apply(t, e)) instanceof Object ? e : t
  )
}
function xd(e, n, t, r, i) {
  var a = n.length
  2 > a &&
    S(
      "argTypes array size mismatch! Must at least get return value and 'this' types!"
    )
  var c = null !== n[1] && null !== t,
    o = !1
  for (t = 1; t < n.length; ++t)
    if (null !== n[t] && void 0 === n[t].xc) {
      o = !0
      break
    }
  var f = 'void' !== n[0].name,
    u = '',
    l = ''
  for (t = 0; t < a - 2; ++t)
    (u += (0 !== t ? ', ' : '') + 'arg' + t),
      (l += (0 !== t ? ', ' : '') + 'arg' + t + 'Wired')
  ;(e =
    'return function ' +
    Jc(e) +
    '(' +
    u +
    ') {\nif (arguments.length !== ' +
    (a - 2) +
    ") {\nthrowBindingError('function " +
    e +
    " called with ' + arguments.length + ' arguments, expected " +
    (a - 2) +
    " args!');\n}\n"),
    o && (e += 'var destructors = [];\n')
  var d = o ? 'destructors' : 'null'
  for (
    u = 'throwBindingError invoker fn runDestructors retType classParam'.split(
      ' '
    ),
      r = [S, r, i, Ec, n[0], n[1]],
      c && (e += 'var thisWired = classParam.toWireType(' + d + ', this);\n'),
      t = 0;
    t < a - 2;
    ++t
  )
    (e +=
      'var arg' +
      t +
      'Wired = argType' +
      t +
      '.toWireType(' +
      d +
      ', arg' +
      t +
      '); // ' +
      n[t + 2].name +
      '\n'),
      u.push('argType' + t),
      r.push(n[t + 2])
  if (
    (c && (l = 'thisWired' + (0 < l.length ? ', ' : '') + l),
    (e +=
      (f ? 'var rv = ' : '') +
      'invoker(fn' +
      (0 < l.length ? ', ' : '') +
      l +
      ');\n'),
    o)
  )
    e += 'runDestructors(destructors);\n'
  else
    for (t = c ? 1 : 2; t < n.length; ++t)
      (a = 1 === t ? 'thisWired' : 'arg' + (t - 2) + 'Wired'),
        null !== n[t].xc &&
          ((e += a + '_dtor(' + a + '); // ' + n[t].name + '\n'),
          u.push(a + '_dtor'),
          r.push(n[t].xc))
  return (
    f && (e += 'var ret = retType.fromWireType(rv);\nreturn ret;\n'),
    u.push(e + '}\n'),
    wd(u).apply(null, r)
  )
}
function yd(e, n, t) {
  return (
    e instanceof Object || S(t + ' with invalid "this": ' + e),
    e instanceof n.mc.constructor ||
      S(t + ' incompatible with "this" of type ' + e.constructor.name),
    e.ic.nc ||
      S('cannot call emscripten binding method ' + t + ' on deleted object'),
    fd(e.ic.nc, e.ic.pc.mc, n.mc)
  )
}
var zd = [],
  V = [{}, { value: void 0 }, { value: null }, { value: !0 }, { value: !1 }]
function Ad(e) {
  4 < e && 0 == --V[e].Ic && ((V[e] = void 0), zd.push(e))
}
function jd(e) {
  switch (e) {
    case void 0:
      return 1
    case null:
      return 2
    case !0:
      return 3
    case !1:
      return 4
    default:
      var n = zd.length ? zd.pop() : V.length
      return (V[n] = { Ic: 1, value: e }), n
  }
}
function Bd(e, n, t) {
  switch (n) {
    case 0:
      return function (e) {
        return this.fromWireType((t ? C : A)[e])
      }
    case 1:
      return function (e) {
        return this.fromWireType((t ? za : ya)[e >> 1])
      }
    case 2:
      return function (e) {
        return this.fromWireType((t ? B : E)[e >> 2])
      }
    default:
      throw new TypeError('Unknown integer type: ' + e)
  }
}
function Cd(e, n) {
  var t = Hc[e]
  return void 0 === t && S(n + ' has unknown type ' + sd(e)), t
}
function hd(e) {
  if (null === e) return 'null'
  var n = typeof e
  return 'object' === n || 'array' === n || 'function' === n
    ? e.toString()
    : '' + e
}
function Dd(e, n) {
  switch (n) {
    case 2:
      return function (e) {
        return this.fromWireType(Ka[e >> 2])
      }
    case 3:
      return function (e) {
        return this.fromWireType(La[e >> 3])
      }
    default:
      throw new TypeError('Unknown float type: ' + e)
  }
}
function Ed(e, n, t) {
  switch (n) {
    case 0:
      return t
        ? function (e) {
            return C[e]
          }
        : function (e) {
            return A[e]
          }
    case 1:
      return t
        ? function (e) {
            return za[e >> 1]
          }
        : function (e) {
            return ya[e >> 1]
          }
    case 2:
      return t
        ? function (e) {
            return B[e >> 2]
          }
        : function (e) {
            return E[e >> 2]
          }
    default:
      throw new TypeError('Unknown integer type: ' + e)
  }
}
function Fd(e) {
  return e || S('Cannot use deleted val. handle = ' + e), V[e].value
}
function W(a) {
  if (((a = eval(y(a))), null == a)) return 0
  a += ''
  var b = va(a)
  return (
    (!W.bufferSize || W.bufferSize < b + 1) &&
      (W.bufferSize && U(W.buffer),
      (W.bufferSize = b + 1),
      (W.buffer = Ga(W.bufferSize))),
    ua(a, A, W.buffer, W.bufferSize),
    W.buffer
  )
}
var Gd = {},
  Id,
  Kd
function Hd() {
  if (!Id) {
    var e,
      n = {
        USER: 'web_user',
        LOGNAME: 'web_user',
        PATH: '/',
        PWD: '/',
        HOME: '/home/web_user',
        LANG:
          (
            ('object' == typeof navigator &&
              navigator.languages &&
              navigator.languages[0]) ||
            'C'
          ).replace('-', '_') + '.UTF-8',
        _: da || './this.program',
      }
    for (e in Gd) n[e] = Gd[e]
    var t = []
    for (e in n) t.push(e + '=' + n[e])
    Id = t
  }
  return Id
}
function Jd() {
  function e(e) {
    return (e = e.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? e[1] : 'GMT'
  }
  if (!Kd) {
    ;(Kd = !0), (B[Ld() >> 2] = 60 * new Date().getTimezoneOffset())
    var n = new Date().getFullYear(),
      t = new Date(n, 0, 1)
    ;(n = new Date(n, 6, 1)),
      (B[Md() >> 2] = Number(t.getTimezoneOffset() != n.getTimezoneOffset()))
    var r = e(t),
      i = e(n)
    ;(r = Fa(r)),
      (i = Fa(i)),
      n.getTimezoneOffset() < t.getTimezoneOffset()
        ? ((B[Nd() >> 2] = r), (B[(Nd() + 4) >> 2] = i))
        : ((B[Nd() >> 2] = i), (B[(Nd() + 4) >> 2] = r))
  }
}
function Od(e) {
  return 0 == e % 4 && (0 != e % 100 || 0 == e % 400)
}
function Pd(e, n) {
  for (var t = 0, r = 0; r <= n; t += e[r++]);
  return t
}
var Qd = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  Rd = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  yc
function Sd(e, n) {
  for (e = new Date(e.getTime()); 0 < n; ) {
    var t = e.getMonth(),
      r = (Od(e.getFullYear()) ? Qd : Rd)[t]
    if (!(n > r - e.getDate())) {
      e.setDate(e.getDate() + n)
      break
    }
    ;(n -= r - e.getDate() + 1),
      e.setDate(1),
      11 > t
        ? e.setMonth(t + 1)
        : (e.setMonth(0), e.setFullYear(e.getFullYear() + 1))
  }
  return e
}
function Td(e, n, t, r) {
  function i(e, n, t) {
    for (e = 'number' == typeof e ? e.toString() : e || ''; e.length < n; )
      e = t[0] + e
    return e
  }
  function a(e, n) {
    return i(e, n, '0')
  }
  function c(e, n) {
    function t(e) {
      return 0 > e ? -1 : 0 < e ? 1 : 0
    }
    var r
    return (
      0 === (r = t(e.getFullYear() - n.getFullYear())) &&
        0 === (r = t(e.getMonth() - n.getMonth())) &&
        (r = t(e.getDate() - n.getDate())),
      r
    )
  }
  function o(e) {
    switch (e.getDay()) {
      case 0:
        return new Date(e.getFullYear() - 1, 11, 29)
      case 1:
        return e
      case 2:
        return new Date(e.getFullYear(), 0, 3)
      case 3:
        return new Date(e.getFullYear(), 0, 2)
      case 4:
        return new Date(e.getFullYear(), 0, 1)
      case 5:
        return new Date(e.getFullYear() - 1, 11, 31)
      case 6:
        return new Date(e.getFullYear() - 1, 11, 30)
    }
  }
  function f(e) {
    e = Sd(new Date(e.tc + 1900, 0, 1), e.hd)
    var n = new Date(e.getFullYear() + 1, 0, 4),
      t = o(new Date(e.getFullYear(), 0, 4))
    return (
      (n = o(n)),
      0 >= c(t, e)
        ? 0 >= c(n, e)
          ? e.getFullYear() + 1
          : e.getFullYear()
        : e.getFullYear() - 1
    )
  }
  var u = B[(r + 40) >> 2]
  for (var l in ((r = {
    ze: B[r >> 2],
    ye: B[(r + 4) >> 2],
    fd: B[(r + 8) >> 2],
    Tc: B[(r + 12) >> 2],
    Oc: B[(r + 16) >> 2],
    tc: B[(r + 20) >> 2],
    gd: B[(r + 24) >> 2],
    hd: B[(r + 28) >> 2],
    gf: B[(r + 32) >> 2],
    xe: B[(r + 36) >> 2],
    Ae: u ? y(u) : '',
  }),
  (t = y(t)),
  (u = {
    '%c': '%a %b %d %H:%M:%S %Y',
    '%D': '%m/%d/%y',
    '%F': '%Y-%m-%d',
    '%h': '%b',
    '%r': '%I:%M:%S %p',
    '%R': '%H:%M',
    '%T': '%H:%M:%S',
    '%x': '%m/%d/%y',
    '%X': '%H:%M:%S',
    '%Ec': '%c',
    '%EC': '%C',
    '%Ex': '%m/%d/%y',
    '%EX': '%H:%M:%S',
    '%Ey': '%y',
    '%EY': '%Y',
    '%Od': '%d',
    '%Oe': '%e',
    '%OH': '%H',
    '%OI': '%I',
    '%Om': '%m',
    '%OM': '%M',
    '%OS': '%S',
    '%Ou': '%u',
    '%OU': '%U',
    '%OV': '%V',
    '%Ow': '%w',
    '%OW': '%W',
    '%Oy': '%y',
  })))
    t = t.replace(new RegExp(l, 'g'), u[l])
  var d = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),
    s = 'January February March April May June July August September October November December'.split(
      ' '
    )
  for (l in (u = {
    '%a': function (e) {
      return d[e.gd].substring(0, 3)
    },
    '%A': function (e) {
      return d[e.gd]
    },
    '%b': function (e) {
      return s[e.Oc].substring(0, 3)
    },
    '%B': function (e) {
      return s[e.Oc]
    },
    '%C': function (e) {
      return a(((e.tc + 1900) / 100) | 0, 2)
    },
    '%d': function (e) {
      return a(e.Tc, 2)
    },
    '%e': function (e) {
      return i(e.Tc, 2, ' ')
    },
    '%g': function (e) {
      return f(e).toString().substring(2)
    },
    '%G': function (e) {
      return f(e)
    },
    '%H': function (e) {
      return a(e.fd, 2)
    },
    '%I': function (e) {
      return 0 == (e = e.fd) ? (e = 12) : 12 < e && (e -= 12), a(e, 2)
    },
    '%j': function (e) {
      return a(e.Tc + Pd(Od(e.tc + 1900) ? Qd : Rd, e.Oc - 1), 3)
    },
    '%m': function (e) {
      return a(e.Oc + 1, 2)
    },
    '%M': function (e) {
      return a(e.ye, 2)
    },
    '%n': function () {
      return '\n'
    },
    '%p': function (e) {
      return 0 <= e.fd && 12 > e.fd ? 'AM' : 'PM'
    },
    '%S': function (e) {
      return a(e.ze, 2)
    },
    '%t': function () {
      return '\t'
    },
    '%u': function (e) {
      return e.gd || 7
    },
    '%U': function (e) {
      var n = new Date(e.tc + 1900, 0, 1),
        t = 0 === n.getDay() ? n : Sd(n, 7 - n.getDay())
      return 0 > c(t, (e = new Date(e.tc + 1900, e.Oc, e.Tc)))
        ? a(
            Math.ceil(
              (31 -
                t.getDate() +
                (Pd(Od(e.getFullYear()) ? Qd : Rd, e.getMonth() - 1) - 31) +
                e.getDate()) /
                7
            ),
            2
          )
        : 0 === c(t, n)
        ? '01'
        : '00'
    },
    '%V': function (e) {
      var n = new Date(e.tc + 1901, 0, 4),
        t = o(new Date(e.tc + 1900, 0, 4))
      n = o(n)
      var r = Sd(new Date(e.tc + 1900, 0, 1), e.hd)
      return 0 > c(r, t)
        ? '53'
        : 0 >= c(n, r)
        ? '01'
        : a(
            Math.ceil(
              (t.getFullYear() < e.tc + 1900
                ? e.hd + 32 - t.getDate()
                : e.hd + 1 - t.getDate()) / 7
            ),
            2
          )
    },
    '%w': function (e) {
      return e.gd
    },
    '%W': function (e) {
      var n = new Date(e.tc, 0, 1),
        t =
          1 === n.getDay()
            ? n
            : Sd(n, 0 === n.getDay() ? 1 : 7 - n.getDay() + 1)
      return 0 > c(t, (e = new Date(e.tc + 1900, e.Oc, e.Tc)))
        ? a(
            Math.ceil(
              (31 -
                t.getDate() +
                (Pd(Od(e.getFullYear()) ? Qd : Rd, e.getMonth() - 1) - 31) +
                e.getDate()) /
                7
            ),
            2
          )
        : 0 === c(t, n)
        ? '01'
        : '00'
    },
    '%y': function (e) {
      return (e.tc + 1900).toString().substring(2)
    },
    '%Y': function (e) {
      return e.tc + 1900
    },
    '%z': function (e) {
      var n = 0 <= (e = e.xe)
      return (
        (e = Math.abs(e) / 60),
        (n ? '+' : '-') + String('0000' + ((e / 60) * 100 + (e % 60))).slice(-4)
      )
    },
    '%Z': function (e) {
      return e.Ae
    },
    '%%': function () {
      return '%'
    },
  }))
    0 <= t.indexOf(l) && (t = t.replace(new RegExp(l, 'g'), u[l](r)))
  return (l = Cb(t, !1)).length > n ? 0 : (C.set(l, e), l.length - 1)
}
function Ub(e, n, t, r) {
  e || (e = this),
    (this.parent = e),
    (this.Cc = e.Cc),
    (this.Lc = null),
    (this.id = Mb++),
    (this.name = n),
    (this.mode = t),
    (this.kc = {}),
    (this.lc = {}),
    (this.bd = r)
}
Object.defineProperties(Ub.prototype, {
  read: {
    get: function () {
      return 365 == (365 & this.mode)
    },
    set: function (e) {
      e ? (this.mode |= 365) : (this.mode &= -366)
    },
  },
  write: {
    get: function () {
      return 146 == (146 & this.mode)
    },
    set: function (e) {
      e ? (this.mode |= 146) : (this.mode &= -147)
    },
  },
  le: {
    get: function () {
      return K(this.mode)
    },
  },
  ke: {
    get: function () {
      return 8192 == (61440 & this.mode)
    },
  },
}),
  nc(),
  (Nb = Array(4096)),
  bc(I, '/'),
  N('/tmp'),
  N('/home'),
  N('/home/web_user'),
  (function () {
    if (
      (N('/dev'),
      Ab(259, {
        read: function () {
          return 0
        },
        write: function (e, n, t, r) {
          return r
        },
      }),
      dc('/dev/null', 259),
      zb(1280, Db),
      zb(1536, Eb),
      dc('/dev/tty', 1280),
      dc('/dev/tty1', 1536),
      'object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
    )
      var e = new Uint8Array(1),
        n = function () {
          return crypto.getRandomValues(e), e[0]
        }
    n ||
      (n = function () {
        x('random_device')
      }),
      O('/dev', 'random', n),
      O('/dev', 'urandom', n),
      N('/dev/shm'),
      N('/dev/shm/tmp')
  })(),
  N('/proc'),
  N('/proc/self'),
  N('/proc/self/fd'),
  bc(
    {
      Cc: function () {
        var e = Gb('/proc/self', 'fd', 16895, 73)
        return (
          (e.kc = {
            Qc: function (e, n) {
              var t = Lb[+n]
              if (!t) throw new H(8)
              return ((e = {
                parent: null,
                Cc: { Id: 'fake' },
                kc: {
                  Sc: function () {
                    return t.path
                  },
                },
              }).parent = e)
            },
          }),
          e
        )
      },
    },
    '/proc/self/fd'
  ),
  (f.FS_createFolder = qc),
  (f.FS_createPath = rc),
  (f.FS_createDataFile = tc),
  (f.FS_createPreloadedFile = xc),
  (f.FS_createLazyFile = wc),
  (f.FS_createLink = uc),
  (f.FS_createDevice = O),
  (f.FS_unlink = fc),
  (Mc = f.InternalError = Lc('InternalError'))
for (var Ud = Array(256), Vd = 0; 256 > Vd; ++Vd)
  Ud[Vd] = String.fromCharCode(Vd)
function Cb(e, n) {
  var t = Array(va(e) + 1)
  return (e = ua(e, t, 0, t.length)), n && (t.length = e), t
}
;(Qc = Ud),
  (Rc = f.BindingError = Lc('BindingError')),
  (ad.prototype.isAliasOf = function (e) {
    if (!(this instanceof ad && e instanceof ad)) return !1
    var n = this.ic.pc.mc,
      t = this.ic.nc,
      r = e.ic.pc.mc
    for (e = e.ic.nc; n.zc; ) (t = n.Uc(t)), (n = n.zc)
    for (; r.zc; ) (e = r.Uc(e)), (r = r.zc)
    return n === r && t === e
  }),
  (ad.prototype.clone = function () {
    if ((this.ic.nc || Tc(this), this.ic.Rc))
      return (this.ic.count.value += 1), this
    var e = Xc(
      Object.create(Object.getPrototypeOf(this), { ic: { value: Sc(this.ic) } })
    )
    return (e.ic.count.value += 1), (e.ic.Kc = !1), e
  }),
  (ad.prototype.delete = function () {
    this.ic.nc || Tc(this),
      this.ic.Kc && !this.ic.Rc && S('Object already scheduled for deletion'),
      Vc(this),
      Wc(this.ic),
      this.ic.Rc || ((this.ic.wc = void 0), (this.ic.nc = void 0))
  }),
  (ad.prototype.isDeleted = function () {
    return !this.ic.nc
  }),
  (ad.prototype.deleteLater = function () {
    return (
      this.ic.nc || Tc(this),
      this.ic.Kc && !this.ic.Rc && S('Object already scheduled for deletion'),
      Zc.push(this),
      1 === Zc.length && Yc && Yc($c),
      (this.ic.Kc = !0),
      this
    )
  }),
  (pd.prototype.fe = function (e) {
    return this.Kd && (e = this.Kd(e)), e
  }),
  (pd.prototype.Pc = function (e) {
    this.Dc && this.Dc(e)
  }),
  (pd.prototype.argPackAdvance = 8),
  (pd.prototype.readValueFromPointer = Fc),
  (pd.prototype.deleteObject = function (e) {
    null !== e && e.delete()
  }),
  (pd.prototype.fromWireType = function (e) {
    function n() {
      return this.Zc
        ? od(this.mc.Fc, { pc: this.ne, nc: t, yc: this, wc: e })
        : od(this.mc.Fc, { pc: this, nc: e })
    }
    var t = this.fe(e)
    if (!t) return this.Pc(e), null
    var r = nd(this.mc, t)
    if (void 0 !== r)
      return 0 === r.ic.count.value
        ? ((r.ic.nc = t), (r.ic.wc = e), r.clone())
        : ((r = r.clone()), this.Pc(e), r)
    if (((r = this.mc.ee(t)), !(r = bd[r]))) return n.call(this)
    r = this.Yc ? r.ae : r.pointerType
    var i = ld(t, this.mc, r.mc)
    return null === i
      ? n.call(this)
      : this.Zc
      ? od(r.mc.Fc, { pc: r, nc: i, yc: this, wc: e })
      : od(r.mc.Fc, { pc: r, nc: i })
  }),
  (f.getInheritedInstanceCount = function () {
    return Object.keys(md).length
  }),
  (f.getLiveInheritedInstances = function () {
    var e,
      n = []
    for (e in md) md.hasOwnProperty(e) && n.push(md[e])
    return n
  }),
  (f.flushPendingDeletes = $c),
  (f.setDelayFunction = function (e) {
    ;(Yc = e), Zc.length && Yc && Yc($c)
  }),
  (rd = f.UnboundTypeError = Lc('UnboundTypeError')),
  (f.count_emval_handles = function () {
    for (var e = 0, n = 5; n < V.length; ++n) void 0 !== V[n] && ++e
    return e
  }),
  (f.get_first_emval = function () {
    for (var e = 5; e < V.length; ++e) if (void 0 !== V[e]) return V[e]
    return null
  })
var ye = {
  Ta: function (e, n) {
    return ob(e, n)
  },
  b: function (e) {
    return Ga(e)
  },
  q: function (e) {
    var n = G[e]
    return (
      n && !n.zd && ((n.zd = !0), rb.jd--),
      n && (n.cd = !1),
      pb.push(e),
      (n = qb(e)) && G[n].Ic++,
      e
    )
  },
  t: function () {
    X(0)
    var e = pb.pop()
    if (e) {
      if ((e = qb(e))) {
        var n = G[e]
        n.Ic--,
          0 !== n.Ic ||
            n.cd ||
            (n.Pc && f.dynCall_ii(n.Pc, e), delete G[e], U(e))
      }
      sb = 0
    }
  },
  d: function () {
    var e = sb
    if (!e) return (u = 0)
    var n = G[e],
      t = n.type
    if (!t) return (u = 0), 0 | e
    var r = Array.prototype.slice.call(arguments)
    ___cxa_is_pointer_type(t), (B[108400] = e), (e = 433600)
    for (var i = 0; i < r.length; i++)
      if (r[i] && ___cxa_can_catch(r[i], t, e))
        return (e = B[e >> 2]), n.ld.push(e), (u = r[i]), 0 | e
    return (e = B[e >> 2]), (u = t), 0 | e
  },
  i: function () {
    var e = sb
    if (!e) return (u = 0)
    var n = G[e],
      t = n.type
    if (!t) return (u = 0), 0 | e
    var r = Array.prototype.slice.call(arguments)
    ___cxa_is_pointer_type(t), (B[108400] = e), (e = 433600)
    for (var i = 0; i < r.length; i++)
      if (r[i] && ___cxa_can_catch(r[i], t, e))
        return (e = B[e >> 2]), n.ld.push(e), (u = r[i]), 0 | e
    return (e = B[e >> 2]), (u = t), 0 | e
  },
  G: function (e) {
    return U(e)
  },
  da: function () {
    var e = pb.pop()
    throw ((e = qb(e)), G[e].cd || (pb.push(e), (G[e].cd = !0)), (sb = e), e)
  },
  c: function (e, n, t) {
    throw (
      ((G[e] = { nc: e, ld: [e], type: n, Pc: t, Ic: 0, zd: !1, cd: !1 }),
      (sb = e),
      'uncaught_exception' in rb ? rb.jd++ : (rb.jd = 1),
      e)
    )
  },
  Sa: function () {
    return rb.jd
  },
  Ra: function () {
    return mb(63), -1
  },
  f: function (e) {
    throw (sb || (sb = e), e)
  },
  ca: function (e, n, t) {
    Ac = t
    try {
      var r = Cc(e)
      switch (n) {
        case 0:
          var i = Bc()
          return 0 > i ? -28 : hc(r.path, r.flags, 0, i).Bc
        case 1:
        case 2:
        case 13:
        case 14:
          return 0
        case 3:
          return r.flags
        case 4:
          return (i = Bc()), (r.flags |= i), 0
        case 12:
          return (i = Bc()), (za[(i + 0) >> 1] = 2), 0
        case 16:
        case 8:
        default:
          return -28
        case 9:
          return mb(28), -1
      }
    } catch (e) {
      return (void 0 !== P && e instanceof H) || x(e), -e.uc
    }
  },
  Pa: function () {
    return 42
  },
  Ma: function (e, n, t) {
    Ac = t
    try {
      var r = Cc(e)
      switch (n) {
        case 21509:
        case 21505:
        case 21510:
        case 21511:
        case 21512:
        case 21506:
        case 21507:
        case 21508:
        case 21523:
        case 21524:
          return r.qc ? 0 : -59
        case 21519:
          if (!r.qc) return -59
          var i = Bc()
          return (B[i >> 2] = 0)
        case 21520:
          return r.qc ? -28 : -59
        case 21531:
          if (((e = i = Bc()), !r.lc.je)) throw new H(59)
          return r.lc.je(r, n, e)
        default:
          x('bad ioctl syscall ' + n)
      }
    } catch (e) {
      return (void 0 !== P && e instanceof H) || x(e), -e.uc
    }
  },
  La: function (e, n) {
    try {
      if (-1 == (0 | e) || 0 === n) var t = -28
      else {
        var r = zc[e]
        if (r && n === r.$e) {
          var i = Lb[r.Bc]
          2 & r.ff &&
            i &&
            i.lc.ad &&
            i.lc.ad(i, A.slice(e, e + n), r.offset, n, r.flags),
            (zc[e] = null),
            r.Yd && U(r.af)
        }
        t = 0
      }
      return t
    } catch (e) {
      return (void 0 !== P && e instanceof H) || x(e), -e.uc
    }
  },
  ba: function (e, n, t) {
    Ac = t
    try {
      return hc(y(e), n, Bc()).Bc
    } catch (e) {
      return (void 0 !== P && e instanceof H) || x(e), -e.uc
    }
  },
  Oa: function (e, n, t) {
    try {
      return lc(Cc(e), n, t)
    } catch (e) {
      return (void 0 !== P && e instanceof H) || x(e), -e.uc
    }
  },
  Na: function (e) {
    try {
      var n = M((e = y(e)), { parent: !0 }).node,
        r = wb(e),
        i = Ib(n, r),
        a = Yb(n, r, !0)
      if (a) throw new H(a)
      if (!n.kc.dd) throw new H(63)
      if (i.Lc) throw new H(10)
      try {
        L.willDeletePath && L.willDeletePath(e)
      } catch (n) {
        t(
          "FS.trackingDelegate['willDeletePath']('" +
            e +
            "') threw an exception: " +
            n.message
        )
      }
      n.kc.dd(n, r), Sb(i)
      try {
        L.onDeletePath && L.onDeletePath(e)
      } catch (n) {
        t(
          "FS.trackingDelegate['onDeletePath']('" +
            e +
            "') threw an exception: " +
            n.message
        )
      }
      return 0
    } catch (e) {
      return (void 0 !== P && e instanceof H) || x(e), -e.uc
    }
  },
  Qa: function (e) {
    try {
      return fc((e = y(e))), 0
    } catch (e) {
      return (void 0 !== P && e instanceof H) || x(e), -e.uc
    }
  },
  O: function (e) {
    var n = Dc[e]
    delete Dc[e]
    var t = n.ud,
      r = n.Dc,
      i = n.Dd
    Oc(
      [e],
      i
        .map(function (e) {
          return e.he
        })
        .concat(
          i.map(function (e) {
            return e.ue
          })
        ),
      function (e) {
        var a = {}
        return (
          i.forEach(function (n, t) {
            var r = e[t],
              c = n.Xc,
              o = n.ge,
              f = e[t + i.length],
              u = n.te,
              l = n.ve
            a[n.ce] = {
              read: function (e) {
                return r.fromWireType(c(o, e))
              },
              write: function (e, n) {
                var t = []
                u(l, e, f.toWireType(t, n)), Ec(t)
              },
            }
          }),
          [
            {
              name: n.name,
              fromWireType: function (e) {
                var n,
                  t = {}
                for (n in a) t[n] = a[n].read(e)
                return r(e), t
              },
              toWireType: function (e, n) {
                for (var i in a)
                  if (!(i in n))
                    throw new TypeError('Missing field:  "' + i + '"')
                var c = t()
                for (i in a) a[i].write(c, n[i])
                return null !== e && e.push(r, c), c
              },
              argPackAdvance: 8,
              readValueFromPointer: Fc,
              xc: r,
            },
          ]
        )
      }
    )
  },
  Ha: function (e, n, t, r, i) {
    var a = Pc(t)
    Q(e, {
      name: (n = R(n)),
      fromWireType: function (e) {
        return !!e
      },
      toWireType: function (e, n) {
        return n ? r : i
      },
      argPackAdvance: 8,
      readValueFromPointer: function (e) {
        if (1 === t) var r = C
        else if (2 === t) r = za
        else {
          if (4 !== t) throw new TypeError('Unknown boolean type size: ' + n)
          r = B
        }
        return this.fromWireType(r[e >> a])
      },
      xc: null,
    })
  },
  z: function (e, n, t, r, i, a, c, o, f, u, l, d, s) {
    ;(l = R(l)),
      (a = T(i, a)),
      o && (o = T(c, o)),
      u && (u = T(f, u)),
      (s = T(d, s))
    var p = Jc(l)
    dd(p, function () {
      ud('Cannot construct ' + l + ' due to unbound types', [r])
    }),
      Oc([e, n, t], r ? [r] : [], function (n) {
        if (((n = n[0]), r))
          var t = n.mc,
            i = t.Fc
        else i = ad.prototype
        n = Kc(p, function () {
          if (Object.getPrototypeOf(this) !== c)
            throw new Rc("Use 'new' to construct " + l)
          if (void 0 === f.Gc)
            throw new Rc(l + ' has no accessible constructor')
          var e = f.Gc[arguments.length]
          if (void 0 === e)
            throw new Rc(
              'Tried to invoke ctor of ' +
                l +
                ' with invalid number of parameters (' +
                arguments.length +
                ') - expected (' +
                Object.keys(f.Gc).toString() +
                ') parameters instead!'
            )
          return e.apply(this, arguments)
        })
        var c = Object.create(i, { constructor: { value: n } })
        n.prototype = c
        var f = new ed(l, n, c, s, t, a, o, u)
        ;(t = new pd(l, f, !0, !1)), (i = new pd(l + '*', f, !1, !1))
        var d = new pd(l + ' const*', f, !1, !0)
        return (bd[e] = { pointerType: i, ae: d }), qd(p, n), [t, i, d]
      })
  },
  J: function (e, n, t, r, i, a) {
    qa(0 < n)
    var c = vd(n, t)
    i = T(r, i)
    var o = [a],
      f = []
    Oc([], [e], function (e) {
      var t = 'constructor ' + (e = e[0]).name
      if ((void 0 === e.mc.Gc && (e.mc.Gc = []), void 0 !== e.mc.Gc[n - 1]))
        throw new Rc(
          'Cannot register multiple constructors with identical number of parameters (' +
            (n - 1) +
            ") for class '" +
            e.name +
            "'! Overload resolution is currently only performed using the parameter count, not actual type info!"
        )
      return (
        (e.mc.Gc[n - 1] = function () {
          ud('Cannot construct ' + e.name + ' due to unbound types', c)
        }),
        Oc([], c, function (r) {
          return (
            (e.mc.Gc[n - 1] = function () {
              arguments.length !== n - 1 &&
                S(
                  t +
                    ' called with ' +
                    arguments.length +
                    ' arguments, expected ' +
                    (n - 1)
                ),
                (f.length = 0),
                (o.length = n)
              for (var e = 1; e < n; ++e)
                o[e] = r[e].toWireType(f, arguments[e - 1])
              return (e = i.apply(null, o)), Ec(f), r[0].fromWireType(e)
            }),
            []
          )
        }),
        []
      )
    })
  },
  o: function (e, n, t, r, i, a, c, o) {
    var f = vd(t, r)
    ;(n = R(n)),
      (a = T(i, a)),
      Oc([], [e], function (e) {
        function r() {
          ud('Cannot call ' + i + ' due to unbound types', f)
        }
        var i = (e = e[0]).name + '.' + n
        o && e.mc.oe.push(n)
        var u = e.mc.Fc,
          l = u[n]
        return (
          void 0 === l ||
          (void 0 === l.sc && l.className !== e.name && l.Vc === t - 2)
            ? ((r.Vc = t - 2), (r.className = e.name), (u[n] = r))
            : (cd(u, n, i), (u[n].sc[t - 2] = r)),
          Oc([], f, function (r) {
            return (
              (r = xd(i, r, e, a, c)),
              void 0 === u[n].sc
                ? ((r.Vc = t - 2), (u[n] = r))
                : (u[n].sc[t - 2] = r),
              []
            )
          }),
          []
        )
      })
  },
  m: function (e, n, t, r, i, a, c, o, f, u) {
    ;(n = R(n)),
      (i = T(r, i)),
      Oc([], [e], function (e) {
        var r = (e = e[0]).name + '.' + n,
          l = {
            get: function () {
              ud('Cannot access ' + r + ' due to unbound types', [t, c])
            },
            enumerable: !0,
            configurable: !0,
          }
        return (
          (l.set = f
            ? function () {
                ud('Cannot access ' + r + ' due to unbound types', [t, c])
              }
            : function () {
                S(r + ' is a read-only property')
              }),
          Object.defineProperty(e.mc.Fc, n, l),
          Oc([], f ? [t, c] : [t], function (t) {
            var c = t[0],
              l = {
                get: function () {
                  var n = yd(this, e, r + ' getter')
                  return c.fromWireType(i(a, n))
                },
                enumerable: !0,
              }
            if (f) {
              f = T(o, f)
              var d = t[1]
              l.set = function (n) {
                var t = yd(this, e, r + ' setter'),
                  i = []
                f(u, t, d.toWireType(i, n)), Ec(i)
              }
            }
            return Object.defineProperty(e.mc.Fc, n, l), []
          }),
          []
        )
      })
  },
  Ga: function (e, n) {
    Q(e, {
      name: (n = R(n)),
      fromWireType: function (e) {
        var n = V[e].value
        return Ad(e), n
      },
      toWireType: function (e, n) {
        return jd(n)
      },
      argPackAdvance: 8,
      readValueFromPointer: Fc,
      xc: null,
    })
  },
  F: function (e, n, t, r) {
    function i() {}
    ;(t = Pc(t)),
      (n = R(n)),
      (i.values = {}),
      Q(e, {
        name: n,
        constructor: i,
        fromWireType: function (e) {
          return this.constructor.values[e]
        },
        toWireType: function (e, n) {
          return n.value
        },
        argPackAdvance: 8,
        readValueFromPointer: Bd(n, t, r),
        xc: null,
      }),
      dd(n, i)
  },
  E: function (e, n, t) {
    var r = Cd(e, 'enum')
    ;(n = R(n)),
      (e = r.constructor),
      (r = Object.create(r.constructor.prototype, {
        value: { value: t },
        constructor: { value: Kc(r.name + '_' + n, function () {}) },
      })),
      (e.values[t] = r),
      (e[n] = r)
  },
  aa: function (e, n, t) {
    ;(t = Pc(t)),
      Q(e, {
        name: (n = R(n)),
        fromWireType: function (e) {
          return e
        },
        toWireType: function (e, n) {
          if ('number' != typeof n && 'boolean' != typeof n)
            throw new TypeError(
              'Cannot convert "' + hd(n) + '" to ' + this.name
            )
          return n
        },
        argPackAdvance: 8,
        readValueFromPointer: Dd(n, t),
        xc: null,
      })
  },
  u: function (e, n, t, r, i, a) {
    var c = vd(n, t)
    ;(e = R(e)),
      (i = T(r, i)),
      dd(
        e,
        function () {
          ud('Cannot call ' + e + ' due to unbound types', c)
        },
        n - 1
      ),
      Oc([], c, function (t) {
        return (
          qd(e, xd(e, [t[0], null].concat(t.slice(1)), null, i, a), n - 1), []
        )
      })
  },
  y: function (e, n, t, r, i) {
    function a(e) {
      return e
    }
    ;(n = R(n)), -1 === i && (i = 4294967295)
    var c = Pc(t)
    if (0 === r) {
      var o = 32 - 8 * t
      a = function (e) {
        return (e << o) >>> o
      }
    }
    var f = -1 != n.indexOf('unsigned')
    Q(e, {
      name: n,
      fromWireType: a,
      toWireType: function (e, t) {
        if ('number' != typeof t && 'boolean' != typeof t)
          throw new TypeError('Cannot convert "' + hd(t) + '" to ' + this.name)
        if (t < r || t > i)
          throw new TypeError(
            'Passing a number "' +
              hd(t) +
              '" from JS side to C/C++ side to an argument of type "' +
              n +
              '", which is outside the valid range [' +
              r +
              ', ' +
              i +
              ']!'
          )
        return f ? t >>> 0 : 0 | t
      },
      argPackAdvance: 8,
      readValueFromPointer: Ed(n, c, 0 !== r),
      xc: null,
    })
  },
  x: function (e, n, t) {
    function r(e) {
      var n = E
      return new i(Ja, n[(e >>= 2) + 1], n[e])
    }
    var i = [
      Int8Array,
      Uint8Array,
      Int16Array,
      Uint16Array,
      Int32Array,
      Uint32Array,
      Float32Array,
      Float64Array,
    ][n]
    Q(
      e,
      {
        name: (t = R(t)),
        fromWireType: r,
        argPackAdvance: 8,
        readValueFromPointer: r,
      },
      { ie: !0 }
    )
  },
  $: function (e, n) {
    var t = 'std::string' === (n = R(n))
    Q(e, {
      name: n,
      fromWireType: function (e) {
        var n = E[e >> 2]
        if (t)
          for (var r = e + 4, i = 0; i <= n; ++i) {
            var a = e + 4 + i
            if (i == n || 0 == A[a]) {
              if (((r = y(r, a - r)), void 0 === c)) var c = r
              else (c += String.fromCharCode(0)), (c += r)
              r = a + 1
            }
          }
        else {
          for (c = Array(n), i = 0; i < n; ++i)
            c[i] = String.fromCharCode(A[e + 4 + i])
          c = c.join('')
        }
        return U(e), c
      },
      toWireType: function (e, n) {
        n instanceof ArrayBuffer && (n = new Uint8Array(n))
        var r = 'string' == typeof n
        r ||
          n instanceof Uint8Array ||
          n instanceof Uint8ClampedArray ||
          n instanceof Int8Array ||
          S('Cannot pass non-string to std::string')
        var i = (t && r
            ? function () {
                return va(n)
              }
            : function () {
                return n.length
              })(),
          a = Ga(4 + i + 1)
        if (((E[a >> 2] = i), t && r)) ua(n, A, a + 4, i + 1)
        else if (r)
          for (r = 0; r < i; ++r) {
            var c = n.charCodeAt(r)
            255 < c &&
              (U(a),
              S('String has UTF-16 code units that do not fit in 8 bits')),
              (A[a + 4 + r] = c)
          }
        else for (r = 0; r < i; ++r) A[a + 4 + r] = n[r]
        return null !== e && e.push(U, a), a
      },
      argPackAdvance: 8,
      readValueFromPointer: Fc,
      xc: function (e) {
        U(e)
      },
    })
  },
  S: function (e, n, t) {
    if (((t = R(t)), 2 === n))
      var r = xa,
        i = Aa,
        a = Ba,
        c = function () {
          return ya
        },
        o = 1
    else
      4 === n &&
        ((r = Ca),
        (i = Da),
        (a = Ea),
        (c = function () {
          return E
        }),
        (o = 2))
    Q(e, {
      name: t,
      fromWireType: function (e) {
        for (var t, i = E[e >> 2], a = c(), f = e + 4, u = 0; u <= i; ++u) {
          var l = e + 4 + u * n
          ;(u != i && 0 != a[l >> o]) ||
            ((f = r(f, l - f)),
            void 0 === t ? (t = f) : ((t += String.fromCharCode(0)), (t += f)),
            (f = l + n))
        }
        return U(e), t
      },
      toWireType: function (e, r) {
        'string' != typeof r &&
          S('Cannot pass non-string to C++ string type ' + t)
        var c = a(r),
          f = Ga(4 + c + n)
        return (
          (E[f >> 2] = c >> o),
          i(r, f + 4, c + n),
          null !== e && e.push(U, f),
          f
        )
      },
      argPackAdvance: 8,
      readValueFromPointer: Fc,
      xc: function (e) {
        U(e)
      },
    })
  },
  N: function (e, n, t, r, i, a) {
    Dc[e] = { name: R(n), ud: T(t, r), Dc: T(i, a), Dd: [] }
  },
  C: function (e, n, t, r, i, a, c, o, f, u) {
    Dc[e].Dd.push({
      ce: R(n),
      he: t,
      Xc: T(r, i),
      ge: a,
      ue: c,
      te: T(o, f),
      ve: u,
    })
  },
  Fa: function (e, n) {
    Q(e, {
      Ze: !0,
      name: (n = R(n)),
      argPackAdvance: 0,
      fromWireType: function () {},
      toWireType: function () {},
    })
  },
  Ea: Ad,
  Da: function (e) {
    4 < e && (V[e].Ic += 1)
  },
  Ca: function () {
    return jd([])
  },
  Ba: function (e, n, t) {
    ;(e = Fd(e)), (n = Fd(n)), (t = Fd(t)), (e[n] = t)
  },
  I: function (e, n) {
    return jd((e = (e = Cd(e, '_emval_take_value')).readValueFromPointer(n)))
  },
  R: function () {
    x()
  },
  Aa: ob,
  za: function (e, n) {
    return e - n
  },
  ya: lb,
  v: function (e, n) {
    throw (X(e, n || 1), 'longjmp')
  },
  xa: function (e, n, t) {
    A.copyWithin(e, n, n + t)
  },
  wa: function (e) {
    e >>>= 0
    var n = A.length
    if (2147483648 < e) return !1
    for (var t = 1; 4 >= t; t *= 2) {
      var r = n * (1 + 0.2 / t)
      ;(r = Math.min(r, e + 100663296)),
        0 < (r = Math.max(16777216, e, r)) % 65536 && (r += 65536 - (r % 65536))
      e: {
        try {
          na.grow((Math.min(2147483648, r) - Ja.byteLength + 65535) >>> 16),
            Ma(na.buffer)
          var i = 1
          break e
        } catch (e) {}
        i = void 0
      }
      if (i) return !0
    }
    return !1
  },
  va: W,
  Ka: function (e, n) {
    var t = 0
    return (
      Hd().forEach(function (r, i) {
        var a = n + t
        for (i = B[(e + 4 * i) >> 2] = a, a = 0; a < r.length; ++a)
          C[i++ >> 0] = r.charCodeAt(a)
        ;(C[i >> 0] = 0), (t += r.length + 1)
      }),
      0
    )
  },
  Ja: function (e, n) {
    var t = Hd()
    B[e >> 2] = t.length
    var r = 0
    return (
      t.forEach(function (e) {
        r += e.length + 1
      }),
      (B[n >> 2] = r),
      0
    )
  },
  ua: function (e) {
    Wd(e)
  },
  U: function (e) {
    try {
      return jc(Cc(e)), 0
    } catch (e) {
      return (void 0 !== P && e instanceof H) || x(e), e.uc
    }
  },
  Ia: function (e, n, t, r) {
    try {
      e: {
        for (var i = Cc(e), a = (e = 0); a < t; a++) {
          var c = B[(n + (8 * a + 4)) >> 2],
            o = lc(i, B[(n + 8 * a) >> 2], c, void 0)
          if (0 > o) {
            var f = -1
            break e
          }
          if (((e += o), o < c)) break
        }
        f = e
      }
      return (B[r >> 2] = f), 0
    } catch (e) {
      return (void 0 !== P && e instanceof H) || x(e), e.uc
    }
  },
  oa: function (e, n, t, r, i) {
    try {
      var a = Cc(e)
      return -9007199254740992 >= (e = 4294967296 * t + (n >>> 0)) ||
        9007199254740992 <= e
        ? -61
        : (kc(a, e, r),
          (jb = [
            a.position >>> 0,
            ((ib = a.position),
            1 <= +Va(ib)
              ? 0 < ib
                ? (0 | Ya(+Xa(ib / 4294967296), 4294967295)) >>> 0
                : ~~+Wa((ib - +(~~ib >>> 0)) / 4294967296) >>> 0
              : 0),
          ]),
          (B[i >> 2] = jb[0]),
          (B[(i + 4) >> 2] = jb[1]),
          a.pd && 0 === e && 0 === r && (a.pd = null),
          0)
    } catch (e) {
      return (void 0 !== P && e instanceof H) || x(e), e.uc
    }
  },
  T: function (e, n, t, r) {
    try {
      e: {
        for (var i = Cc(e), a = (e = 0); a < t; a++) {
          var c = mc(
            i,
            C,
            B[(n + 8 * a) >> 2],
            B[(n + (8 * a + 4)) >> 2],
            void 0
          )
          if (0 > c) {
            var o = -1
            break e
          }
          e += c
        }
        o = e
      }
      return (B[r >> 2] = o), 0
    } catch (e) {
      return (void 0 !== P && e instanceof H) || x(e), e.uc
    }
  },
  a: function () {
    return 0 | u
  },
  ta: function (e) {
    var n = Date.now()
    return (
      (B[e >> 2] = (n / 1e3) | 0), (B[(e + 4) >> 2] = ((n % 1e3) * 1e3) | 0), 0
    )
  },
  Q: Xd,
  _: Yd,
  p: Zd,
  e: $d,
  h: ae,
  r: be,
  l: ce,
  Z: de,
  H: ee,
  B: fe,
  Y: ge,
  M: he,
  na: ie,
  ma: je,
  la: ke,
  j: le,
  n: me,
  g: ne,
  sa: oe,
  ra: pe,
  s: qe,
  P: re,
  L: se,
  qa: te,
  w: ue,
  D: ve,
  K: we,
  ka: xe,
  pa: function () {
    var e = location.hostname,
      n = va(e) + 1,
      t = Ga(n)
    return ua(e, A, t, n + 1), t
  },
  memory: na,
  ja: function (e) {
    Jd()
    var n = new Date(
        B[(e + 20) >> 2] + 1900,
        B[(e + 16) >> 2],
        B[(e + 12) >> 2],
        B[(e + 8) >> 2],
        B[(e + 4) >> 2],
        B[e >> 2],
        0
      ),
      t = B[(e + 32) >> 2],
      r = n.getTimezoneOffset(),
      i = new Date(n.getFullYear(), 0, 1),
      a = new Date(n.getFullYear(), 6, 1).getTimezoneOffset(),
      c = i.getTimezoneOffset(),
      o = Math.min(c, a)
    return (
      0 > t
        ? (B[(e + 32) >> 2] = Number(a != c && o == r))
        : 0 < t != (o == r) &&
          ((a = Math.max(c, a)),
          n.setTime(n.getTime() + 6e4 * ((0 < t ? o : a) - r))),
      (B[(e + 24) >> 2] = n.getDay()),
      (B[(e + 28) >> 2] = ((n.getTime() - i.getTime()) / 864e5) | 0),
      (n.getTime() / 1e3) | 0
    )
  },
  X: function () {},
  ia: function () {},
  ha: function () {},
  W: function (e) {
    return 0 <= (e = +e) ? +Xa(e + 0.5) : +Wa(e - 0.5)
  },
  A: function (e) {
    return 0 <= (e = +e) ? +Xa(e + 0.5) : +Wa(e - 0.5)
  },
  k: function (e) {
    u = 0 | e
  },
  ga: function (e, n, t, r) {
    return Td(e, n, t, r)
  },
  fa: function (e, n, t) {
    for (var r = y(n), i = 0; 25 > i; ++i)
      r = r.replace(
        new RegExp('\\' + '\\!@#$^&*()+=-[]/{}|:<>?,.'[i], 'g'),
        '\\' + '\\!@#$^&*()+=-[]/{}|:<>?,.'[i]
      )
    for (var a in (n = {
      '%A': '%a',
      '%B': '%b',
      '%c': '%a %b %d %H:%M:%S %Y',
      '%D': '%m\\/%d\\/%y',
      '%e': '%d',
      '%F': '%Y-%m-%d',
      '%h': '%b',
      '%R': '%H\\:%M',
      '%r': '%I\\:%M\\:%S\\s%p',
      '%T': '%H\\:%M\\:%S',
      '%x': '%m\\/%d\\/(?:%y|%Y)',
      '%X': '%H\\:%M\\:%S',
    }))
      r = r.replace(a, n[a])
    i = {
      '%a':
        '(?:Sun(?:day)?)|(?:Mon(?:day)?)|(?:Tue(?:sday)?)|(?:Wed(?:nesday)?)|(?:Thu(?:rsday)?)|(?:Fri(?:day)?)|(?:Sat(?:urday)?)',
      '%b':
        '(?:Jan(?:uary)?)|(?:Feb(?:ruary)?)|(?:Mar(?:ch)?)|(?:Apr(?:il)?)|May|(?:Jun(?:e)?)|(?:Jul(?:y)?)|(?:Aug(?:ust)?)|(?:Sep(?:tember)?)|(?:Oct(?:ober)?)|(?:Nov(?:ember)?)|(?:Dec(?:ember)?)',
      '%C': '\\d\\d',
      '%d': '0[1-9]|[1-9](?!\\d)|1\\d|2\\d|30|31',
      '%H': '\\d(?!\\d)|[0,1]\\d|20|21|22|23',
      '%I': '\\d(?!\\d)|0\\d|10|11|12',
      '%j': '00[1-9]|0?[1-9](?!\\d)|0?[1-9]\\d(?!\\d)|[1,2]\\d\\d|3[0-6]\\d',
      '%m': '0[1-9]|[1-9](?!\\d)|10|11|12',
      '%M': '0\\d|\\d(?!\\d)|[1-5]\\d',
      '%n': '\\s',
      '%p': 'AM|am|PM|pm|A\\.M\\.|a\\.m\\.|P\\.M\\.|p\\.m\\.',
      '%S': '0\\d|\\d(?!\\d)|[1-5]\\d|60',
      '%U': '0\\d|\\d(?!\\d)|[1-4]\\d|50|51|52|53',
      '%W': '0\\d|\\d(?!\\d)|[1-4]\\d|50|51|52|53',
      '%w': '[0-6]',
      '%y': '\\d\\d',
      '%Y': '\\d\\d\\d\\d',
      '%%': '%',
      '%t': '\\s',
    }
    var c = {
      Ge: 0,
      Fe: 1,
      Je: 2,
      Ce: 3,
      Ke: 4,
      Ie: 5,
      He: 6,
      De: 7,
      Ne: 8,
      Me: 9,
      Le: 10,
      Ee: 11,
    }
    for (var o in ((a = { Rd: 0, Pd: 1, Td: 2, Ud: 3, Sd: 4, Od: 5, Qd: 6 }),
    (n = { Pd: 0, Td: 1, Ud: 2, Sd: 3, Od: 4, Qd: 5, Rd: 6 }),
    i))
      r = r.replace(o, '(' + o + i[o] + ')')
    var f = []
    for (i = r.indexOf('%'); 0 <= i; i = r.indexOf('%'))
      f.push(r[i + 1]), (r = r.replace(new RegExp('\\%' + r[i + 1], 'g'), ''))
    var u = new RegExp('^' + r, 'i').exec(y(e))
    if (u) {
      if (
        ((o = (function () {
          function e(e, n, t) {
            return 'number' != typeof e || isNaN(e)
              ? n
              : e >= n
              ? e <= t
                ? e
                : t
              : n
          }
          return {
            year: e(B[(t + 20) >> 2] + 1900, 1970, 9999),
            month: e(B[(t + 16) >> 2], 0, 11),
            day: e(B[(t + 12) >> 2], 1, 31),
            hour: e(B[(t + 8) >> 2], 0, 23),
            min: e(B[(t + 4) >> 2], 0, 59),
            Nd: e(B[t >> 2], 0, 59),
          }
        })()),
        (r = (i = function (e) {
          if (0 <= (e = f.indexOf(e))) return u[e + 1]
        })('S')) && (o.Nd = parseInt(r)),
        (r = i('M')) && (o.min = parseInt(r)),
        (r = i('H')))
      )
        o.hour = parseInt(r)
      else if ((r = i('I'))) {
        var l = parseInt(r)
        ;(r = i('p')) && (l += 'P' === r.toUpperCase()[0] ? 12 : 0),
          (o.hour = l)
      }
      if (
        ((r = i('Y'))
          ? (o.year = parseInt(r))
          : (r = i('y')) &&
            ((l = parseInt(r)),
            (l = (r = i('C'))
              ? l + 100 * parseInt(r)
              : l + (69 > l ? 2e3 : 1900)),
            (o.year = l)),
        (r = i('m'))
          ? (o.month = parseInt(r) - 1)
          : (r = i('b')) && (o.month = c[r.substring(0, 3).toUpperCase()] || 0),
        (r = i('d')))
      )
        o.day = parseInt(r)
      else if ((r = i('j')))
        for (a = parseInt(r), n = Od(o.year), c = 0; 12 > c; ++c)
          a <= (r = Pd(n ? Qd : Rd, c - 1)) + (n ? Qd : Rd)[c] &&
            (o.day = a - r)
      else
        (r = i('a')) &&
          ((c = r.substring(0, 3).toUpperCase()),
          (r = i('U'))
            ? ((a = a[c]),
              (n = parseInt(r)),
              (a =
                0 === (c = new Date(o.year, 0, 1)).getDay()
                  ? Sd(c, a + 7 * (n - 1))
                  : Sd(c, 7 - c.getDay() + a + 7 * (n - 1))),
              (o.day = a.getDate()),
              (o.month = a.getMonth()))
            : (r = i('W')) &&
              ((a = n[c]),
              (n = parseInt(r)),
              (a =
                1 === (c = new Date(o.year, 0, 1)).getDay()
                  ? Sd(c, a + 7 * (n - 1))
                  : Sd(c, 7 - c.getDay() + 1 + a + 7 * (n - 1))),
              (o.day = a.getDate()),
              (o.month = a.getMonth())))
      return (
        (o = new Date(o.year, o.month, o.day, o.hour, o.min, o.Nd, 0)),
        (B[t >> 2] = o.getSeconds()),
        (B[(t + 4) >> 2] = o.getMinutes()),
        (B[(t + 8) >> 2] = o.getHours()),
        (B[(t + 12) >> 2] = o.getDate()),
        (B[(t + 16) >> 2] = o.getMonth()),
        (B[(t + 20) >> 2] = o.getFullYear() - 1900),
        (B[(t + 24) >> 2] = o.getDay()),
        (B[(t + 28) >> 2] =
          Pd(Od(o.getFullYear()) ? Qd : Rd, o.getMonth() - 1) +
          o.getDate() -
          1),
        (B[(t + 32) >> 2] = 0),
        e + Cb(u[0]).length - 1
      )
    }
    return 0
  },
  V: function (e) {
    switch (e) {
      case 30:
      case 75:
        return 16384
      case 85:
        return 131072
      case 132:
      case 133:
      case 12:
      case 137:
      case 138:
      case 15:
      case 235:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 149:
      case 13:
      case 10:
      case 236:
      case 153:
      case 9:
      case 21:
      case 22:
      case 159:
      case 154:
      case 14:
      case 77:
      case 78:
      case 139:
      case 80:
      case 81:
      case 82:
      case 68:
      case 67:
      case 164:
      case 11:
      case 29:
      case 47:
      case 48:
      case 95:
      case 52:
      case 51:
      case 46:
      case 79:
        return 200809
      case 27:
      case 246:
      case 127:
      case 128:
      case 23:
      case 24:
      case 160:
      case 161:
      case 181:
      case 182:
      case 242:
      case 183:
      case 184:
      case 243:
      case 244:
      case 245:
      case 165:
      case 178:
      case 179:
      case 49:
      case 50:
      case 168:
      case 169:
      case 175:
      case 170:
      case 171:
      case 172:
      case 97:
      case 76:
      case 32:
      case 173:
      case 35:
        return -1
      case 176:
      case 177:
      case 7:
      case 155:
      case 8:
      case 157:
      case 125:
      case 126:
      case 92:
      case 93:
      case 129:
      case 130:
      case 131:
      case 94:
      case 91:
        return 1
      case 74:
      case 60:
      case 69:
      case 70:
      case 4:
        return 1024
      case 31:
      case 42:
      case 72:
        return 32
      case 87:
      case 26:
      case 33:
        return 2147483647
      case 34:
      case 1:
        return 47839
      case 38:
      case 36:
        return 99
      case 43:
      case 37:
        return 2048
      case 0:
        return 2097152
      case 3:
        return 65536
      case 28:
        return 32768
      case 44:
        return 32767
      case 39:
        return 1e3
      case 89:
        return 700
      case 71:
        return 256
      case 40:
        return 255
      case 2:
        return 100
      case 180:
        return 64
      case 25:
        return 20
      case 5:
        return 16
      case 6:
        return 6
      case 73:
        return 4
      case 84:
        return (
          ('object' == typeof navigator && navigator.hardwareConcurrency) || 1
        )
    }
    return mb(28), -1
  },
  table: oa,
  ea: function (e) {
    var n = (Date.now() / 1e3) | 0
    return e && (B[e >> 2] = n), n
  },
}
!(function () {
  function e(e) {
    ;(f.asm = e.exports), cb('wasm-instantiate')
  }
  function n(n) {
    e(n.instance)
  }
  function r(e) {
    return hb()
      .then(function (e) {
        return WebAssembly.instantiate(e, i)
      })
      .then(e, function (e) {
        t('failed to asynchronously prepare wasm: ' + e), x(e)
      })
  }
  var i = { a: ye }
  if ((bb('wasm-instantiate'), f.instantiateWasm))
    try {
      return f.instantiateWasm(i, e)
    } catch (e) {
      return t('Module.instantiateWasm callback failed with error: ' + e), !1
    }
  ;(function () {
    if (
      ma ||
      'function' != typeof WebAssembly.instantiateStreaming ||
      db() ||
      'function' != typeof fetch
    )
      return r(n)
    fetch(eb, { credentials: 'same-origin' }).then(function (e) {
      return WebAssembly.instantiateStreaming(e, i).then(n, function (e) {
        return (
          t('wasm streaming compile failed: ' + e),
          t('falling back to ArrayBuffer instantiation'),
          r(n)
        )
      })
    })
  })()
})()
var kb = (f.___wasm_call_ctors = function () {
    return (kb = f.___wasm_call_ctors = f.asm.Ua).apply(null, arguments)
  }),
  nb = (f.___errno_location = function () {
    return (nb = f.___errno_location = f.asm.Va).apply(null, arguments)
  }),
  U = (f._free = function () {
    return (U = f._free = f.asm.Wa).apply(null, arguments)
  }),
  Ga = (f._malloc = function () {
    return (Ga = f._malloc = f.asm.Xa).apply(null, arguments)
  })
f._main = function () {
  return (f._main = f.asm.Ya).apply(null, arguments)
}
var td = (f.___getTypeName = function () {
  return (td = f.___getTypeName = f.asm.Za).apply(null, arguments)
})
f.___embind_register_native_and_builtin_types = function () {
  return (f.___embind_register_native_and_builtin_types = f.asm._a).apply(
    null,
    arguments
  )
}
var Nd = (f.__get_tzname = function () {
    return (Nd = f.__get_tzname = f.asm.$a).apply(null, arguments)
  }),
  Md = (f.__get_daylight = function () {
    return (Md = f.__get_daylight = f.asm.ab).apply(null, arguments)
  }),
  Ld = (f.__get_timezone = function () {
    return (Ld = f.__get_timezone = f.asm.bb).apply(null, arguments)
  }),
  X = (f._setThrew = function () {
    return (X = f._setThrew = f.asm.cb).apply(null, arguments)
  }),
  Y = (f.stackSave = function () {
    return (Y = f.stackSave = f.asm.db).apply(null, arguments)
  }),
  Z = (f.stackRestore = function () {
    return (Z = f.stackRestore = f.asm.eb).apply(null, arguments)
  }),
  Ia = (f.stackAlloc = function () {
    return (Ia = f.stackAlloc = f.asm.fb).apply(null, arguments)
  }),
  ze = (f.dynCall_v = function () {
    return (ze = f.dynCall_v = f.asm.gb).apply(null, arguments)
  }),
  Ae = (f.dynCall_vi = function () {
    return (Ae = f.dynCall_vi = f.asm.hb).apply(null, arguments)
  }),
  Be = (f.dynCall_vii = function () {
    return (Be = f.dynCall_vii = f.asm.ib).apply(null, arguments)
  }),
  Ce = (f.dynCall_viii = function () {
    return (Ce = f.dynCall_viii = f.asm.jb).apply(null, arguments)
  }),
  De = (f.dynCall_viiii = function () {
    return (De = f.dynCall_viiii = f.asm.kb).apply(null, arguments)
  }),
  Ee = (f.dynCall_viiiii = function () {
    return (Ee = f.dynCall_viiiii = f.asm.lb).apply(null, arguments)
  }),
  Fe = (f.dynCall_viiiiii = function () {
    return (Fe = f.dynCall_viiiiii = f.asm.mb).apply(null, arguments)
  }),
  Ge = (f.dynCall_viiiiiii = function () {
    return (Ge = f.dynCall_viiiiiii = f.asm.nb).apply(null, arguments)
  }),
  He = (f.dynCall_viiiiiiiiii = function () {
    return (He = f.dynCall_viiiiiiiiii = f.asm.ob).apply(null, arguments)
  }),
  Ie = (f.dynCall_viiiiiiiiiiiiiii = function () {
    return (Ie = f.dynCall_viiiiiiiiiiiiiii = f.asm.pb).apply(null, arguments)
  }),
  Je = (f.dynCall_viijii = function () {
    return (Je = f.dynCall_viijii = f.asm.qb).apply(null, arguments)
  }),
  Ke = (f.dynCall_viif = function () {
    return (Ke = f.dynCall_viif = f.asm.rb).apply(null, arguments)
  }),
  Le = (f.dynCall_viid = function () {
    return (Le = f.dynCall_viid = f.asm.sb).apply(null, arguments)
  }),
  Me = (f.dynCall_i = function () {
    return (Me = f.dynCall_i = f.asm.tb).apply(null, arguments)
  }),
  Ne = (f.dynCall_ii = function () {
    return (Ne = f.dynCall_ii = f.asm.ub).apply(null, arguments)
  }),
  Oe = (f.dynCall_iii = function () {
    return (Oe = f.dynCall_iii = f.asm.vb).apply(null, arguments)
  }),
  Pe = (f.dynCall_iiii = function () {
    return (Pe = f.dynCall_iiii = f.asm.wb).apply(null, arguments)
  }),
  Qe = (f.dynCall_iiiii = function () {
    return (Qe = f.dynCall_iiiii = f.asm.xb).apply(null, arguments)
  }),
  Re = (f.dynCall_iiiiii = function () {
    return (Re = f.dynCall_iiiiii = f.asm.yb).apply(null, arguments)
  }),
  Se = (f.dynCall_iiiiiii = function () {
    return (Se = f.dynCall_iiiiiii = f.asm.zb).apply(null, arguments)
  }),
  Te = (f.dynCall_iiiiiiii = function () {
    return (Te = f.dynCall_iiiiiiii = f.asm.Ab).apply(null, arguments)
  })
f.dynCall_iiiiiiiiiii = function () {
  return (f.dynCall_iiiiiiiiiii = f.asm.Bb).apply(null, arguments)
}
var Ue = (f.dynCall_iiiiiiiiiiii = function () {
  return (Ue = f.dynCall_iiiiiiiiiiii = f.asm.Cb).apply(null, arguments)
})
f.dynCall_iiiiiiiiiiiii = function () {
  return (f.dynCall_iiiiiiiiiiiii = f.asm.Db).apply(null, arguments)
}
var Ve = (f.dynCall_iiiiij = function () {
    return (Ve = f.dynCall_iiiiij = f.asm.Eb).apply(null, arguments)
  }),
  We = (f.dynCall_iiiiid = function () {
    return (We = f.dynCall_iiiiid = f.asm.Fb).apply(null, arguments)
  }),
  Xe = (f.dynCall_jii = function () {
    return (Xe = f.dynCall_jii = f.asm.Gb).apply(null, arguments)
  }),
  Ye = (f.dynCall_jiiii = function () {
    return (Ye = f.dynCall_jiiii = f.asm.Hb).apply(null, arguments)
  }),
  Ze = (f.dynCall_fiii = function () {
    return (Ze = f.dynCall_fiii = f.asm.Ib).apply(null, arguments)
  }),
  $e = (f.dynCall_diii = function () {
    return ($e = f.dynCall_diii = f.asm.Jb).apply(null, arguments)
  }),
  af
function me(e, n) {
  var t = Y()
  try {
    Ae(e, n)
  } catch (e) {
    if ((Z(t), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function $d(e, n) {
  var t = Y()
  try {
    return Ne(e, n)
  } catch (e) {
    if ((Z(t), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function qe(e, n, t, r) {
  var i = Y()
  try {
    Ce(e, n, t, r)
  } catch (e) {
    if ((Z(i), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function ae(e, n, t) {
  var r = Y()
  try {
    return Oe(e, n, t)
  } catch (e) {
    if ((Z(r), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function ne(e, n, t) {
  var r = Y()
  try {
    Be(e, n, t)
  } catch (e) {
    if ((Z(r), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function ce(e, n, t, r, i) {
  var a = Y()
  try {
    return Qe(e, n, t, r, i)
  } catch (e) {
    if ((Z(a), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function be(e, n, t, r) {
  var i = Y()
  try {
    return Pe(e, n, t, r)
  } catch (e) {
    if ((Z(i), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function se(e, n, t, r, i, a) {
  var c = Y()
  try {
    Ee(e, n, t, r, i, a)
  } catch (e) {
    if ((Z(c), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function te(e, n, t, r, i, a, c) {
  var o = Y()
  try {
    Fe(e, n, t, r, i, a, c)
  } catch (e) {
    if ((Z(o), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function Zd(e) {
  var n = Y()
  try {
    return Me(e)
  } catch (e) {
    if ((Z(n), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function le(e) {
  var n = Y()
  try {
    ze(e)
  } catch (e) {
    if ((Z(n), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function ee(e, n, t, r, i, a) {
  var c = Y()
  try {
    return Re(e, n, t, r, i, a)
  } catch (e) {
    if ((Z(c), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function de(e, n, t, r, i, a) {
  var c = Y()
  try {
    return We(e, n, t, r, i, a)
  } catch (e) {
    if ((Z(c), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function ge(e, n, t, r, i, a, c, o) {
  var f = Y()
  try {
    return Te(e, n, t, r, i, a, c, o)
  } catch (e) {
    if ((Z(f), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function re(e, n, t, r, i) {
  var a = Y()
  try {
    De(e, n, t, r, i)
  } catch (e) {
    if ((Z(a), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function Yd(e, n, t, r) {
  var i = Y()
  try {
    return Ze(e, n, t, r)
  } catch (e) {
    if ((Z(i), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function Xd(e, n, t, r) {
  var i = Y()
  try {
    return $e(e, n, t, r)
  } catch (e) {
    if ((Z(i), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function ue(e, n, t, r, i, a, c, o) {
  var f = Y()
  try {
    Ge(e, n, t, r, i, a, c, o)
  } catch (e) {
    if ((Z(f), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function fe(e, n, t, r, i, a, c) {
  var o = Y()
  try {
    return Se(e, n, t, r, i, a, c)
  } catch (e) {
    if ((Z(o), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function he(e, n, t, r, i, a, c, o, f, u, l, d) {
  var s = Y()
  try {
    return Ue(e, n, t, r, i, a, c, o, f, u, l, d)
  } catch (e) {
    if ((Z(s), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function ve(e, n, t, r, i, a, c, o, f, u, l) {
  var d = Y()
  try {
    He(e, n, t, r, i, a, c, o, f, u, l)
  } catch (e) {
    if ((Z(d), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function we(e, n, t, r, i, a, c, o, f, u, l, d, s, p, h, y) {
  var m = Y()
  try {
    Ie(e, n, t, r, i, a, c, o, f, u, l, d, s, p, h, y)
  } catch (e) {
    if ((Z(m), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function pe(e, n, t, r) {
  var i = Y()
  try {
    Ke(e, n, t, r)
  } catch (e) {
    if ((Z(i), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function oe(e, n, t, r) {
  var i = Y()
  try {
    Le(e, n, t, r)
  } catch (e) {
    if ((Z(i), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function je(e, n, t) {
  var r = Y()
  try {
    return Xe(e, n, t)
  } catch (e) {
    if ((Z(r), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function xe(e, n, t, r, i, a, c) {
  var o = Y()
  try {
    Je(e, n, t, r, i, a, c)
  } catch (e) {
    if ((Z(o), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function ie(e, n, t, r, i, a, c) {
  var o = Y()
  try {
    return Ve(e, n, t, r, i, a, c)
  } catch (e) {
    if ((Z(o), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function ke(e, n, t, r, i) {
  var a = Y()
  try {
    return Ye(e, n, t, r, i)
  } catch (e) {
    if ((Z(a), e !== e + 0 && 'longjmp' !== e)) throw e
    X(1, 0)
  }
}
function bf(e) {
  ;(this.name = 'ExitStatus'),
    (this.message = 'Program terminated with exit(' + e + ')'),
    (this.status = e)
}
function df(e) {
  function n() {
    if (!af && ((af = !0), (f.calledRun = !0), !pa)) {
      if (
        ((Ta = !0),
        f.noFSInit ||
          oc ||
          ((oc = !0),
          nc(),
          (f.stdin = f.stdin),
          (f.stdout = f.stdout),
          (f.stderr = f.stderr),
          f.stdin ? O('/dev', 'stdin', f.stdin) : ec('/dev/tty', '/dev/stdin'),
          f.stdout
            ? O('/dev', 'stdout', null, f.stdout)
            : ec('/dev/tty', '/dev/stdout'),
          f.stderr
            ? O('/dev', 'stderr', null, f.stderr)
            : ec('/dev/tty1', '/dev/stderr'),
          hc('/dev/stdin', 'r'),
          hc('/dev/stdout', 'w'),
          hc('/dev/stderr', 'w')),
        Oa(Qa),
        (Ob = !1),
        Oa(Ra),
        f.onRuntimeInitialized && f.onRuntimeInitialized(),
        ef)
      ) {
        var n = e,
          r = f._main,
          i = (n = n || []).length + 1,
          a = Ia(4 * (i + 1))
        B[a >> 2] = Ha(da)
        for (var c = 1; c < i; c++) B[(a >> 2) + c] = Ha(n[c - 1])
        B[(a >> 2) + i] = 0
        try {
          Wd(r(i, a), !0)
        } catch (e) {
          e instanceof bf ||
            ('unwind' == e
              ? (noExitRuntime = !0)
              : ((n = e) &&
                  'object' == typeof e &&
                  e.stack &&
                  (n = [e, e.stack]),
                t('exception thrown: ' + n),
                ea(1, e)))
        }
      }
      if (f.postRun)
        for (
          'function' == typeof f.postRun && (f.postRun = [f.postRun]);
          f.postRun.length;

        )
          (n = f.postRun.shift()), Sa.unshift(n)
      Oa(Sa)
    }
  }
  if (((e = e || ca), !(0 < Za))) {
    if (f.preRun)
      for (
        'function' == typeof f.preRun && (f.preRun = [f.preRun]);
        f.preRun.length;

      )
        Ua()
    Oa(Pa),
      0 < Za ||
        (f.setStatus
          ? (f.setStatus('Running...'),
            setTimeout(function () {
              setTimeout(function () {
                f.setStatus('')
              }, 1),
                n()
            }, 1))
          : n())
  }
}
function Wd(e, n) {
  ;(n && noExitRuntime && 0 === e) ||
    (!noExitRuntime && ((pa = !0), f.onExit) && f.onExit(e), ea(e, new bf(e)))
}
if (
  ((f.dynCall_ji = function () {
    return (f.dynCall_ji = f.asm.Kb).apply(null, arguments)
  }),
  (f.dynCall_dii = function () {
    return (f.dynCall_dii = f.asm.Lb).apply(null, arguments)
  }),
  (f.dynCall_fii = function () {
    return (f.dynCall_fii = f.asm.Mb).apply(null, arguments)
  }),
  (f.dynCall_viiidiiii = function () {
    return (f.dynCall_viiidiiii = f.asm.Nb).apply(null, arguments)
  }),
  (f.dynCall_viiiidiiii = function () {
    return (f.dynCall_viiiidiiii = f.asm.Ob).apply(null, arguments)
  }),
  (f.dynCall_viiiiidiiiii = function () {
    return (f.dynCall_viiiiidiiiii = f.asm.Pb).apply(null, arguments)
  }),
  (f.dynCall_viiiiiiii = function () {
    return (f.dynCall_viiiiiiii = f.asm.Qb).apply(null, arguments)
  }),
  (f.dynCall_viiiiiiiii = function () {
    return (f.dynCall_viiiiiiiii = f.asm.Rb).apply(null, arguments)
  }),
  (f.dynCall_viiiiiiiiidd = function () {
    return (f.dynCall_viiiiiiiiidd = f.asm.Sb).apply(null, arguments)
  }),
  (f.dynCall_viiiiiiiddi = function () {
    return (f.dynCall_viiiiiiiddi = f.asm.Tb).apply(null, arguments)
  }),
  (f.dynCall_viiiiiiiiiiddi = function () {
    return (f.dynCall_viiiiiiiiiiddi = f.asm.Ub).apply(null, arguments)
  }),
  (f.dynCall_viiid = function () {
    return (f.dynCall_viiid = f.asm.Vb).apply(null, arguments)
  }),
  (f.dynCall_iiiiiiiii = function () {
    return (f.dynCall_iiiiiiiii = f.asm.Wb).apply(null, arguments)
  }),
  (f.dynCall_viiiid = function () {
    return (f.dynCall_viiiid = f.asm.Xb).apply(null, arguments)
  }),
  (f.dynCall_viidi = function () {
    return (f.dynCall_viidi = f.asm.Yb).apply(null, arguments)
  }),
  (f.dynCall_vidii = function () {
    return (f.dynCall_vidii = f.asm.Zb).apply(null, arguments)
  }),
  (f.dynCall_fiiii = function () {
    return (f.dynCall_fiiii = f.asm._b).apply(null, arguments)
  }),
  (f.dynCall_di = function () {
    return (f.dynCall_di = f.asm.$b).apply(null, arguments)
  }),
  (f.dynCall_vid = function () {
    return (f.dynCall_vid = f.asm.ac).apply(null, arguments)
  }),
  (f.dynCall_diiii = function () {
    return (f.dynCall_diiii = f.asm.bc).apply(null, arguments)
  }),
  (f.dynCall_jiji = function () {
    return (f.dynCall_jiji = f.asm.cc).apply(null, arguments)
  }),
  (f.dynCall_iidiiii = function () {
    return (f.dynCall_iidiiii = f.asm.dc).apply(null, arguments)
  }),
  (f.dynCall_iiiiijj = function () {
    return (f.dynCall_iiiiijj = f.asm.ec).apply(null, arguments)
  }),
  (f.dynCall_iiiiiijj = function () {
    return (f.dynCall_iiiiiijj = f.asm.fc).apply(null, arguments)
  }),
  (f.dynCall_iiiij = function () {
    return (f.dynCall_iiiij = f.asm.gc).apply(null, arguments)
  }),
  (f.dynCall_vij = function () {
    return (f.dynCall_vij = f.asm.hc).apply(null, arguments)
  }),
  (f.getMemory = function (e) {
    if (Ta) e = Ga(e)
    else {
      var n = B[108360]
      ;(B[108360] = (n + e + 15) & -16), (e = n)
    }
    return e
  }),
  (f.addRunDependency = bb),
  (f.removeRunDependency = cb),
  (f.FS_createFolder = qc),
  (f.FS_createPath = rc),
  (f.FS_createDataFile = tc),
  (f.FS_createPreloadedFile = xc),
  (f.FS_createLazyFile = wc),
  (f.FS_createLink = uc),
  (f.FS_createDevice = O),
  (f.FS_unlink = fc),
  (ab = function e() {
    af || df(), af || (ab = e)
  }),
  (f.run = df),
  f.preInit)
)
  for (
    'function' == typeof f.preInit && (f.preInit = [f.preInit]);
    0 < f.preInit.length;

  )
    f.preInit.pop()()
var ef = !0
f.noInitialRun && (ef = !1), (noExitRuntime = !0), df()
