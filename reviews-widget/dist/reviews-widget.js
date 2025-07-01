var qi = Object.defineProperty;
var Wi = (e, t, r) => t in e ? qi(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var A = (e, t, r) => Wi(e, typeof t != "symbol" ? t + "" : t, r);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yt = globalThis, $r = yt.ShadowRoot && (yt.ShadyCSS === void 0 || yt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, _r = Symbol(), Mr = /* @__PURE__ */ new WeakMap();
let _s = class {
  constructor(t, r, s) {
    if (this._$cssResult$ = !0, s !== _r) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = r;
  }
  get styleSheet() {
    let t = this.o;
    const r = this.t;
    if ($r && t === void 0) {
      const s = r !== void 0 && r.length === 1;
      s && (t = Mr.get(r)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Mr.set(r, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Zi = (e) => new _s(typeof e == "string" ? e : e + "", void 0, _r), Cs = (e, ...t) => {
  const r = e.length === 1 ? e[0] : t.reduce((s, i, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + e[n + 1], e[0]);
  return new _s(r, e, _r);
}, Gi = (e, t) => {
  if ($r) e.adoptedStyleSheets = t.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of t) {
    const s = document.createElement("style"), i = yt.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = r.cssText, e.appendChild(s);
  }
}, Or = $r ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let r = "";
  for (const s of t.cssRules) r += s.cssText;
  return Zi(r);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ki, defineProperty: Ji, getOwnPropertyDescriptor: Xi, getOwnPropertyNames: Qi, getOwnPropertySymbols: Yi, getPrototypeOf: en } = Object, ye = globalThis, Ur = ye.trustedTypes, tn = Ur ? Ur.emptyScript : "", Pt = ye.reactiveElementPolyfillSupport, tt = (e, t) => e, or = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? tn : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let r = e;
  switch (t) {
    case Boolean:
      r = e !== null;
      break;
    case Number:
      r = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        r = JSON.parse(e);
      } catch {
        r = null;
      }
  }
  return r;
} }, ks = (e, t) => !Ki(e, t), zr = { attribute: !0, type: String, converter: or, reflect: !1, useDefault: !1, hasChanged: ks };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), ye.litPropertyMetadata ?? (ye.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Be = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, r = zr) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(t, r), !r.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, r);
      i !== void 0 && Ji(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, r, s) {
    const { get: i, set: n } = Xi(this.prototype, t) ?? { get() {
      return this[r];
    }, set(o) {
      this[r] = o;
    } };
    return { get: i, set(o) {
      const a = i == null ? void 0 : i.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? zr;
  }
  static _$Ei() {
    if (this.hasOwnProperty(tt("elementProperties"))) return;
    const t = en(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(tt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(tt("properties"))) {
      const r = this.properties, s = [...Qi(r), ...Yi(r)];
      for (const i of s) this.createProperty(i, r[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const r = litPropertyMetadata.get(t);
      if (r !== void 0) for (const [s, i] of r) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [r, s] of this.elementProperties) {
      const i = this._$Eu(r, s);
      i !== void 0 && this._$Eh.set(i, r);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const r = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) r.unshift(Or(i));
    } else t !== void 0 && r.push(Or(t));
    return r;
  }
  static _$Eu(t, r) {
    const s = r.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((r) => this.enableUpdating = r), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((r) => r(this));
  }
  addController(t) {
    var r;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((r = t.hostConnected) == null || r.call(t));
  }
  removeController(t) {
    var r;
    (r = this._$EO) == null || r.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), r = this.constructor.elementProperties;
    for (const s of r.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Gi(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((r) => {
      var s;
      return (s = r.hostConnected) == null ? void 0 : s.call(r);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((r) => {
      var s;
      return (s = r.hostDisconnected) == null ? void 0 : s.call(r);
    });
  }
  attributeChangedCallback(t, r, s) {
    this._$AK(t, s);
  }
  _$ET(t, r) {
    var n;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : or).toAttribute(r, s.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, r) {
    var n, o;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const a = s.getPropertyOptions(i), c = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((n = a.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? a.converter : or;
      this._$Em = i, this[i] = c.fromAttribute(r, a.type) ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(t, r, s) {
    var i;
    if (t !== void 0) {
      const n = this.constructor, o = this[t];
      if (s ?? (s = n.getPropertyOptions(t)), !((s.hasChanged ?? ks)(o, r) || s.useDefault && s.reflect && o === ((i = this._$Ej) == null ? void 0 : i.get(t)) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, r, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, r, { useDefault: s, reflect: i, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? r ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (r = void 0), this._$AL.set(t, r)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (r) {
      Promise.reject(r);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, o] of i) {
        const { wrapped: a } = o, c = this[n];
        a !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, o, c);
      }
    }
    let t = !1;
    const r = this._$AL;
    try {
      t = this.shouldUpdate(r), t ? (this.willUpdate(r), (s = this._$EO) == null || s.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(r)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(r);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var r;
    (r = this._$EO) == null || r.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((r) => this._$ET(r, this[r]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
Be.elementStyles = [], Be.shadowRootOptions = { mode: "open" }, Be[tt("elementProperties")] = /* @__PURE__ */ new Map(), Be[tt("finalized")] = /* @__PURE__ */ new Map(), Pt == null || Pt({ ReactiveElement: Be }), (ye.reactiveElementVersions ?? (ye.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt = globalThis, kt = rt.trustedTypes, Dr = kt ? kt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, As = "$lit$", be = `lit$${Math.random().toFixed(9).slice(2)}$`, Ss = "?" + be, rn = `<${Ss}>`, Me = document, it = () => Me.createComment(""), nt = (e) => e === null || typeof e != "object" && typeof e != "function", Cr = Array.isArray, sn = (e) => Cr(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", It = `[ 	
\f\r]`, Ze = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Hr = /-->/g, Br = />/g, ve = RegExp(`>|${It}(?:([^\\s"'>=/]+)(${It}*=${It}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Fr = /'/g, jr = /"/g, Es = /^(?:script|style|textarea|title)$/i, nn = (e) => (t, ...r) => ({ _$litType$: e, strings: t, values: r }), $ = nn(1), Oe = Symbol.for("lit-noChange"), V = Symbol.for("lit-nothing"), Nr = /* @__PURE__ */ new WeakMap(), Ae = Me.createTreeWalker(Me, 129);
function Rs(e, t) {
  if (!Cr(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Dr !== void 0 ? Dr.createHTML(t) : t;
}
const on = (e, t) => {
  const r = e.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Ze;
  for (let a = 0; a < r; a++) {
    const c = e[a];
    let d, u, h = -1, g = 0;
    for (; g < c.length && (o.lastIndex = g, u = o.exec(c), u !== null); ) g = o.lastIndex, o === Ze ? u[1] === "!--" ? o = Hr : u[1] !== void 0 ? o = Br : u[2] !== void 0 ? (Es.test(u[2]) && (i = RegExp("</" + u[2], "g")), o = ve) : u[3] !== void 0 && (o = ve) : o === ve ? u[0] === ">" ? (o = i ?? Ze, h = -1) : u[1] === void 0 ? h = -2 : (h = o.lastIndex - u[2].length, d = u[1], o = u[3] === void 0 ? ve : u[3] === '"' ? jr : Fr) : o === jr || o === Fr ? o = ve : o === Hr || o === Br ? o = Ze : (o = ve, i = void 0);
    const v = o === ve && e[a + 1].startsWith("/>") ? " " : "";
    n += o === Ze ? c + rn : h >= 0 ? (s.push(d), c.slice(0, h) + As + c.slice(h) + be + v) : c + be + (h === -2 ? a : v);
  }
  return [Rs(e, n + (e[r] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class ot {
  constructor({ strings: t, _$litType$: r }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const a = t.length - 1, c = this.parts, [d, u] = on(t, r);
    if (this.el = ot.createElement(d, s), Ae.currentNode = this.el.content, r === 2 || r === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = Ae.nextNode()) !== null && c.length < a; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(As)) {
          const g = u[o++], v = i.getAttribute(h).split(be), m = /([.?@])?(.*)/.exec(g);
          c.push({ type: 1, index: n, name: m[2], strings: v, ctor: m[1] === "." ? ln : m[1] === "?" ? cn : m[1] === "@" ? dn : Mt }), i.removeAttribute(h);
        } else h.startsWith(be) && (c.push({ type: 6, index: n }), i.removeAttribute(h));
        if (Es.test(i.tagName)) {
          const h = i.textContent.split(be), g = h.length - 1;
          if (g > 0) {
            i.textContent = kt ? kt.emptyScript : "";
            for (let v = 0; v < g; v++) i.append(h[v], it()), Ae.nextNode(), c.push({ type: 2, index: ++n });
            i.append(h[g], it());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Ss) c.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(be, h + 1)) !== -1; ) c.push({ type: 7, index: n }), h += be.length - 1;
      }
      n++;
    }
  }
  static createElement(t, r) {
    const s = Me.createElement("template");
    return s.innerHTML = t, s;
  }
}
function Ne(e, t, r = e, s) {
  var o, a;
  if (t === Oe) return t;
  let i = s !== void 0 ? (o = r._$Co) == null ? void 0 : o[s] : r._$Cl;
  const n = nt(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((a = i == null ? void 0 : i._$AO) == null || a.call(i, !1), n === void 0 ? i = void 0 : (i = new n(e), i._$AT(e, r, s)), s !== void 0 ? (r._$Co ?? (r._$Co = []))[s] = i : r._$Cl = i), i !== void 0 && (t = Ne(e, i._$AS(e, t.values), i, s)), t;
}
let an = class {
  constructor(t, r) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = r;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: r }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? Me).importNode(r, !0);
    Ae.currentNode = i;
    let n = Ae.nextNode(), o = 0, a = 0, c = s[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let d;
        c.type === 2 ? d = new Ie(n, n.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(n, c.name, c.strings, this, t) : c.type === 6 && (d = new un(n, this, t)), this._$AV.push(d), c = s[++a];
      }
      o !== (c == null ? void 0 : c.index) && (n = Ae.nextNode(), o++);
    }
    return Ae.currentNode = Me, i;
  }
  p(t) {
    let r = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, r), r += s.strings.length - 2) : s._$AI(t[r])), r++;
  }
};
class Ie {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, r, s, i) {
    this.type = 2, this._$AH = V, this._$AN = void 0, this._$AA = t, this._$AB = r, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const r = this._$AM;
    return r !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = r.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, r = this) {
    t = Ne(this, t, r), nt(t) ? t === V || t == null || t === "" ? (this._$AH !== V && this._$AR(), this._$AH = V) : t !== this._$AH && t !== Oe && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : sn(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== V && nt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Me.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: r, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = ot.createElement(Rs(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(r);
    else {
      const o = new an(i, this), a = o.u(this.options);
      o.p(r), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let r = Nr.get(t.strings);
    return r === void 0 && Nr.set(t.strings, r = new ot(t)), r;
  }
  k(t) {
    Cr(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let s, i = 0;
    for (const n of t) i === r.length ? r.push(s = new Ie(this.O(it()), this.O(it()), this, this.options)) : s = r[i], s._$AI(n), i++;
    i < r.length && (this._$AR(s && s._$AB.nextSibling, i), r.length = i);
  }
  _$AR(t = this._$AA.nextSibling, r) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, r); t && t !== this._$AB; ) {
      const i = t.nextSibling;
      t.remove(), t = i;
    }
  }
  setConnected(t) {
    var r;
    this._$AM === void 0 && (this._$Cv = t, (r = this._$AP) == null || r.call(this, t));
  }
}
class Mt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, r, s, i, n) {
    this.type = 1, this._$AH = V, this._$AN = void 0, this.element = t, this.name = r, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = V;
  }
  _$AI(t, r = this, s, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = Ne(this, t, r, 0), o = !nt(t) || t !== this._$AH && t !== Oe, o && (this._$AH = t);
    else {
      const a = t;
      let c, d;
      for (t = n[0], c = 0; c < n.length - 1; c++) d = Ne(this, a[s + c], r, c), d === Oe && (d = this._$AH[c]), o || (o = !nt(d) || d !== this._$AH[c]), d === V ? t = V : t !== V && (t += (d ?? "") + n[c + 1]), this._$AH[c] = d;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === V ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ln extends Mt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === V ? void 0 : t;
  }
}
class cn extends Mt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== V);
  }
}
class dn extends Mt {
  constructor(t, r, s, i, n) {
    super(t, r, s, i, n), this.type = 5;
  }
  _$AI(t, r = this) {
    if ((t = Ne(this, t, r, 0) ?? V) === Oe) return;
    const s = this._$AH, i = t === V && s !== V || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== V && (s === V || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var r;
    typeof this._$AH == "function" ? this._$AH.call(((r = this.options) == null ? void 0 : r.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class un {
  constructor(t, r, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Ne(this, t);
  }
}
const hn = { I: Ie }, Vt = rt.litHtmlPolyfillSupport;
Vt == null || Vt(ot, Ie), (rt.litHtmlVersions ?? (rt.litHtmlVersions = [])).push("3.3.0");
const fn = (e, t, r) => {
  const s = (r == null ? void 0 : r.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (r == null ? void 0 : r.renderBefore) ?? null;
    s._$litPart$ = i = new Ie(t.insertBefore(it(), n), n, void 0, r ?? {});
  }
  return i._$AI(e), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Re = globalThis;
let Fe = class extends Be {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var r;
    const t = super.createRenderRoot();
    return (r = this.renderOptions).renderBefore ?? (r.renderBefore = t.firstChild), t;
  }
  update(t) {
    const r = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = fn(r, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return Oe;
  }
};
var $s;
Fe._$litElement$ = !0, Fe.finalized = !0, ($s = Re.litElementHydrateSupport) == null || $s.call(Re, { LitElement: Fe });
const qt = Re.litElementPolyfillSupport;
qt == null || qt({ LitElement: Fe });
(Re.litElementVersions ?? (Re.litElementVersions = [])).push("4.2.0");
const Ts = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\r
    <symbol id="ri-user-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" />\r
    </symbol>\r
\r
    <symbol id="ri-emotion-normal-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path fill="currentColor" d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM8 14H16V16H8V14ZM8 11C7.17157 11 6.5 10.3284 6.5 9.5C6.5 8.67157 7.17157 8 8 8C8.82843 8 9.5 8.67157 9.5 9.5C9.5 10.3284 8.82843 11 8 11ZM16 11C15.1716 11 14.5 10.3284 14.5 9.5C14.5 8.67157 15.1716 8 16 8C16.8284 8 17.5 8.67157 17.5 9.5C17.5 10.3284 16.8284 11 16 11Z" />\r
    </symbol>\r
\r
    <symbol id="ri-logout-box-r-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M5 22C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V6H18V4H6V20H18V18H20V21C20 21.5523 19.5523 22 19 22H5ZM18 16V13H11V11H18V8L23 12L18 16Z" />\r
    </symbol>\r
\r
    <symbol id="ri-search-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" />\r
    </symbol>\r
\r
    <symbol id="ri-arrow-down-s-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />\r
    </symbol>\r
\r
    <symbol id="ri-star-fill" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />\r
    </symbol>\r
\r
    <symbol id="ri-thumb-up-fill" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M2 8.99997H5V21H2C1.44772 21 1 20.5523 1 20V9.99997C1 9.44769 1.44772 8.99997 2 8.99997ZM7.29289 7.70708L13.6934 1.30661C13.8693 1.13066 14.1479 1.11087 14.3469 1.26016L15.1995 1.8996C15.6842 2.26312 15.9026 2.88253 15.7531 3.46966L14.5998 7.99997H21C22.1046 7.99997 23 8.8954 23 9.99997V12.1043C23 12.3656 22.9488 12.6243 22.8494 12.8658L19.755 20.3807C19.6007 20.7554 19.2355 21 18.8303 21H8C7.44772 21 7 20.5523 7 20V8.41419C7 8.14897 7.10536 7.89462 7.29289 7.70708Z" />\r
    </symbol>\r
\r
    <symbol id="ri-thumb-up-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M14.5998 8.00033H21C22.1046 8.00033 23 8.89576 23 10.0003V12.1047C23 12.3659 22.9488 12.6246 22.8494 12.8662L19.755 20.3811C19.6007 20.7558 19.2355 21.0003 18.8303 21.0003H2C1.44772 21.0003 1 20.5526 1 20.0003V10.0003C1 9.44804 1.44772 9.00033 2 9.00033H5.48184C5.80677 9.00033 6.11143 8.84246 6.29881 8.57701L11.7522 0.851355C11.8947 0.649486 12.1633 0.581978 12.3843 0.692483L14.1984 1.59951C15.25 2.12534 15.7931 3.31292 15.5031 4.45235L14.5998 8.00033ZM7 10.5878V19.0003H18.1606L21 12.1047V10.0003H14.5998C13.2951 10.0003 12.3398 8.77128 12.6616 7.50691L13.5649 3.95894C13.6229 3.73105 13.5143 3.49353 13.3039 3.38837L12.6428 3.0578L7.93275 9.73038C7.68285 10.0844 7.36341 10.3746 7 10.5878ZM5 11.0003H3V19.0003H5V11.0003Z" />\r
    </symbol>\r
\r
    <symbol id="ri-thumb-down-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M9.40017 16H3C1.89543 16 1 15.1046 1 14V11.8957C1 11.6344 1.05118 11.3757 1.15064 11.1342L4.24501 3.61925C4.3993 3.24455 4.76447 3 5.16969 3H22C22.5523 3 23 3.44772 23 4V14C23 14.5523 22.5523 15 22 15H18.5182C18.1932 15 17.8886 15.1579 17.7012 15.4233L12.2478 23.149C12.1053 23.3508 11.8367 23.4184 11.6157 23.3078L9.80163 22.4008C8.74998 21.875 8.20687 20.6874 8.49694 19.548L9.40017 16ZM17 13.4125V5H5.83939L3 11.8957V14H9.40017C10.7049 14 11.6602 15.229 11.3384 16.4934L10.4351 20.0414C10.3771 20.2693 10.4857 20.5068 10.6961 20.612L11.3572 20.9425L16.0673 14.27C16.3172 13.9159 16.6366 13.6257 17 13.4125ZM19 13H21V5H19V13Z" />\r
    </symbol>\r
\r
    <symbol id="ri-chat-1-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3ZM12 17H14C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17Z" />\r
    </symbol>\r
\r
    <symbol id="ri-flag-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M12.382 3C12.7607 3 13.107 3.214 13.2764 3.55279L14 5H20C20.5523 5 21 5.44772 21 6V17C21 17.5523 20.5523 18 20 18H13.618C13.2393 18 12.893 17.786 12.7236 17.4472L12 16H5V22H3V3H12.382ZM11.7639 5H5V14H13.2361L14.2361 16H19V7H12.7639L11.7639 5Z" />\r
    </symbol>\r
\r
    <symbol id="ri-close-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z" />\r
    </symbol>\r
\r
    <symbol id="ri-upload-2-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19ZM13 9V16H11V9H6L12 3L18 9H13Z" />\r
    </symbol>\r
\r
    <symbol id="ri-arrow-left-s-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />\r
    </symbol>\r
\r
    <symbol id="ri-arrow-right-s-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />\r
    </symbol>\r
\r
    <symbol id="ri-drizzle-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M17 18V16H17.5C19.433 16 21 14.433 21 12.5C21 10.567 19.433 9 17.5 9C16.5205 9 15.6351 9.40232 14.9998 10.0507C14.9999 10.0338 15 10.0169 15 10C15 6.68629 12.3137 4 9 4C5.68629 4 3 6.68629 3 10C3 12.6124 4.66962 14.8349 7 15.6586V17.748C3.54955 16.8599 1 13.7277 1 10C1 5.58172 4.58172 2 9 2C12.3949 2 15.2959 4.11466 16.4576 7.09864C16.7951 7.0339 17.1436 7 17.5 7C20.5376 7 23 9.46243 23 12.5C23 15.5376 20.5376 18 17.5 18H17ZM9 16H11V20H9V16ZM13 19H15V23H13V19Z" />\r
    </symbol>\r
\r
    <symbol id="ri-gift-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M15.0049 2.00281C17.214 2.00281 19.0049 3.79367 19.0049 6.00281C19.0049 6.73184 18.8098 7.41532 18.4691 8.00392L23.0049 8.00281V10.0028H21.0049V20.0028C21.0049 20.5551 20.5572 21.0028 20.0049 21.0028H4.00488C3.4526 21.0028 3.00488 20.5551 3.00488 20.0028V10.0028H1.00488V8.00281L5.54065 8.00392C5.19992 7.41532 5.00488 6.73184 5.00488 6.00281C5.00488 3.79367 6.79574 2.00281 9.00488 2.00281C10.2001 2.00281 11.2729 2.52702 12.0058 3.35807C12.7369 2.52702 13.8097 2.00281 15.0049 2.00281ZM11.0049 10.0028H5.00488V19.0028H11.0049V10.0028ZM19.0049 10.0028H13.0049V19.0028H19.0049V10.0028ZM9.00488 4.00281C7.90031 4.00281 7.00488 4.89824 7.00488 6.00281C7.00488 7.05717 7.82076 7.92097 8.85562 7.99732L9.00488 8.00281H11.0049V6.00281C11.0049 5.00116 10.2686 4.1715 9.30766 4.02558L9.15415 4.00829L9.00488 4.00281ZM15.0049 4.00281C13.9505 4.00281 13.0867 4.81869 13.0104 5.85355L13.0049 6.00281V8.00281H15.0049C16.0592 8.00281 16.923 7.18693 16.9994 6.15207L17.0049 6.00281C17.0049 4.89824 16.1095 4.00281 15.0049 4.00281Z" />\r
    </symbol>\r
\r
    <symbol id="ri-heart-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z" />\r
    </symbol>\r
\r
    <symbol id="ri-sun-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z" />\r
    </symbol>\r
\r
    <symbol id="ri-medal-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M12 6.99999C16.4183 6.99999 20 10.5817 20 15C20 19.4183 16.4183 23 12 23C7.58172 23 4 19.4183 4 15C4 10.5817 7.58172 6.99999 12 6.99999ZM12 8.99999C8.68629 8.99999 6 11.6863 6 15C6 18.3137 8.68629 21 12 21C15.3137 21 18 18.3137 18 15C18 11.6863 15.3137 8.99999 12 8.99999ZM12 10.5L13.3225 13.1797L16.2798 13.6094L14.1399 15.6953L14.645 18.6406L12 17.25L9.35497 18.6406L9.86012 15.6953L7.72025 13.6094L10.6775 13.1797L12 10.5ZM18 1.99999V4.99999L16.6366 6.13755C15.5305 5.5577 14.3025 5.17884 13.0011 5.04948L13 1.99899L18 1.99999ZM11 1.99899L10.9997 5.04939C9.6984 5.17863 8.47046 5.55735 7.36441 6.13703L6 4.99999V1.99999L11 1.99899Z" />\r
    </symbol>\r
\r
    <symbol id="ri-lightbulb-line" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z" />\r
        <path d="M9.97308 18H11V13H13V18H14.0269C14.1589 16.7984 14.7721 15.8065 15.7676 14.7226C15.8797 14.6006 16.5988 13.8564 16.6841 13.7501C17.5318 12.6931 18 11.385 18 10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10C6 11.3843 6.46774 12.6917 7.31462 13.7484C7.40004 13.855 8.12081 14.6012 8.23154 14.7218C9.22766 15.8064 9.84103 16.7984 9.97308 18ZM10 20V21H14V20H10ZM5.75395 14.9992C4.65645 13.6297 4 11.8915 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 11.8925 19.3428 13.6315 18.2443 15.0014C17.624 15.7748 16 17 16 18.5V21C16 22.1046 15.1046 23 14 23H10C8.89543 23 8 22.1046 8 21V18.5C8 17 6.37458 15.7736 5.75395 14.9992Z" />\r
    </symbol>\r
\r
    <!-- Boxicons -->\r
    <symbol id="bxs-star" viewBox="0 0 24 24">\r
        <path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z" />\r
    </symbol>\r
\r
    <symbol id="bxs-star-half" viewBox="0 0 24 24">\r
        <path d="M5.025 20.775A.998.998 0 0 0 6 22a1 1 0 0 0 .555-.168L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082a1 1 0 0 0-.59-1.74l-5.701-.454-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.214 4.107-1.491 6.452zM12 5.429l2.042 4.521.588.047h.001l3.972.315-3.271 2.944-.001.002-.463.416.171.597v.003l1.253 4.385L12 15.798V5.429z" />\r
    </symbol>\r
\r
    <symbol id="bx-happy" viewBox="0 0 24 24">\r
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />\r
        <circle cx="8.5" cy="10.5" r="1.5" />\r
        <circle cx="15.493" cy="10.493" r="1.493" />\r
        <path d="M12 18c4 0 5-4 5-4H7s1 4 5 4z" />\r
    </symbol>\r
\r
    <symbol id="bx-meh" viewBox="0 0 24 24">\r
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />\r
        <circle cx="8.5" cy="10.5" r="1.5" />\r
        <circle cx="15.493" cy="10.493" r="1.493" />\r
        <path d="M7.974 15H16v2H7.974z" />\r
    </symbol>\r
\r
    <symbol id="bx-sad" viewBox="0 0 24 24">\r
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />\r
        <circle cx="8.5" cy="10.5" r="1.5" />\r
        <circle cx="15.493" cy="10.493" r="1.493" />\r
        <path d="M12 14c-3 0-4 3-4 3h8s-1-3-4-3z" />\r
    </symbol>\r
\r
    <symbol id="bx-shocked" viewBox="0 0 24 24">\r
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />\r
        <circle cx="8.5" cy="10.5" r="1.5" />\r
        <circle cx="15.493" cy="10.493" r="1.493" />\r
        <ellipse cx="12" cy="15.5" rx="3" ry="2.5" />\r
    </symbol>\r
\r
    <symbol id="bx-happy-alt" viewBox="0 0 24 24">\r
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />\r
        <circle cx="8.5" cy="9.5" r="1.5" />\r
        <circle cx="15.493" cy="9.493" r="1.493" />\r
        <path d="M12 18c5 0 6-5 6-5H6s1 5 6 5z" />\r
    </symbol>\r
\r
    <symbol id="bx-angry" viewBox="0 0 24 24">\r
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />\r
        <path d="M12 14c-3 0-4 3-4 3h8s-1-3-4-3zm-2.439-2.439c.014-.014.023-.03.037-.044l1.031.413.742-1.857-5-2-.742 1.856 1.373.549L7 10.5a1.499 1.499 0 0 0 2.561 1.061zm3.068-1.49.742 1.857 1.037-.415c.011.011.019.024.029.035a1.488 1.488 0 0 0 2.112 0c.271-.271.438-.644.438-1.056l-.001-.01 1.386-.554-.742-1.857-5.001 2z" />\r
    </symbol>\r
\r
    <symbol id="bx-confused" viewBox="0 0 24 24">\r
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />\r
        <circle cx="8.5" cy="10.5" r="1.5" />\r
        <circle cx="15.493" cy="10.493" r="1.493" />\r
        <path d="m8.124 16.992-.248-1.984 8-1 .248 1.984z" />\r
    </symbol>\r
\r
    <symbol id="bx-like" viewBox="0 0 24 24">\r
        <path d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2zM4 10h2v9H4v-9zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7v1.819z" />\r
    </symbol>\r
\r
    <symbol id="bx-donate-heart" viewBox="0 0 24 24">\r
        <path d="M4 21h9.62a3.995 3.995 0 0 0 3.037-1.397l5.102-5.952a1 1 0 0 0-.442-1.6l-1.968-.656a3.043 3.043 0 0 0-2.823.503l-3.185 2.547-.617-1.235A3.98 3.98 0 0 0 9.146 11H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2zm0-8h5.146c.763 0 1.448.423 1.789 1.105l.447.895H7v2h6.014a.996.996 0 0 0 .442-.11l.003-.001.004-.002h.003l.002-.001h.004l.001-.001c.009.003.003-.001.003-.001.01 0 .002-.001.002-.001h.001l.002-.001.003-.001.002-.001.002-.001.003-.001.002-.001c.003 0 .001-.001.002-.001l.003-.002.002-.001.002-.001.003-.001.002-.001h.001l.002-.001h.001l.002-.001.002-.001c.009-.001.003-.001.003-.001l.002-.001a.915.915 0 0 0 .11-.078l4.146-3.317c.262-.208.623-.273.94-.167l.557.186-4.133 4.823a2.029 2.029 0 0 1-1.52.688H4v-6zM16 2h-.017c-.163.002-1.006.039-1.983.705-.951-.648-1.774-.7-1.968-.704L12.002 2h-.004c-.801 0-1.555.313-2.119.878C9.313 3.445 9 4.198 9 5s.313 1.555.861 2.104l3.414 3.586a1.006 1.006 0 0 0 1.45-.001l3.396-3.568C18.688 6.555 19 5.802 19 5s-.313-1.555-.878-2.121A2.978 2.978 0 0 0 16.002 2H16zm1 3c0 .267-.104.518-.311.725L14 8.55l-2.707-2.843C11.104 5.518 11 5.267 11 5s.104-.518.294-.708A.977.977 0 0 1 11.979 4c.025.001.502.032 1.067.485.081.065.163.139.247.222l.707.707.707-.707c.084-.083.166-.157.247-.222.529-.425.976-.478 1.052-.484a.987.987 0 0 1 .701.292c.189.189.293.44.293.707z" />\r
    </symbol>\r
\r
    <symbol id="bx-help-circle" viewBox="0 0 24 24">\r
        <path d="M12 6a3.939 3.939 0 0 0-3.934 3.934h2C10.066 8.867 10.934 8 12 8s1.934.867 1.934 1.934c0 .598-.481 1.032-1.216 1.626a9.208 9.208 0 0 0-.691.599c-.998.997-1.027 2.056-1.027 2.174V15h2l-.001-.633c.001-.016.033-.386.441-.793.15-.15.339-.3.535-.458.779-.631 1.958-1.584 1.958-3.182A3.937 3.937 0 0 0 12 6zm-1 10h2v2h-2z" />\r
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />\r
    </symbol>\r
\r
    <symbol id="bx-search-alt" viewBox="0 0 24 24">\r
        <path fill="currentColor" d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" />\r
        <path fill="currentColor" d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z" />\r
    </symbol>\r
\r
    <symbol id="bxs-hot" viewBox="0 0 24 24">\r
        <path d="M16.5 8c0 1.5-.5 3.5-2.9 4.3.7-1.7.8-3.4.3-5-.7-2.1-3-3.7-4.6-4.6-.4-.3-1.1.1-1 .7 0 1.1-.3 2.7-2 4.4C4.1 10 3 12.3 3 14.5 3 17.4 5 21 9 21c-4-4-1-7.5-1-7.5.8 5.9 5 7.5 7 7.5 1.7 0 5-1.2 5-6.4 0-3.1-1.3-5.5-2.4-6.9-.3-.5-1-.2-1.1.3" />\r
    </symbol>\r
\r
    <symbol id="bx-dislike" viewBox="0 0 24 24">\r
        <path d="M20 3H6.693A2.01 2.01 0 0 0 4.82 4.298l-2.757 7.351A1 1 0 0 0 2 12v2c0 1.103.897 2 2 2h5.612L8.49 19.367a2.004 2.004 0 0 0 .274 1.802c.376.52.982.831 1.624.831H12c.297 0 .578-.132.769-.36l4.7-5.64H20c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm-8.469 17h-1.145l1.562-4.684A1 1 0 0 0 11 14H4v-1.819L6.693 5H16v9.638L11.531 20zM18 14V5h2l.001 9H18z" />\r
    </symbol>\r
\r
    <symbol id="bx-bug" viewBox="0 0 24 24">\r
        <path d="m16.895 6.519 2.813-2.812-1.414-1.414-2.846 2.846a6.575 6.575 0 0 0-.723-.454 5.778 5.778 0 0 0-5.45 0c-.25.132-.488.287-.722.453L5.707 2.293 4.293 3.707l2.813 2.812A8.473 8.473 0 0 0 5.756 9H2v2h2.307c-.065.495-.107.997-.107 1.5 0 .507.042 1.013.107 1.511H2v2h2.753c.013.039.021.08.034.118.188.555.421 1.093.695 1.6.044.081.095.155.141.234l-2.33 2.33 1.414 1.414 2.11-2.111a7.477 7.477 0 0 0 2.068 1.619c.479.253.982.449 1.496.58a6.515 6.515 0 0 0 3.237.001 6.812 6.812 0 0 0 1.496-.58c.465-.246.914-.55 1.333-.904.258-.218.5-.462.734-.716l2.111 2.111 1.414-1.414-2.33-2.33c.047-.08.098-.155.142-.236.273-.505.507-1.043.694-1.599.013-.039.021-.079.034-.118H22v-2h-2.308c.065-.499.107-1.004.107-1.511 0-.503-.042-1.005-.106-1.5H22V9h-3.756a8.494 8.494 0 0 0-1.349-2.481zM8.681 7.748c.445-.558.96-.993 1.528-1.294a3.773 3.773 0 0 1 3.581 0 4.894 4.894 0 0 1 1.53 1.295c.299.373.54.8.753 1.251H7.927c.214-.451.454-.879.754-1.252zM17.8 12.5c0 .522-.042 1.044-.126 1.553-.079.49-.199.973-.355 1.436a8.28 8.28 0 0 1-.559 1.288 7.59 7.59 0 0 1-.733 1.11c-.267.333-.56.636-.869.898-.31.261-.639.484-.979.664s-.695.317-1.057.41c-.04.01-.082.014-.122.023V14h-2v5.881c-.04-.009-.082-.013-.122-.023-.361-.093-.717-.23-1.057-.41s-.669-.403-.978-.664a6.462 6.462 0 0 1-.871-.899 7.402 7.402 0 0 1-.731-1.108 8.337 8.337 0 0 1-.56-1.289 9.075 9.075 0 0 1-.356-1.438A9.61 9.61 0 0 1 6.319 11H17.68c.079.491.12.995.12 1.5z" />\r
    </symbol>\r
\r
    <symbol id="bx-happy-heart-eyes" viewBox="0 0 24 24">\r
        <path d="M12 18c4 0 5-4 5-4H7s1 4 5 4z" />\r
        <path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z" />\r
        <path d="m8.535 12.634 2.05-2.083a1.485 1.485 0 0 0-.018-2.118 1.49 1.49 0 0 0-2.065-.034 1.488 1.488 0 0 0-2.067.068c-.586.6-.579 1.53.019 2.117l2.081 2.05zm7 0 2.05-2.083a1.485 1.485 0 0 0-.018-2.118 1.49 1.49 0 0 0-2.065-.034 1.488 1.488 0 0 0-2.068.067c-.586.6-.579 1.53.019 2.117l2.082 2.051z" />\r
    </symbol>\r
\r
    <symbol id="bx-alarm-exclamation" viewBox="0 0 24 24">\r
        <path d="M12 22c4.879 0 9-4.121 9-9s-4.121-9-9-9-9 4.121-9 9 4.121 9 9 9zm0-16c3.794 0 7 3.206 7 7s-3.206 7-7 7-7-3.206-7-7 3.206-7 7-7zm5.284-2.293 1.412-1.416 3.01 3-1.413 1.417zM5.282 2.294 6.7 3.706l-2.99 3-1.417-1.413z" />\r
        <path d="M11 9h2v5h-2zm0 6h2v2h-2z" />\r
    </symbol>\r
\r
    <symbol id="bx-happy-beaming" viewBox="0 0 24 24">\r
        <path d="M12 18c4 0 5-4 5-4H7s1 4 5 4z" />\r
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />\r
        <path d="m13 12 2 .012c.012-.462.194-1.012 1-1.012s.988.55 1 1h2c0-1.206-.799-3-3-3s-3 1.794-3 3zm-5-1c.806 0 .988.55 1 1h2c0-1.206-.799-3-3-3s-3 1.794-3 3l2 .012C7.012 11.55 7.194 11 8 11z" />\r
    </symbol>\r
\r
    <symbol id="bx-dizzy" viewBox="0 0 24 24">\r
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />\r
        <path d="M10.707 12.293 9.414 11l1.293-1.293-1.414-1.414L8 9.586 6.707 8.293 5.293 9.707 6.586 11l-1.293 1.293 1.414 1.414L8 12.414l1.293 1.293zm6.586-4L16 9.586l-1.293-1.293-1.414 1.414L14.586 11l-1.293 1.293 1.414 1.414L16 12.414l1.293 1.293 1.414-1.414L17.414 11l1.293-1.293zM10 16h4v2h-4z" />\r
    </symbol>\r
\r
    <symbol id="bx-sleepy" viewBox="0 0 24 24">\r
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />\r
        <ellipse cx="12" cy="15.5" rx="3" ry="2.5" />\r
        <path d="M10 7c-2.905 0-3.983 2.386-4 3.99l2 .021C8.002 10.804 8.076 9 10 9V7zm4 0v2c1.826 0 1.992 1.537 2 2.007L17 11h1c0-1.608-1.065-4-4-4z" />\r
    </symbol>\r
\r
    <symbol id="bx-tired" viewBox="0 0 24 24">\r
        <path d="M12 14c-3 0-4 3-4 3h8s-1-3-4-3z" />\r
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />\r
        <path d="m17.555 8.832-1.109-1.664-3 2a1.001 1.001 0 0 0 .108 1.727l4 2 .895-1.789-2.459-1.229 1.565-1.045zm-6.557 1.23a1 1 0 0 0-.443-.894l-3-2-1.11 1.664 1.566 1.044-2.459 1.229.895 1.789 4-2a.998.998 0 0 0 .551-.832z" />\r
    </symbol>\r
\r
    <symbol id="bx-check-circle" viewBox="0 0 24 24">\r
        <path fill="currentColor" d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />\r
        <path fill="currentColor" d="M9.999 13.587 7.7 11.292l-1.412 1.416 3.713 3.705 6.706-6.706-1.414-1.414z" />\r
    </symbol>\r
\r
    <symbol id="bx-x-circle" viewBox="0 0 24 24">\r
        <path fill="currentColor" d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z" />\r
        <path fill="currentColor" d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z" />\r
    </symbol>\r
\r
    <symbol id="bx-error-alt" viewBox="0 0 24 24">\r
        <path fill="none" d="M0 0h24v24H0z"/>\r
        <path d="M11 7h2v7h-2zm0 8h2v2h-2z"/>\r
        <path d="m21.707 7.293-5-5A.996.996 0 0 0 16 2H8a.996.996 0 0 0-.707.293l-5 5A.996.996 0 0 0 2 8v8c0 .266.105.52.293.707l5 5A.996.996 0 0 0 8 22h8c.266 0 .52-.105.707-.293l5-5A.996.996 0 0 0 22 16V8a.996.996 0 0 0-.293-.707zM20 15.586 15.586 20H8.414L4 15.586V8.414L8.414 4h7.172L20 8.414v7.172z"/>\r
    </symbol>\r
</svg>`;
var pn = /* @__PURE__ */ new Map([["align-self", "-ms-grid-row-align"], ["color-adjust", "-webkit-print-color-adjust"], ["column-gap", "grid-column-gap"], ["forced-color-adjust", "-ms-high-contrast-adjust"], ["gap", "grid-gap"], ["grid-template-columns", "-ms-grid-columns"], ["grid-template-rows", "-ms-grid-rows"], ["justify-self", "-ms-grid-column-align"], ["margin-inline-end", "-webkit-margin-end"], ["margin-inline-start", "-webkit-margin-start"], ["mask-border", "-webkit-mask-box-image"], ["mask-border-outset", "-webkit-mask-box-image-outset"], ["mask-border-slice", "-webkit-mask-box-image-slice"], ["mask-border-source", "-webkit-mask-box-image-source"], ["mask-border-repeat", "-webkit-mask-box-image-repeat"], ["mask-border-width", "-webkit-mask-box-image-width"], ["overflow-wrap", "word-wrap"], ["padding-inline-end", "-webkit-padding-end"], ["padding-inline-start", "-webkit-padding-start"], ["print-color-adjust", "color-adjust"], ["row-gap", "grid-row-gap"], ["scroll-margin-bottom", "scroll-snap-margin-bottom"], ["scroll-margin-left", "scroll-snap-margin-left"], ["scroll-margin-right", "scroll-snap-margin-right"], ["scroll-margin-top", "scroll-snap-margin-top"], ["scroll-margin", "scroll-snap-margin"], ["text-combine-upright", "-ms-text-combine-horizontal"]]);
function Ls(e) {
  return pn.get(e);
}
function Ms(e) {
  var t = /^(?:(text-(?:decoration$|e|or|si)|back(?:ground-cl|d|f)|box-d|mask(?:$|-[ispro]|-cl)|pr|hyphena|flex-d)|(tab-|column(?!-s)|text-align-l)|(ap)|u|hy)/i.exec(e);
  return t ? t[1] ? 1 : t[2] ? 2 : t[3] ? 3 : 5 : 0;
}
function Os(e, t) {
  var r = /^(?:(pos)|(cli)|(background-i)|(flex(?:$|-b)|(?:max-|min-)?(?:block-s|inl|he|widt))|dis)/i.exec(e);
  return r ? r[1] ? /^sti/i.test(t) ? 1 : 0 : r[2] ? /^pat/i.test(t) ? 1 : 0 : r[3] ? /^image-/i.test(t) ? 1 : 0 : r[4] ? t[3] === "-" ? 2 : 0 : /^(?:inline-)?grid$/i.test(t) ? 4 : 0 : 0;
}
var F = (e, t) => !!~e.indexOf(t), M = (e, t = "-") => e.join(t), ar = (e, t) => M(e.filter(Boolean), t), L = (e, t = 1) => e.slice(t), mn = (e) => e, Us = () => {
}, le = (e) => e[0].toUpperCase() + L(e), kr = (e) => e.replace(/[A-Z]/g, "-$&").toLowerCase(), Te = (e, t) => {
  for (; typeof e == "function"; )
    e = e(t);
  return e;
}, zs = (e, t) => {
  e.size > t && e.delete(e.keys().next().value);
}, Ds = (e, t) => !F("@:&", e[0]) && (F("rg", (typeof t)[5]) || Array.isArray(t)), Ar = (e, t, r) => t ? Object.keys(t).reduce((s, i) => {
  const n = Te(t[i], r);
  return Ds(i, n) ? s[kr(i)] = n : s[i] = i[0] == "@" && F("figa", i[1]) ? (s[i] || []).concat(n) : Ar(s[i] || {}, n, r), s;
}, e) : e, Hs = typeof CSS < "u" && CSS.escape || ((e) => e.replace(/[!"'`*+.,;:\\/<=>?@#$%&^|~()[\]{}]/g, "\\$&").replace(/^\d/, "\\3$& ")), Ot = (e) => (Array.isArray(e) || (e = [e]), "@media " + M(e.map((t) => (typeof t == "string" && (t = { min: t }), t.raw || M(Object.keys(t).map((r) => `(${r}-width:${t[r]})`), " and "))), ",")), Wt = (e) => {
  for (var t = 9, r = e.length; r--; )
    t = Math.imul(t ^ e.charCodeAt(r), 1597334677);
  return "tw-" + ((t ^ t >>> 9) >>> 0).toString(36);
}, gn = (e, t) => {
  for (var r = 0, s = e.length; r < s; ) {
    const i = s + r >> 1;
    e[i] <= t ? r = i + 1 : s = i;
  }
  return s;
}, he, je, me = (e = "") => (he.push(e), ""), Sr = (e) => {
  he.length = Math.max(he.lastIndexOf("") + ~~e, 0);
}, bn = (e) => e && !F("!:", e[0]), wn = (e) => e[0] == ":", Bs = (e, t) => {
  je.push({
    v: he.filter(wn),
    d: e,
    n: t,
    i: F(he, "!"),
    $: ""
  });
}, Pr = (e) => {
  const t = e[0] == "-";
  t && (e = L(e));
  const r = M(he.filter(bn));
  return Bs(e == "&" ? r : (r && r + "-") + e, t), "";
}, st = (e, t) => {
  let r = "";
  for (let s, i = !1, n = 0; s = e[n++]; ) {
    if (i || s == "[") {
      r += s, i = s != "]";
      continue;
    }
    switch (s) {
      case ":":
        r = r && me(":" + (e[n] == s ? e[n++] : "") + r);
        break;
      case "(":
        r = r && me(r), me();
        break;
      case "!":
        me(s);
        break;
      case ")":
      case " ":
      case "	":
      case `
`:
      case "\r":
        r = r && Pr(r), Sr(s !== ")");
        break;
      default:
        r += s;
    }
  }
  r && (t ? me(":" + r) : r.slice(-1) == "-" ? me(r.slice(0, -1)) : Pr(r));
}, Fs = (e) => {
  me(), At(e), Sr();
}, yn = (e, t) => {
  if (t) {
    me();
    const r = F("tbu", (typeof t)[1]);
    st(e, r), r && Fs(t), Sr();
  }
}, At = (e) => {
  switch (typeof e) {
    case "string":
      st(e);
      break;
    case "function":
      Bs(e);
      break;
    case "object":
      Array.isArray(e) ? e.forEach(Fs) : e && Object.keys(e).forEach((t) => {
        yn(t, e[t]);
      });
  }
}, Ir = /* @__PURE__ */ new WeakMap(), vn = (e) => {
  let t = Ir.get(e);
  if (!t) {
    let r = NaN, s = "";
    t = e.map((i, n) => {
      if (r !== r && (i.slice(-1) == "[" || F(":-(", (e[n + 1] || "")[0])) && (r = n), n >= r)
        return (c) => {
          n == r && (s = ""), s += i, F("rg", (typeof c)[5]) ? s += c : c && (st(s), s = "", At(c)), n == e.length - 1 && st(s);
        };
      const o = je = [];
      st(i);
      const a = [...he];
      return je = [], (c) => {
        je.push(...o), he = [...a], c && At(c);
      };
    }), Ir.set(e, t);
  }
  return t;
}, lr = (e) => (he = [], je = [], Array.isArray(e[0]) && Array.isArray(e[0].raw) ? vn(e[0]).forEach((t, r) => t(e[r + 1])) : At(e), je), cr, xn = (e, t) => (typeof t == "function" && (cr = !1), t), $n = (e) => {
  cr = !0;
  const t = JSON.stringify(e, xn);
  return cr && t;
}, Vr = /* @__PURE__ */ new WeakMap(), _n = (e, t) => {
  const r = $n(t);
  let s;
  if (r) {
    var i = Vr.get(e);
    i || Vr.set(e, i = /* @__PURE__ */ new Map()), s = i.get(r);
  }
  return s || (s = Object.defineProperty((n, o) => (o = Array.isArray(n) ? o : n, Te(e(t, o), o)), "toJSON", {
    value: () => r || t
  }), i && (i.set(r, s), zs(i, 1e4))), s;
}, Cn = (e, { css: t }) => t(lr(e)), kn = (...e) => _n(Cn, e), js = (e) => (t, r, s, i) => {
  if (t) {
    const n = r && e(r);
    if (n && n.length > 0)
      return n.reduce((o, a) => (o[ar([s, a, i])] = t, o), {});
  }
}, An = /* @__PURE__ */ js((e) => ({
  t: ["top-left", "top-right"],
  r: ["top-right", "bottom-right"],
  b: ["bottom-left", "bottom-right"],
  l: ["bottom-left", "top-left"],
  tl: ["top-left"],
  tr: ["top-right"],
  bl: ["bottom-left"],
  br: ["bottom-right"]
})[e]), St = (e) => {
  const t = ({ x: "lr", y: "tb" }[e] || e || "").split("").sort();
  for (let r = t.length; r--; )
    if (!(t[r] = {
      t: "top",
      r: "right",
      b: "bottom",
      l: "left"
    }[t[r]]))
      return;
  if (t.length)
    return t;
}, Ns = /* @__PURE__ */ js(St), Sn = (e, t) => e + (t[1] == ":" ? L(t, 2) + ":" : L(t)) + ":", qr = (e, t = e.d) => typeof t == "function" ? "" : e.v.reduce(Sn, "") + (e.i ? "!" : "") + (e.n ? "-" : "") + t, p, Ce, z, pt = (e) => e == "cols" ? "columns" : "rows", ct = (e) => (t, r, s) => ({
  [e]: s + ((p = M(t)) && "-" + p)
}), j = (e, t) => (r, s, i) => (p = M(r, t)) && {
  [e || i]: p
}, q = (e) => (t, { theme: r }, s) => (p = r(e || s, t)) && {
  [e || s]: p
}, mt = (e, t) => (r, { theme: s }, i) => (p = s(e || i, r, M(r, t))) && {
  [e || i]: p
}, oe = (e, t) => (r, s) => e(r, s, t), de = ct("display"), Ge = ct("position"), ze = ct("textTransform"), De = ct("textDecoration"), gt = ct("fontStyle"), fe = (e) => (t, r, s) => ({
  ["--tw-" + e]: s,
  fontVariantNumeric: "var(--tw-ordinal,/*!*/ /*!*/) var(--tw-slashed-zero,/*!*/ /*!*/) var(--tw-numeric-figure,/*!*/ /*!*/) var(--tw-numeric-spacing,/*!*/ /*!*/) var(--tw-numeric-fraction,/*!*/ /*!*/)"
}), bt = (e, { theme: t }, r) => (p = t("inset", e)) && { [r]: p }, et = (e, t, r, s = r) => (p = t(s + "Opacity", L(e))) && {
  [`--tw-${r}-opacity`]: p
}, Zt = (e, t) => Math.round(parseInt(e, 16) * t), Et = (e, t, r) => e && e[0] == "#" && (p = (e.length - 1) / 3) && (z = [17, 1, 0.062272][p - 1]) ? `rgba(${Zt(e.substr(1, p), z)},${Zt(e.substr(1 + p, p), z)},${Zt(e.substr(1 + 2 * p, p), z)},${t ? `var(--tw-${t}${r ? "," + r : ""})` : r || 1})` : e, vt = (e, t, r) => r && typeof r == "string" ? (p = Et(r, t + "-opacity")) && p !== r ? {
  [`--tw-${t}-opacity`]: "1",
  [e]: [r, p]
} : { [e]: r } : void 0, Wr = (e) => (z = Et(e, "", "0")) == p ? "transparent" : z, Zr = (e, { theme: t }, r, s, i, n) => (p = { x: ["right", "left"], y: ["bottom", "top"] }[e[0]]) && (z = `--tw-${r}-${e[0]}-reverse`) ? e[1] == "reverse" ? {
  [z]: "1"
} : {
  [z]: "0",
  [ar([i, p[0], n])]: (Ce = t(s, L(e))) && `calc(${Ce} * var(${z}))`,
  [ar([i, p[1], n])]: Ce && [Ce, `calc(${Ce} * calc(1 - var(${z})))`]
} : void 0, Ps = (e, t) => t[0] && {
  [e]: (F("wun", (t[0] || "")[3]) ? "space-" : "") + t[0]
}, Gt = (e) => (t) => F(["start", "end"], t[0]) ? { [e]: "flex-" + t[0] } : Ps(e, t), Gr = (e) => (t, { theme: r }) => {
  if (p = r("grid" + le(e), t, ""))
    return { ["grid-" + e]: p };
  switch (t[0]) {
    case "span":
      return t[1] && {
        ["grid-" + e]: `span ${t[1]} / span ${t[1]}`
      };
    case "start":
    case "end":
      return (p = r("grid" + le(e) + le(t[0]), L(t), M(L(t)))) && {
        [`grid-${e}-${t[0]}`]: p
      };
  }
}, Is = (e, { theme: t }, r) => {
  switch (e[0]) {
    case "solid":
    case "dashed":
    case "dotted":
    case "double":
    case "none":
      return j("borderStyle")(e);
    case "collapse":
    case "separate":
      return j("borderCollapse")(e);
    case "opacity":
      return et(e, t, r);
  }
  return (p = t(r + "Width", e, "")) ? { borderWidth: p } : vt("borderColor", r, t(r + "Color", e));
}, En = (e, t, r) => {
  var s;
  const i = (s = St(e[0])) == null ? void 0 : s.map(le);
  i && (e = L(e));
  let n = Is(e, t, r);
  return i && n && typeof n == "object" && (n = Object.entries(n).reduce((o, [a, c]) => {
    if (a.startsWith("border"))
      for (const d of i)
        o[a.slice(0, 6) + d + a.slice(6)] = c;
    else
      o[a] = c;
    return o;
  }, {})), n;
}, dr = (e) => (e ? "translate3d(var(--tw-translate-x,0),var(--tw-translate-y,0),0)" : "translateX(var(--tw-translate-x,0)) translateY(var(--tw-translate-y,0))") + " rotate(var(--tw-rotate,0)) skewX(var(--tw-skew-x,0)) skewY(var(--tw-skew-y,0)) scaleX(var(--tw-scale-x,1)) scaleY(var(--tw-scale-y,1))", Kt = (e, t, r) => e[0] && (p = t.theme(r, e[1] || e[0])) && {
  [`--tw-${r}-x`]: e[0] !== "y" && p,
  [`--tw-${r}-y`]: e[0] !== "x" && p,
  transform: [`${r}${e[1] ? e[0].toUpperCase() : ""}(${p})`, dr()]
}, Vs = (e) => (t, r, s) => s[1] ? Ns(r.theme(e, t), s[1], e) : q(e)(t, r, s), xe = Vs("padding"), $e = Vs("margin"), Kr = (e, { theme: t }, r) => (p = { w: "width", h: "height" }[e[0]]) && {
  [p = `${r}${le(p)}`]: t(p, L(e))
}, re = (e, { theme: t }, r) => {
  const s = r.split("-"), i = s[0] == "backdrop" ? s[0] + "-" : "";
  if (i || e.unshift(...s), e[0] == "filter") {
    const n = [
      "blur",
      "brightness",
      "contrast",
      "grayscale",
      "hue-rotate",
      "invert",
      i && "opacity",
      "saturate",
      "sepia",
      !i && "drop-shadow"
    ].filter(Boolean);
    return e[1] == "none" ? { [i + "filter"]: "none" } : n.reduce((o, a) => (o["--tw-" + i + a] = "var(--tw-empty,/*!*/ /*!*/)", o), {
      [i + "filter"]: n.map((o) => `var(--tw-${i}${o})`).join(" ")
    });
  }
  return z = e.shift(), F(["hue", "drop"], z) && (z += le(e.shift())), (p = t(i ? "backdrop" + le(z) : z, e)) && {
    ["--tw-" + i + z]: (Array.isArray(p) ? p : [p]).map((n) => `${kr(z)}(${n})`).join(" ")
  };
}, Rn = {
  group: (e, { tag: t }, r) => t(M([r, ...e])),
  hidden: oe(de, "none"),
  inline: de,
  block: de,
  contents: de,
  flow: de,
  table: (e, t, r) => F(["auto", "fixed"], e[0]) ? { tableLayout: e[0] } : de(e, t, r),
  flex(e, t, r) {
    switch (e[0]) {
      case "row":
      case "col":
        return {
          flexDirection: M(e[0] == "col" ? ["column", ...L(e)] : e)
        };
      case "nowrap":
      case "wrap":
        return { flexWrap: M(e) };
      case "grow":
      case "shrink":
        return p = t.theme("flex" + le(e[0]), L(e), e[1] || 1), p != null && {
          ["flex-" + e[0]]: "" + p
        };
    }
    return (p = t.theme("flex", e, "")) ? { flex: p } : de(e, t, r);
  },
  grid(e, t, r) {
    switch (e[0]) {
      case "cols":
      case "rows":
        return (p = t.theme("gridTemplate" + le(pt(e[0])), L(e), e.length == 2 && Number(e[1]) ? `repeat(${e[1]},minmax(0,1fr))` : M(L(e)))) && {
          ["gridTemplate-" + pt(e[0])]: p
        };
      case "flow":
        return e.length > 1 && {
          gridAutoFlow: M(e[1] == "col" ? ["column", ...L(e, 2)] : L(e), " ")
        };
    }
    return de(e, t, r);
  },
  auto: (e, { theme: t }) => F(["cols", "rows"], e[0]) && (p = t("gridAuto" + le(pt(e[0])), L(e), M(L(e)))) && {
    ["gridAuto-" + pt(e[0])]: p
  },
  static: Ge,
  fixed: Ge,
  absolute: Ge,
  relative: Ge,
  sticky: Ge,
  visible: { visibility: "visible" },
  invisible: { visibility: "hidden" },
  antialiased: {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale"
  },
  "subpixel-antialiased": {
    WebkitFontSmoothing: "auto",
    MozOsxFontSmoothing: "auto"
  },
  truncate: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  "sr-only": {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    clip: "rect(0,0,0,0)",
    borderWidth: "0"
  },
  "not-sr-only": {
    position: "static",
    width: "auto",
    height: "auto",
    padding: "0",
    margin: "0",
    overflow: "visible",
    whiteSpace: "normal",
    clip: "auto"
  },
  resize: (e) => ({
    resize: { x: "horizontal", y: "vertical" }[e[0]] || e[0] || "both"
  }),
  box: (e) => e[0] && { boxSizing: e[0] + "-box" },
  appearance: j(),
  cursor: mt(),
  float: j(),
  clear: j(),
  decoration: j("boxDecorationBreak"),
  isolate: { isolation: "isolate" },
  isolation: j(),
  "mix-blend": j("mixBlendMode"),
  top: bt,
  right: bt,
  bottom: bt,
  left: bt,
  inset: (e, { theme: t }) => (p = St(e[0])) ? Ns(t("inset", L(e)), e[0]) : (p = t("inset", e)) && {
    top: p,
    right: p,
    bottom: p,
    left: p
  },
  underline: De,
  "line-through": De,
  "no-underline": oe(De, "none"),
  "text-underline": oe(De, "underline"),
  "text-no-underline": oe(De, "none"),
  "text-line-through": oe(De, "line-through"),
  uppercase: ze,
  lowercase: ze,
  capitalize: ze,
  "normal-case": oe(ze, "none"),
  "text-normal-case": oe(ze, "none"),
  italic: gt,
  "not-italic": oe(gt, "normal"),
  "font-italic": oe(gt, "italic"),
  "font-not-italic": oe(gt, "normal"),
  font: (e, t, r) => (p = t.theme("fontFamily", e, "")) ? { fontFamily: p } : q("fontWeight")(e, t, r),
  items: (e) => e[0] && {
    alignItems: F(["start", "end"], e[0]) ? "flex-" + e[0] : M(e)
  },
  "justify-self": j(),
  "justify-items": j(),
  justify: Gt("justifyContent"),
  content: Gt("alignContent"),
  self: Gt("alignSelf"),
  place: (e) => e[0] && Ps("place-" + e[0], L(e)),
  overscroll: (e) => e[0] && {
    ["overscrollBehavior" + (e[1] ? "-" + e[0] : "")]: e[1] || e[0]
  },
  col: Gr("column"),
  row: Gr("row"),
  duration: q("transitionDuration"),
  delay: q("transitionDelay"),
  tracking: q("letterSpacing"),
  leading: q("lineHeight"),
  z: q("zIndex"),
  opacity: q(),
  ease: q("transitionTimingFunction"),
  p: xe,
  py: xe,
  px: xe,
  pt: xe,
  pr: xe,
  pb: xe,
  pl: xe,
  m: $e,
  my: $e,
  mx: $e,
  mt: $e,
  mr: $e,
  mb: $e,
  ml: $e,
  w: q("width"),
  h: q("height"),
  min: Kr,
  max: Kr,
  fill: q(),
  order: q(),
  origin: mt("transformOrigin", " "),
  select: j("userSelect"),
  "pointer-events": j(),
  align: j("verticalAlign"),
  whitespace: j("whiteSpace"),
  "normal-nums": { fontVariantNumeric: "normal" },
  ordinal: fe("ordinal"),
  "slashed-zero": fe("slashed-zero"),
  "lining-nums": fe("numeric-figure"),
  "oldstyle-nums": fe("numeric-figure"),
  "proportional-nums": fe("numeric-spacing"),
  "tabular-nums": fe("numeric-spacing"),
  "diagonal-fractions": fe("numeric-fraction"),
  "stacked-fractions": fe("numeric-fraction"),
  overflow: (e, t, r) => F(["ellipsis", "clip"], e[0]) ? j("textOverflow")(e) : e[1] ? { ["overflow-" + e[0]]: e[1] } : j()(e, t, r),
  transform: (e) => e[0] == "none" ? { transform: "none" } : {
    "--tw-translate-x": "0",
    "--tw-translate-y": "0",
    "--tw-rotate": "0",
    "--tw-skew-x": "0",
    "--tw-skew-y": "0",
    "--tw-scale-x": "1",
    "--tw-scale-y": "1",
    transform: dr(e[0] == "gpu")
  },
  rotate: (e, { theme: t }) => (p = t("rotate", e)) && {
    "--tw-rotate": p,
    transform: [`rotate(${p})`, dr()]
  },
  scale: Kt,
  translate: Kt,
  skew: Kt,
  gap: (e, t, r) => (p = { x: "column", y: "row" }[e[0]]) ? { [p + "Gap"]: t.theme("gap", L(e)) } : q("gap")(e, t, r),
  stroke: (e, t, r) => (p = t.theme("stroke", e, "")) ? { stroke: p } : q("strokeWidth")(e, t, r),
  outline: (e, { theme: t }) => (p = t("outline", e)) && {
    outline: p[0],
    outlineOffset: p[1]
  },
  "break-normal": {
    wordBreak: "normal",
    overflowWrap: "normal"
  },
  "break-words": { overflowWrap: "break-word" },
  "break-all": { wordBreak: "break-all" },
  text(e, { theme: t }, r) {
    switch (e[0]) {
      case "left":
      case "center":
      case "right":
      case "justify":
        return { textAlign: e[0] };
      case "uppercase":
      case "lowercase":
      case "capitalize":
        return ze([], p, e[0]);
      case "opacity":
        return et(e, t, r);
    }
    const s = t("fontSize", e, "");
    return s ? typeof s == "string" ? { fontSize: s } : {
      fontSize: s[0],
      ...typeof s[1] == "string" ? { lineHeight: s[1] } : s[1]
    } : vt("color", "text", t("textColor", e));
  },
  bg(e, { theme: t }, r) {
    switch (e[0]) {
      case "fixed":
      case "local":
      case "scroll":
        return j("backgroundAttachment", ",")(e);
      case "bottom":
      case "center":
      case "left":
      case "right":
      case "top":
        return j("backgroundPosition", " ")(e);
      case "no":
        return e[1] == "repeat" && j("backgroundRepeat")(e);
      case "repeat":
        return F("xy", e[1]) ? j("backgroundRepeat")(e) : { backgroundRepeat: e[1] || e[0] };
      case "opacity":
        return et(e, t, r, "background");
      case "clip":
      case "origin":
        return e[1] && {
          ["background-" + e[0]]: e[1] + (e[1] == "text" ? "" : "-box")
        };
      case "blend":
        return j("background-blend-mode")(L(e));
      case "gradient":
        if (e[1] == "to" && (p = St(e[2])))
          return {
            backgroundImage: `linear-gradient(to ${M(p, " ")},var(--tw-gradient-stops))`
          };
    }
    return (p = t("backgroundPosition", e, "")) ? { backgroundPosition: p } : (p = t("backgroundSize", e, "")) ? { backgroundSize: p } : (p = t("backgroundImage", e, "")) ? { backgroundImage: p } : vt("backgroundColor", "bg", t("backgroundColor", e));
  },
  from: (e, { theme: t }) => (p = t("gradientColorStops", e)) && {
    "--tw-gradient-from": p,
    "--tw-gradient-stops": `var(--tw-gradient-from),var(--tw-gradient-to,${Wr(p)})`
  },
  via: (e, { theme: t }) => (p = t("gradientColorStops", e)) && {
    "--tw-gradient-stops": `var(--tw-gradient-from),${p},var(--tw-gradient-to,${Wr(p)})`
  },
  to: (e, { theme: t }) => (p = t("gradientColorStops", e)) && {
    "--tw-gradient-to": p
  },
  border: En,
  divide: (e, t, r) => (p = Zr(e, t, r, "divideWidth", "border", "width") || Is(e, t, r)) && {
    "&>:not([hidden])~:not([hidden])": p
  },
  space: (e, t, r) => (p = Zr(e, t, r, "space", "margin")) && {
    "&>:not([hidden])~:not([hidden])": p
  },
  placeholder: (e, { theme: t }, r) => (p = e[0] == "opacity" ? et(e, t, r) : vt("color", "placeholder", t("placeholderColor", e))) && {
    "&::placeholder": p
  },
  shadow: (e, { theme: t }) => (p = t("boxShadow", e)) && {
    ":global": {
      "*": {
        "--tw-shadow": "0 0 transparent"
      }
    },
    "--tw-shadow": p == "none" ? "0 0 transparent" : p,
    boxShadow: [
      p,
      "var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--tw-shadow)"
    ]
  },
  animate: (e, { theme: t, tag: r }) => {
    if (z = t("animation", e)) {
      const s = z.split(" ");
      return (p = t("keyframes", s[0], Ce = {})) !== Ce ? (z = r(s[0])) && {
        animation: z + " " + M(L(s), " "),
        ["@keyframes " + z]: p
      } : { animation: z };
    }
  },
  ring(e, { theme: t }, r) {
    switch (e[0]) {
      case "inset":
        return { "--tw-ring-inset": "inset" };
      case "opacity":
        return et(e, t, r);
      case "offset":
        return (p = t("ringOffsetWidth", L(e), "")) ? {
          "--tw-ring-offset-width": p
        } : {
          "--tw-ring-offset-color": t("ringOffsetColor", L(e))
        };
    }
    return (p = t("ringWidth", e, "")) ? {
      "--tw-ring-offset-shadow": "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
      "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 calc(${p} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
      boxShadow: "var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 transparent)",
      ":global": {
        "*": {
          "--tw-ring-inset": "var(--tw-empty,/*!*/ /*!*/)",
          "--tw-ring-offset-width": t("ringOffsetWidth", "", "0px"),
          "--tw-ring-offset-color": t("ringOffsetColor", "", "#fff"),
          "--tw-ring-color": Et(t("ringColor", "", "#93c5fd"), "ring-opacity", t("ringOpacity", "", "0.5")),
          "--tw-ring-offset-shadow": "0 0 transparent",
          "--tw-ring-shadow": "0 0 transparent"
        }
      }
    } : {
      "--tw-ring-opacity": "1",
      "--tw-ring-color": Et(t("ringColor", e), "ring-opacity")
    };
  },
  object: (e, t, r) => F(["contain", "cover", "fill", "none", "scale-down"], M(e)) ? { objectFit: M(e) } : mt("objectPosition", " ")(e, t, r),
  list: (e, t, r) => M(e) == "item" ? de(e, t, r) : F(["inside", "outside"], M(e)) ? { listStylePosition: e[0] } : mt("listStyleType")(e, t, r),
  rounded: (e, t, r) => An(t.theme("borderRadius", L(e), ""), e[0], "border", "radius") || q("borderRadius")(e, t, r),
  "transition-none": { transitionProperty: "none" },
  transition: (e, { theme: t }) => ({
    transitionProperty: t("transitionProperty", e),
    transitionTimingFunction: t("transitionTimingFunction", ""),
    transitionDuration: t("transitionDuration", "")
  }),
  container: (e, { theme: t }) => {
    const { screens: r = t("screens"), center: s, padding: i } = t("container"), n = (o) => (p = i && (typeof i == "string" ? i : i[o] || i.DEFAULT)) ? {
      paddingRight: p,
      paddingLeft: p
    } : {};
    return Object.keys(r).reduce((o, a) => ((z = r[a]) && typeof z == "string" && (o[Ot(z)] = {
      "&": {
        "max-width": z,
        ...n(a)
      }
    }), o), {
      width: "100%",
      ...s ? { marginRight: "auto", marginLeft: "auto" } : {},
      ...n("xs")
    });
  },
  filter: re,
  blur: re,
  brightness: re,
  contrast: re,
  grayscale: re,
  "hue-rotate": re,
  invert: re,
  saturate: re,
  sepia: re,
  "drop-shadow": re,
  backdrop: re
}, Tn = (e) => ({
  ":root": { tabSize: 4 },
  "body,blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre,fieldset,ol,ul": { margin: "0" },
  button: { backgroundColor: "transparent", backgroundImage: "none" },
  'button,[type="button"],[type="reset"],[type="submit"]': { WebkitAppearance: "button" },
  "button:focus": { outline: ["1px dotted", "5px auto -webkit-focus-ring-color"] },
  "fieldset,ol,ul,legend": { padding: "0" },
  "ol,ul": { listStyle: "none" },
  html: {
    lineHeight: "1.5",
    WebkitTextSizeAdjust: "100%",
    fontFamily: e("fontFamily.sans", "ui-sans-serif,system-ui,sans-serif")
  },
  body: { fontFamily: "inherit", lineHeight: "inherit" },
  "*,::before,::after": {
    boxSizing: "border-box",
    border: `0 solid ${e("borderColor.DEFAULT", "currentColor")}`
  },
  hr: { height: "0", color: "inherit", borderTopWidth: "1px" },
  img: { borderStyle: "solid" },
  textarea: { resize: "vertical" },
  "input::placeholder,textarea::placeholder": {
    opacity: "1",
    color: e("placeholderColor.DEFAULT", e("colors.gray.400", "#a1a1aa"))
  },
  'button,[role="button"]': { cursor: "pointer" },
  table: { textIndent: "0", borderColor: "inherit", borderCollapse: "collapse" },
  "h1,h2,h3,h4,h5,h6": { fontSize: "inherit", fontWeight: "inherit" },
  a: { color: "inherit", textDecoration: "inherit" },
  "button,input,optgroup,select,textarea": {
    fontFamily: "inherit",
    fontSize: "100%",
    margin: "0",
    padding: "0",
    lineHeight: "inherit",
    color: "inherit"
  },
  "button,select": { textTransform: "none" },
  "::-moz-focus-inner": { borderStyle: "none", padding: "0" },
  ":-moz-focusring": { outline: "1px dotted ButtonText" },
  ":-moz-ui-invalid": { boxShadow: "none" },
  progress: { verticalAlign: "baseline" },
  "::-webkit-inner-spin-button,::-webkit-outer-spin-button": { height: "auto" },
  '[type="search"]': { WebkitAppearance: "textfield", outlineOffset: "-2px" },
  "::-webkit-search-decoration": { WebkitAppearance: "none" },
  "::-webkit-file-upload-button": { WebkitAppearance: "button", font: "inherit" },
  summary: { display: "list-item" },
  "abbr[title]": { textDecoration: "underline dotted" },
  "b,strong": { fontWeight: "bolder" },
  "pre,code,kbd,samp": {
    fontFamily: e("fontFamily", "mono", "ui-monospace,monospace"),
    fontSize: "1em"
  },
  "sub,sup": { fontSize: "75%", lineHeight: "0", position: "relative", verticalAlign: "baseline" },
  sub: { bottom: "-0.25em" },
  sup: { top: "-0.5em" },
  "img,svg,video,canvas,audio,iframe,embed,object": { display: "block", verticalAlign: "middle" },
  "img,video": { maxWidth: "100%", height: "auto" }
}), Ln = {
  dark: "@media (prefers-color-scheme:dark)",
  sticky: "@supports ((position: -webkit-sticky) or (position:sticky))",
  "motion-reduce": "@media (prefers-reduced-motion:reduce)",
  "motion-safe": "@media (prefers-reduced-motion:no-preference)",
  first: "&:first-child",
  last: "&:last-child",
  even: "&:nth-child(2n)",
  odd: "&:nth-child(odd)",
  children: "&>*",
  siblings: "&~*",
  sibling: "&+*",
  override: "&&"
}, Jr = "__twind", Mn = (e) => {
  let t = self[Jr];
  return t || (t = document.head.appendChild(document.createElement("style")), t.id = Jr, e && (t.nonce = e), t.appendChild(document.createTextNode(""))), t;
}, qs = ({
  nonce: e,
  target: t = Mn(e).sheet
} = {}) => {
  const r = t.cssRules.length;
  return {
    target: t,
    insert: (s, i) => t.insertRule(s, r + i)
  };
}, On = () => ({
  target: null,
  insert: Us
}), Er = (e) => ({
  unknown(t, r = [], s, i) {
    s || this.report({ id: "UNKNOWN_THEME_VALUE", key: t + "." + M(r) }, i);
  },
  report({ id: t, ...r }) {
    return e(`[${t}] ${JSON.stringify(r)}`);
  }
}), Xr = /* @__PURE__ */ Er((e) => console.warn(e)), Un = /* @__PURE__ */ Er((e) => {
  throw new Error(e);
}), zn = /* @__PURE__ */ Er(Us), ue = (e, t, r) => `${e}:${t}${r ? " !important" : ""}`, Dn = (e, t, r) => {
  let s = "";
  const i = Ls(e);
  i && (s += `${ue(i, t, r)};`);
  let n = Ms(e);
  return n & 1 && (s += `-webkit-${ue(e, t, r)};`), n & 2 && (s += `-moz-${ue(e, t, r)};`), n & 4 && (s += `-ms-${ue(e, t, r)};`), n = Os(e, t), n & 1 && (s += `${ue(e, `-webkit-${t}`, r)};`), n & 2 && (s += `${ue(e, `-moz-${t}`, r)};`), n & 4 && (s += `${ue(e, `-ms-${t}`, r)};`), s += ue(e, t, r), s;
}, Ke = (e, t) => {
  const r = {};
  do
    for (let s = 1; s < e; s++)
      r[`${s}/${e}`] = Number((s / e * 100).toFixed(6)) + "%";
  while (++e <= t);
  return r;
}, pe = (e, t, r = 0) => {
  const s = {};
  for (; r <= e; r = r * 2 || 1)
    s[r] = r + t;
  return s;
}, K = (e, t = "", r = 1, s = 0, i = 1, n = {}) => {
  for (; s <= e; s += i)
    n[s] = s / r + t;
  return n;
}, B = (e) => (t) => t(e), Hn = {
  screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
  },
  colors: {
    transparent: "transparent",
    current: "currentColor",
    black: "#000",
    white: "#fff",
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827"
    },
    red: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d"
    },
    yellow: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f"
    },
    green: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b"
    },
    blue: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a"
    },
    indigo: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81"
    },
    purple: {
      50: "#f5f3ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95"
    },
    pink: {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
      900: "#831843"
    }
  },
  spacing: {
    px: "1px",
    0: "0px",
    .../* @__PURE__ */ K(4, "rem", 4, 0.5, 0.5),
    .../* @__PURE__ */ K(12, "rem", 4, 5),
    14: "3.5rem",
    .../* @__PURE__ */ K(64, "rem", 4, 16, 4),
    72: "18rem",
    80: "20rem",
    96: "24rem"
  },
  durations: {
    75: "75ms",
    100: "100ms",
    150: "150ms",
    200: "200ms",
    300: "300ms",
    500: "500ms",
    700: "700ms",
    1e3: "1000ms"
  },
  animation: {
    none: "none",
    spin: "spin 1s linear infinite",
    ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    bounce: "bounce 1s infinite"
  },
  backdropBlur: /* @__PURE__ */ B("blur"),
  backdropBrightness: /* @__PURE__ */ B("brightness"),
  backdropContrast: /* @__PURE__ */ B("contrast"),
  backdropGrayscale: /* @__PURE__ */ B("grayscale"),
  backdropHueRotate: /* @__PURE__ */ B("hueRotate"),
  backdropInvert: /* @__PURE__ */ B("invert"),
  backdropOpacity: /* @__PURE__ */ B("opacity"),
  backdropSaturate: /* @__PURE__ */ B("saturate"),
  backdropSepia: /* @__PURE__ */ B("sepia"),
  backgroundColor: /* @__PURE__ */ B("colors"),
  backgroundImage: {
    none: "none"
  },
  backgroundOpacity: /* @__PURE__ */ B("opacity"),
  backgroundSize: {
    auto: "auto",
    cover: "cover",
    contain: "contain"
  },
  blur: {
    0: "0",
    sm: "4px",
    DEFAULT: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "40px",
    "3xl": "64px"
  },
  brightness: {
    .../* @__PURE__ */ K(200, "", 100, 0, 50),
    .../* @__PURE__ */ K(110, "", 100, 90, 5),
    75: "0.75",
    125: "1.25"
  },
  borderColor: (e) => ({
    ...e("colors"),
    DEFAULT: e("colors.gray.200", "currentColor")
  }),
  borderOpacity: /* @__PURE__ */ B("opacity"),
  borderRadius: {
    none: "0px",
    sm: "0.125rem",
    DEFAULT: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    "1/2": "50%",
    full: "9999px"
  },
  borderWidth: {
    DEFAULT: "1px",
    .../* @__PURE__ */ pe(8, "px")
  },
  boxShadow: {
    sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
    DEFAULT: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
    xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
    "2xl": "0 25px 50px -12px rgba(0,0,0,0.25)",
    inner: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
    none: "none"
  },
  contrast: {
    .../* @__PURE__ */ K(200, "", 100, 0, 50),
    75: "0.75",
    125: "1.25"
  },
  divideColor: /* @__PURE__ */ B("borderColor"),
  divideOpacity: /* @__PURE__ */ B("borderOpacity"),
  divideWidth: /* @__PURE__ */ B("borderWidth"),
  dropShadow: {
    sm: "0 1px 1px rgba(0,0,0,0.05)",
    DEFAULT: ["0 1px 2px rgba(0,0,0,0.1)", "0 1px 1px rgba(0,0,0,0.06)"],
    md: ["0 4px 3px rgba(0,0,0,0.07)", "0 2px 2px rgba(0,0,0,0.06)"],
    lg: ["0 10px 8px rgba(0,0,0,0.04)", "0 4px 3px rgba(0,0,0,0.1)"],
    xl: ["0 20px 13px rgba(0,0,0,0.03)", "0 8px 5px rgba(0,0,0,0.08)"],
    "2xl": "0 25px 25px rgba(0,0,0,0.15)",
    none: "0 0 #0000"
  },
  fill: { current: "currentColor" },
  grayscale: {
    0: "0",
    DEFAULT: "100%"
  },
  hueRotate: {
    0: "0deg",
    15: "15deg",
    30: "30deg",
    60: "60deg",
    90: "90deg",
    180: "180deg"
  },
  invert: {
    0: "0",
    DEFAULT: "100%"
  },
  flex: {
    1: "1 1 0%",
    auto: "1 1 auto",
    initial: "0 1 auto",
    none: "none"
  },
  fontFamily: {
    sans: 'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'.split(","),
    serif: 'ui-serif,Georgia,Cambria,"Times New Roman",Times,serif'.split(","),
    mono: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'.split(",")
  },
  fontSize: {
    xs: ["0.75rem", "1rem"],
    sm: ["0.875rem", "1.25rem"],
    base: ["1rem", "1.5rem"],
    lg: ["1.125rem", "1.75rem"],
    xl: ["1.25rem", "1.75rem"],
    "2xl": ["1.5rem", "2rem"],
    "3xl": ["1.875rem", "2.25rem"],
    "4xl": ["2.25rem", "2.5rem"],
    "5xl": ["3rem", "1"],
    "6xl": ["3.75rem", "1"],
    "7xl": ["4.5rem", "1"],
    "8xl": ["6rem", "1"],
    "9xl": ["8rem", "1"]
  },
  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900"
  },
  gridTemplateColumns: {},
  gridTemplateRows: {},
  gridAutoColumns: {
    min: "min-content",
    max: "max-content",
    fr: "minmax(0,1fr)"
  },
  gridAutoRows: {
    min: "min-content",
    max: "max-content",
    fr: "minmax(0,1fr)"
  },
  gridColumn: {
    auto: "auto",
    "span-full": "1 / -1"
  },
  gridRow: {
    auto: "auto",
    "span-full": "1 / -1"
  },
  gap: /* @__PURE__ */ B("spacing"),
  gradientColorStops: /* @__PURE__ */ B("colors"),
  height: (e) => ({
    auto: "auto",
    ...e("spacing"),
    ...Ke(2, 6),
    full: "100%",
    screen: "100vh"
  }),
  inset: (e) => ({
    auto: "auto",
    ...e("spacing"),
    ...Ke(2, 4),
    full: "100%"
  }),
  keyframes: {
    spin: {
      from: {
        transform: "rotate(0deg)"
      },
      to: {
        transform: "rotate(360deg)"
      }
    },
    ping: {
      "0%": {
        transform: "scale(1)",
        opacity: "1"
      },
      "75%,100%": {
        transform: "scale(2)",
        opacity: "0"
      }
    },
    pulse: {
      "0%,100%": {
        opacity: "1"
      },
      "50%": {
        opacity: ".5"
      }
    },
    bounce: {
      "0%, 100%": {
        transform: "translateY(-25%)",
        animationTimingFunction: "cubic-bezier(0.8,0,1,1)"
      },
      "50%": {
        transform: "none",
        animationTimingFunction: "cubic-bezier(0,0,0.2,1)"
      }
    }
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em"
  },
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
    .../* @__PURE__ */ K(10, "rem", 4, 3)
  },
  margin: (e) => ({
    auto: "auto",
    ...e("spacing")
  }),
  maxHeight: (e) => ({
    ...e("spacing"),
    full: "100%",
    screen: "100vh"
  }),
  maxWidth: (e, { breakpoints: t }) => ({
    none: "none",
    0: "0rem",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
    full: "100%",
    min: "min-content",
    max: "max-content",
    prose: "65ch",
    ...t(e("screens"))
  }),
  minHeight: {
    0: "0px",
    full: "100%",
    screen: "100vh"
  },
  minWidth: {
    0: "0px",
    full: "100%",
    min: "min-content",
    max: "max-content"
  },
  opacity: {
    .../* @__PURE__ */ K(100, "", 100, 0, 10),
    5: "0.05",
    25: "0.25",
    75: "0.75",
    95: "0.95"
  },
  order: {
    first: "-9999",
    last: "9999",
    none: "0",
    .../* @__PURE__ */ K(12, "", 1, 1)
  },
  outline: {
    none: ["2px solid transparent", "2px"],
    white: ["2px dotted white", "2px"],
    black: ["2px dotted black", "2px"]
  },
  padding: /* @__PURE__ */ B("spacing"),
  placeholderColor: /* @__PURE__ */ B("colors"),
  placeholderOpacity: /* @__PURE__ */ B("opacity"),
  ringColor: (e) => ({
    DEFAULT: e("colors.blue.500", "#3b82f6"),
    ...e("colors")
  }),
  ringOffsetColor: /* @__PURE__ */ B("colors"),
  ringOffsetWidth: /* @__PURE__ */ pe(8, "px"),
  ringOpacity: (e) => ({
    DEFAULT: "0.5",
    ...e("opacity")
  }),
  ringWidth: {
    DEFAULT: "3px",
    .../* @__PURE__ */ pe(8, "px")
  },
  rotate: {
    .../* @__PURE__ */ pe(2, "deg"),
    .../* @__PURE__ */ pe(12, "deg", 3),
    .../* @__PURE__ */ pe(180, "deg", 45)
  },
  saturate: /* @__PURE__ */ K(200, "", 100, 0, 50),
  scale: {
    .../* @__PURE__ */ K(150, "", 100, 0, 50),
    .../* @__PURE__ */ K(110, "", 100, 90, 5),
    75: "0.75",
    125: "1.25"
  },
  sepia: {
    0: "0",
    DEFAULT: "100%"
  },
  skew: {
    .../* @__PURE__ */ pe(2, "deg"),
    .../* @__PURE__ */ pe(12, "deg", 3)
  },
  space: /* @__PURE__ */ B("spacing"),
  stroke: {
    current: "currentColor"
  },
  strokeWidth: /* @__PURE__ */ K(2),
  textColor: /* @__PURE__ */ B("colors"),
  textOpacity: /* @__PURE__ */ B("opacity"),
  transitionDuration: (e) => ({
    DEFAULT: "150ms",
    ...e("durations")
  }),
  transitionDelay: /* @__PURE__ */ B("durations"),
  transitionProperty: {
    none: "none",
    all: "all",
    DEFAULT: "background-color,border-color,color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter",
    colors: "background-color,border-color,color,fill,stroke",
    opacity: "opacity",
    shadow: "box-shadow",
    transform: "transform"
  },
  transitionTimingFunction: {
    DEFAULT: "cubic-bezier(0.4,0,0.2,1)",
    linear: "linear",
    in: "cubic-bezier(0.4,0,1,1)",
    out: "cubic-bezier(0,0,0.2,1)",
    "in-out": "cubic-bezier(0.4,0,0.2,1)"
  },
  translate: (e) => ({
    ...e("spacing"),
    ...Ke(2, 4),
    full: "100%"
  }),
  width: (e) => ({
    auto: "auto",
    ...e("spacing"),
    ...Ke(2, 6),
    ...Ke(12, 12),
    screen: "100vw",
    full: "100%",
    min: "min-content",
    max: "max-content"
  }),
  zIndex: {
    auto: "auto",
    .../* @__PURE__ */ K(50, "", 1, 0, 10)
  }
}, Ws = (e, t = {}, r = []) => (Object.keys(e).forEach((s) => {
  const i = e[s];
  s == "DEFAULT" && (t[M(r)] = i, t[M(r, ".")] = i);
  const n = [...r, s];
  t[M(n)] = i, t[M(n, ".")] = i, i && typeof i == "object" && Ws(i, t, n);
}, t), t), Bn = {
  negative: () => ({}),
  breakpoints: (e) => Object.keys(e).filter((t) => typeof e[t] == "string").reduce((t, r) => (t["screen-" + r] = e[r], t), {})
}, Fn = (e, t) => (t = t[0] == "[" && t.slice(-1) == "]" && t.slice(1, -1)) && F(e, "olor") == /^(#|(hsl|rgb)a?\(|[a-z]+$)/.test(t) && (F(t, "calc(") ? t.replace(/(-?\d*\.?\d(?!\b-.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g, "$1 $2 ") : t), jn = (e) => {
  const t = /* @__PURE__ */ new Map(), r = { ...Hn, ...e }, s = (n, o) => {
    const a = n && n[o], c = typeof a == "function" ? a(i, Bn) : a;
    return c && o == "colors" ? Ws(c) : c;
  }, i = (n, o, a) => {
    const c = n.split(".");
    n = c[0], c.length > 1 && (a = o, o = M(L(c), "."));
    let d = t.get(n);
    if (d || (t.set(n, d = { ...s(r, n) }), Object.assign(d, s(r.extend, n))), o != null) {
      o = (Array.isArray(o) ? M(o) : o) || "DEFAULT";
      const u = Fn(n, o) || d[o];
      return u == null ? a : Array.isArray(u) && !F(["fontSize", "outline", "dropShadow"], n) ? M(u, ",") : u;
    }
    return d;
  };
  return i;
}, Nn = (e, t) => (r, s) => {
  if (typeof r.d == "function")
    return r.d(t);
  const i = r.d.split(/-(?![^[]*])/g);
  if (!s && i[0] == "tw" && r.$ == r.d)
    return r.$;
  for (let n = i.length; n; n--) {
    const o = M(i.slice(0, n));
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const a = e[o];
      return typeof a == "function" ? a(L(i, n), t, o) : typeof a == "string" ? t[s ? "css" : "tw"](a) : a;
    }
  }
}, Je, Zs = /^:(group(?:(?!-focus).+?)*)-(.+)$/, Gs = /^(:not)-(.+)/, Ks = (e) => e[1] == "[" ? L(e) : e, Pn = (e, t, { theme: r, tag: s }) => {
  const i = (n, o) => (Je = r("screens", L(o), "")) ? { [Ot(Je)]: n } : o == ":dark" && e == "class" ? { ".dark &": n } : (Je = Zs.exec(o)) ? { [`.${Hs(s(Je[1]))}:${Je[2]} &`]: n } : {
    [t[L(o)] || "&" + o.replace(Gs, (a, c, d) => c + "(" + Ks(":" + d) + ")")]: n
  };
  return (n, o) => o.v.reduceRight(i, n);
}, G, Js = (e) => (((G = /(?:^|min-width: *)(\d+(?:.\d+)?)(p)?/.exec(e)) ? +G[1] / (G[2] ? 15 : 1) / 10 : 0) & 31) << 22, Xs = (e) => {
  G = 0;
  for (let t = e.length; t--; )
    G += F("-:,", e[t]);
  return G;
}, Qs = (e) => (Xs(e) & 15) << 18, In = [
  "rst",
  "st",
  "en",
  "d",
  "nk",
  "sited",
  "pty",
  "ecked",
  "cus-w",
  "ver",
  "cus",
  "cus-v",
  "tive",
  "sable",
  "ad-on",
  "tiona",
  "quire"
], Vn = (e) => 1 << (~(G = In.indexOf(e.replace(Zs, ":$2").slice(3, 8))) ? G : 17), qn = (e, t) => (r, s) => r | ((G = e("screens", L(s), "")) ? 1 << 27 | Js(Ot(G)) : s == ":dark" ? 1 << 30 : (G = t[s] || s.replace(Gs, ":$2"))[0] == "@" ? Qs(G) : Vn(s)), Wn = (e) => e[0] == "-" ? 0 : Xs(e) + ((G = /^(?:(border-(?!w|c|sty)|[tlbr].{2,4}m?$|c.{7}$)|([fl].{5}l|g.{8}$|pl))/.exec(e)) ? +!!G[1] || -!!G[2] : 0) + 1, Jt = (e, t) => t + "{" + e + "}", Zn = (e, t, r) => {
  const { theme: s, tag: i } = r, n = (h, g) => "--" + i(g), o = (h) => `${h}`.replace(/--(tw-[\w-]+)\b/g, n), a = (h, g, v) => (h = o(h), Array.isArray(g) ? M(g.filter(Boolean).map((m) => e(h, o(m), v)), ";") : e(h, o(g), v));
  let c;
  const d = (h, g, v, m, y) => {
    if (Array.isArray(m)) {
      m.forEach((C) => C && d(h, g, v, C, y));
      return;
    }
    let x = "", S = 0, U = 0;
    m["@apply"] && (m = Ar(Te(kn(m["@apply"]), r), { ...m, "@apply": void 0 }, r)), Object.keys(m).forEach((C) => {
      const H = Te(m[C], r);
      if (Ds(C, H)) {
        if (H !== "" && C.length > 1) {
          const D = kr(C);
          U += 1, S = Math.max(S, Wn(D)), x = (x && x + ";") + a(D, H, y);
        }
      } else if (H)
        if (C == ":global" && (C = "@global"), C[0] == "@")
          if (C[1] == "g")
            d([], "", 0, H, y);
          else if (C[1] == "f")
            d([], C, 0, H, y);
          else if (C[1] == "k") {
            const D = c.length;
            d([], "", 0, H, y);
            const P = c.splice(D, c.length - D);
            c.push({
              r: Jt(M(P.map((_) => _.r), ""), C),
              p: P.reduce((_, E) => _ + E.p, 0)
            });
          } else C[1] == "i" ? (Array.isArray(H) ? H : [H]).forEach((D) => D && c.push({ p: 0, r: `${C} ${D};` })) : (C[2] == "c" && (C = Ot(r.theme("screens", L(C, 8).trim()))), d([...h, C], g, v | Js(C) | Qs(C), H, y));
        else
          d(h, g ? g.replace(/ *((?:\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g, (D, P, _) => C.replace(/ *((?:\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g, (E, O, te) => (F(O, "&") ? O.replace(/&/g, P) : (P && P + " ") + O) + te) + _) : C, v, H, y);
    }), U && c.push({
      r: h.reduceRight(Jt, Jt(x, g)),
      p: v * 256 + ((Math.max(0, 15 - U) & 15) << 4 | (S || 15) & 15)
    });
  }, u = qn(s, t);
  return (h, g, v, m = 0) => (m <<= 28, c = [], d([], g ? "." + Hs(g) : "", v ? v.v.reduceRight(u, m) : m, h, v && v.i), c);
}, Gn = (e, t, r, s) => {
  let i;
  r((o = []) => i = o);
  let n;
  return r((o = /* @__PURE__ */ new Set()) => n = o), ({ r: o, p: a }) => {
    if (!n.has(o)) {
      n.add(o);
      const c = gn(i, a);
      try {
        e.insert(o, c), i.splice(c, 0, a);
      } catch (d) {
        /:-[mwo]/.test(o) || t.report({ id: "INJECT_CSS_ERROR", css: o, error: d }, s);
      }
    }
  };
}, Xt = (e, t, r, s = t) => e === !1 ? r : e === !0 ? s : e || t, Kn = (e) => (typeof e == "string" ? { t: Un, a: Xr, i: zn }[e[1]] : e) || Xr, Jn = { _: { value: "", writable: !0 } }, Xn = (e = {}) => {
  const t = jn(e.theme), r = Kn(e.mode), s = Xt(e.hash, !1, !1, Wt), i = e.important;
  let n = { v: [] }, o = 0;
  const a = [], c = {
    tw: (..._) => D(_),
    theme: (_, E, O) => {
      var te;
      const ce = (te = t(_, E, O)) != null ? te : r.unknown(_, E == null || Array.isArray(E) ? E : E.split("."), O != null, c);
      return n.n && ce && F("rg", (typeof ce)[5]) ? `calc(${ce} * -1)` : ce;
    },
    tag: (_) => s ? s(_) : _,
    css: (_) => {
      o++;
      const E = a.length;
      try {
        (typeof _ == "string" ? lr([_]) : _).forEach(H);
        const O = Object.create(null, Jn);
        for (let te = E; te < a.length; te++) {
          const ce = a[te];
          if (ce)
            switch (typeof ce) {
              case "object":
                Ar(O, ce, c);
                break;
              case "string":
                O._ += (O._ && " ") + ce;
            }
        }
        return O;
      } finally {
        a.length = E, o--;
      }
    }
  }, d = Nn({ ...Rn, ...e.plugins }, c), u = (_) => {
    const E = n;
    n = _;
    try {
      return Te(d(_), c);
    } finally {
      n = E;
    }
  }, h = { ...Ln, ...e.variants }, g = Pn(e.darkMode || "media", h, c), v = Zn(Xt(e.prefix, Dn, ue), h, c), m = e.sheet || (typeof window > "u" ? On() : qs(e)), { init: y = (_) => _() } = m, x = Gn(m, r, y, c);
  let S;
  y((_ = /* @__PURE__ */ new Map()) => S = _);
  const U = /* @__PURE__ */ new WeakMap(), C = (_, E) => _ == "_" ? void 0 : typeof E == "function" ? JSON.stringify(Te(E, c), C) : E, H = (_) => {
    !o && n.v.length && (_ = { ..._, v: [...n.v, ..._.v], $: "" }), _.$ || (_.$ = qr(_, U.get(_.d)));
    let E = o ? null : S.get(_.$);
    if (E == null) {
      let O = u(_);
      if (_.$ || (_.$ = Wt(JSON.stringify(O, C)), U.set(_.d, _.$), _.$ = qr(_, _.$)), O && typeof O == "object")
        if (_.v = _.v.map(Ks), i && (_.i = i), O = g(O, _), o)
          a.push(O);
        else {
          const te = typeof _.d == "function" ? typeof O._ == "string" ? 1 : 3 : 2;
          E = s || typeof _.d == "function" ? (s || Wt)(te + _.$) : _.$, v(O, E, _, te).forEach(x), O._ && (E += " " + O._);
        }
      else
        typeof O == "string" ? E = O : (E = _.$, r.report({ id: "UNKNOWN_DIRECTIVE", rule: E }, c)), o && typeof _.d != "function" && a.push(E);
      o || (S.set(_.$, E), zs(S, 3e4));
    }
    return E;
  }, D = (_) => M(lr(_).map(H).filter(Boolean), " "), P = Xt(e.preflight, mn, !1);
  if (P) {
    const _ = Tn(t), E = v(typeof P == "function" ? Te(P(_, c), c) || _ : { ..._, ...P });
    y((O = (E.forEach(x), !0)) => O);
  }
  return {
    init: () => r.report({ id: "LATE_SETUP_CALL" }, c),
    process: D
  };
}, Qn = (e) => {
  let t = (n) => (r(), t(n)), r = (n) => {
    ({ process: t, init: r } = Xn(n));
  };
  e && r(e);
  let s;
  return {
    tw: Object.defineProperties((...n) => t(n), {
      theme: {
        get: ((n) => () => (s || t([
          (o) => (s = o, "")
        ]), s[n]))("theme")
      }
    }),
    setup: (n) => r(n)
  };
};
let ur = {
  screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
  },
  columns: {
    auto: "auto",
    // Handled by plugin,
    // 1: '1',
    // 2: '2',
    // 3: '3',
    // 4: '4',
    // 5: '5',
    // 6: '6',
    // 7: '7',
    // 8: '8',
    // 9: '9',
    // 10: '10',
    // 11: '11',
    // 12: '12',
    "3xs": "16rem",
    "2xs": "18rem",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem"
  },
  spacing: {
    px: "1px",
    0: "0px",
    .../* @__PURE__ */ Y(4, "rem", 4, 0.5, 0.5),
    // 0.5: '0.125rem',
    // 1: '0.25rem',
    // 1.5: '0.375rem',
    // 2: '0.5rem',
    // 2.5: '0.625rem',
    // 3: '0.75rem',
    // 3.5: '0.875rem',
    // 4: '1rem',
    .../* @__PURE__ */ Y(12, "rem", 4, 5),
    // 5: '1.25rem',
    // 6: '1.5rem',
    // 7: '1.75rem',
    // 8: '2rem',
    // 9: '2.25rem',
    // 10: '2.5rem',
    // 11: '2.75rem',
    // 12: '3rem',
    14: "3.5rem",
    .../* @__PURE__ */ Y(64, "rem", 4, 16, 4),
    // 16: '4rem',
    // 20: '5rem',
    // 24: '6rem',
    // 28: '7rem',
    // 32: '8rem',
    // 36: '9rem',
    // 40: '10rem',
    // 44: '11rem',
    // 48: '12rem',
    // 52: '13rem',
    // 56: '14rem',
    // 60: '15rem',
    // 64: '16rem',
    72: "18rem",
    80: "20rem",
    96: "24rem"
  },
  durations: {
    75: "75ms",
    100: "100ms",
    150: "150ms",
    200: "200ms",
    300: "300ms",
    500: "500ms",
    700: "700ms",
    1e3: "1000ms"
  },
  animation: {
    none: "none",
    spin: "spin 1s linear infinite",
    ping: "ping 1s cubic-bezier(0,0,0.2,1) infinite",
    pulse: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
    bounce: "bounce 1s infinite"
  },
  aspectRatio: {
    auto: "auto",
    square: "1/1",
    video: "16/9"
  },
  backdropBlur: /* @__PURE__ */ R("blur"),
  backdropBrightness: /* @__PURE__ */ R("brightness"),
  backdropContrast: /* @__PURE__ */ R("contrast"),
  backdropGrayscale: /* @__PURE__ */ R("grayscale"),
  backdropHueRotate: /* @__PURE__ */ R("hueRotate"),
  backdropInvert: /* @__PURE__ */ R("invert"),
  backdropOpacity: /* @__PURE__ */ R("opacity"),
  backdropSaturate: /* @__PURE__ */ R("saturate"),
  backdropSepia: /* @__PURE__ */ R("sepia"),
  backgroundColor: /* @__PURE__ */ R("colors"),
  backgroundImage: {
    none: "none"
  },
  // These are built-in
  // 'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
  // 'gradient-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
  // 'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
  // 'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
  // 'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
  // 'gradient-to-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
  // 'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
  // 'gradient-to-tl': 'linear-gradient(to top left, var(--tw-gradient-stops))',
  backgroundOpacity: /* @__PURE__ */ R("opacity"),
  // backgroundPosition: {
  //   // The following are already handled by the plugin:
  //   // center, right, left, bottom, top
  //   // 'bottom-10px-right-20px' -> bottom 10px right 20px
  // },
  backgroundSize: {
    auto: "auto",
    cover: "cover",
    contain: "contain"
  },
  blur: {
    none: "none",
    0: "0",
    sm: "4px",
    DEFAULT: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "40px",
    "3xl": "64px"
  },
  brightness: {
    .../* @__PURE__ */ Y(200, "", 100, 0, 50),
    // 0: '0',
    // 50: '.5',
    // 150: '1.5',
    // 200: '2',
    .../* @__PURE__ */ Y(110, "", 100, 90, 5),
    // 90: '.9',
    // 95: '.95',
    // 100: '1',
    // 105: '1.05',
    // 110: '1.1',
    75: "0.75",
    125: "1.25"
  },
  borderColor: ({ theme: e }) => ({
    DEFAULT: e("colors.gray.200", "currentColor"),
    ...e("colors")
  }),
  borderOpacity: /* @__PURE__ */ R("opacity"),
  borderRadius: {
    none: "0px",
    sm: "0.125rem",
    DEFAULT: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    "1/2": "50%",
    full: "9999px"
  },
  borderSpacing: /* @__PURE__ */ R("spacing"),
  borderWidth: {
    DEFAULT: "1px",
    .../* @__PURE__ */ ee(8, "px")
  },
  // 0: '0px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',
  boxShadow: {
    sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
    DEFAULT: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
    xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
    "2xl": "0 25px 50px -12px rgba(0,0,0,0.25)",
    inner: "inset 0 2px 4px 0 rgba(0,0,0,0.05)",
    none: "0 0 #0000"
  },
  boxShadowColor: R("colors"),
  // container: {},
  // cursor: {
  //   // Default values are handled by plugin
  // },
  caretColor: /* @__PURE__ */ R("colors"),
  accentColor: ({ theme: e }) => ({
    auto: "auto",
    ...e("colors")
  }),
  contrast: {
    .../* @__PURE__ */ Y(200, "", 100, 0, 50),
    // 0: '0',
    // 50: '.5',
    // 150: '1.5',
    // 200: '2',
    75: "0.75",
    125: "1.25"
  },
  content: {
    none: "none"
  },
  divideColor: /* @__PURE__ */ R("borderColor"),
  divideOpacity: /* @__PURE__ */ R("borderOpacity"),
  divideWidth: /* @__PURE__ */ R("borderWidth"),
  dropShadow: {
    sm: "0 1px 1px rgba(0,0,0,0.05)",
    DEFAULT: [
      "0 1px 2px rgba(0,0,0,0.1)",
      "0 1px 1px rgba(0,0,0,0.06)"
    ],
    md: [
      "0 4px 3px rgba(0,0,0,0.07)",
      "0 2px 2px rgba(0,0,0,0.06)"
    ],
    lg: [
      "0 10px 8px rgba(0,0,0,0.04)",
      "0 4px 3px rgba(0,0,0,0.1)"
    ],
    xl: [
      "0 20px 13px rgba(0,0,0,0.03)",
      "0 8px 5px rgba(0,0,0,0.08)"
    ],
    "2xl": "0 25px 25px rgba(0,0,0,0.15)",
    none: "0 0 #0000"
  },
  fill: ({ theme: e }) => ({
    ...e("colors"),
    none: "none"
  }),
  grayscale: {
    DEFAULT: "100%",
    0: "0"
  },
  hueRotate: {
    0: "0deg",
    15: "15deg",
    30: "30deg",
    60: "60deg",
    90: "90deg",
    180: "180deg"
  },
  invert: {
    DEFAULT: "100%",
    0: "0"
  },
  flex: {
    1: "1 1 0%",
    auto: "1 1 auto",
    initial: "0 1 auto",
    none: "none"
  },
  flexBasis: ({ theme: e }) => ({
    ...e("spacing"),
    ...Xe(2, 6),
    // '1/2': '50%',
    // '1/3': '33.333333%',
    // '2/3': '66.666667%',
    // '1/4': '25%',
    // '2/4': '50%',
    // '3/4': '75%',
    // '1/5': '20%',
    // '2/5': '40%',
    // '3/5': '60%',
    // '4/5': '80%',
    // '1/6': '16.666667%',
    // '2/6': '33.333333%',
    // '3/6': '50%',
    // '4/6': '66.666667%',
    // '5/6': '83.333333%',
    ...Xe(12, 12),
    // '1/12': '8.333333%',
    // '2/12': '16.666667%',
    // '3/12': '25%',
    // '4/12': '33.333333%',
    // '5/12': '41.666667%',
    // '6/12': '50%',
    // '7/12': '58.333333%',
    // '8/12': '66.666667%',
    // '9/12': '75%',
    // '10/12': '83.333333%',
    // '11/12': '91.666667%',
    auto: "auto",
    full: "100%"
  }),
  flexGrow: {
    DEFAULT: 1,
    0: 0
  },
  flexShrink: {
    DEFAULT: 1,
    0: 0
  },
  fontFamily: {
    sans: 'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'.split(","),
    serif: 'ui-serif,Georgia,Cambria,"Times New Roman",Times,serif'.split(","),
    mono: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'.split(",")
  },
  fontSize: {
    xs: [
      "0.75rem",
      "1rem"
    ],
    sm: [
      "0.875rem",
      "1.25rem"
    ],
    base: [
      "1rem",
      "1.5rem"
    ],
    lg: [
      "1.125rem",
      "1.75rem"
    ],
    xl: [
      "1.25rem",
      "1.75rem"
    ],
    "2xl": [
      "1.5rem",
      "2rem"
    ],
    "3xl": [
      "1.875rem",
      "2.25rem"
    ],
    "4xl": [
      "2.25rem",
      "2.5rem"
    ],
    "5xl": [
      "3rem",
      "1"
    ],
    "6xl": [
      "3.75rem",
      "1"
    ],
    "7xl": [
      "4.5rem",
      "1"
    ],
    "8xl": [
      "6rem",
      "1"
    ],
    "9xl": [
      "8rem",
      "1"
    ]
  },
  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900"
  },
  gap: /* @__PURE__ */ R("spacing"),
  gradientColorStops: /* @__PURE__ */ R("colors"),
  gridAutoColumns: {
    auto: "auto",
    min: "min-content",
    max: "max-content",
    fr: "minmax(0,1fr)"
  },
  gridAutoRows: {
    auto: "auto",
    min: "min-content",
    max: "max-content",
    fr: "minmax(0,1fr)"
  },
  gridColumn: {
    // span-X is handled by the plugin: span-1 -> span 1 / span 1
    auto: "auto",
    "span-full": "1 / -1"
  },
  // gridColumnEnd: {
  //   // Defaults handled by plugin
  // },
  // gridColumnStart: {
  //   // Defaults handled by plugin
  // },
  gridRow: {
    // span-X is handled by the plugin: span-1 -> span 1 / span 1
    auto: "auto",
    "span-full": "1 / -1"
  },
  // gridRowStart: {
  //   // Defaults handled by plugin
  // },
  // gridRowEnd: {
  //   // Defaults handled by plugin
  // },
  gridTemplateColumns: {
    // numbers are handled by the plugin: 1 -> repeat(1, minmax(0, 1fr))
    none: "none"
  },
  gridTemplateRows: {
    // numbers are handled by the plugin: 1 -> repeat(1, minmax(0, 1fr))
    none: "none"
  },
  height: ({ theme: e }) => ({
    ...e("spacing"),
    ...Xe(2, 6),
    // '1/2': '50%',
    // '1/3': '33.333333%',
    // '2/3': '66.666667%',
    // '1/4': '25%',
    // '2/4': '50%',
    // '3/4': '75%',
    // '1/5': '20%',
    // '2/5': '40%',
    // '3/5': '60%',
    // '4/5': '80%',
    // '1/6': '16.666667%',
    // '2/6': '33.333333%',
    // '3/6': '50%',
    // '4/6': '66.666667%',
    // '5/6': '83.333333%',
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    auto: "auto",
    full: "100%",
    screen: "100vh"
  }),
  inset: ({ theme: e }) => ({
    ...e("spacing"),
    ...Xe(2, 4),
    // '1/2': '50%',
    // '1/3': '33.333333%',
    // '2/3': '66.666667%',
    // '1/4': '25%',
    // '2/4': '50%',
    // '3/4': '75%',
    auto: "auto",
    full: "100%"
  }),
  keyframes: {
    spin: {
      from: {
        transform: "rotate(0deg)"
      },
      to: {
        transform: "rotate(360deg)"
      }
    },
    ping: {
      "0%": {
        transform: "scale(1)",
        opacity: "1"
      },
      "75%,100%": {
        transform: "scale(2)",
        opacity: "0"
      }
    },
    pulse: {
      "0%,100%": {
        opacity: "1"
      },
      "50%": {
        opacity: ".5"
      }
    },
    bounce: {
      "0%, 100%": {
        transform: "translateY(-25%)",
        animationTimingFunction: "cubic-bezier(0.8,0,1,1)"
      },
      "50%": {
        transform: "none",
        animationTimingFunction: "cubic-bezier(0,0,0.2,1)"
      }
    }
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em"
  },
  lineHeight: {
    .../* @__PURE__ */ Y(10, "rem", 4, 3),
    // 3: '.75rem',
    // 4: '1rem',
    // 5: '1.25rem',
    // 6: '1.5rem',
    // 7: '1.75rem',
    // 8: '2rem',
    // 9: '2.25rem',
    // 10: '2.5rem',
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2"
  },
  // listStyleType: {
  //   // Defaults handled by plugin
  // },
  margin: ({ theme: e }) => ({
    auto: "auto",
    ...e("spacing")
  }),
  maxHeight: ({ theme: e }) => ({
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    screen: "100vh",
    ...e("spacing")
  }),
  maxWidth: ({ theme: e, breakpoints: t }) => ({
    ...t(e("screens")),
    none: "none",
    0: "0rem",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    prose: "65ch"
  }),
  minHeight: {
    0: "0px",
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    screen: "100vh"
  },
  minWidth: {
    0: "0px",
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content"
  },
  // objectPosition: {
  //   // The plugins joins all arguments by default
  // },
  opacity: {
    .../* @__PURE__ */ Y(100, "", 100, 0, 10),
    // 0: '0',
    // 10: '0.1',
    // 20: '0.2',
    // 30: '0.3',
    // 40: '0.4',
    // 60: '0.6',
    // 70: '0.7',
    // 80: '0.8',
    // 90: '0.9',
    // 100: '1',
    5: "0.05",
    25: "0.25",
    75: "0.75",
    95: "0.95"
  },
  order: {
    // Handled by plugin
    // 1: '1',
    // 2: '2',
    // 3: '3',
    // 4: '4',
    // 5: '5',
    // 6: '6',
    // 7: '7',
    // 8: '8',
    // 9: '9',
    // 10: '10',
    // 11: '11',
    // 12: '12',
    first: "-9999",
    last: "9999",
    none: "0"
  },
  padding: /* @__PURE__ */ R("spacing"),
  placeholderColor: /* @__PURE__ */ R("colors"),
  placeholderOpacity: /* @__PURE__ */ R("opacity"),
  outlineColor: /* @__PURE__ */ R("colors"),
  outlineOffset: /* @__PURE__ */ ee(8, "px"),
  // 0: '0px',
  // 1: '1px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',,
  outlineWidth: /* @__PURE__ */ ee(8, "px"),
  // 0: '0px',
  // 1: '1px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',,
  ringColor: ({ theme: e }) => ({
    ...e("colors"),
    DEFAULT: "#3b82f6"
  }),
  ringOffsetColor: /* @__PURE__ */ R("colors"),
  ringOffsetWidth: /* @__PURE__ */ ee(8, "px"),
  // 0: '0px',
  // 1: '1px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',,
  ringOpacity: ({ theme: e }) => ({
    ...e("opacity"),
    DEFAULT: "0.5"
  }),
  ringWidth: {
    DEFAULT: "3px",
    .../* @__PURE__ */ ee(8, "px")
  },
  // 0: '0px',
  // 1: '1px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',
  rotate: {
    .../* @__PURE__ */ ee(2, "deg"),
    // 0: '0deg',
    // 1: '1deg',
    // 2: '2deg',
    .../* @__PURE__ */ ee(12, "deg", 3),
    // 3: '3deg',
    // 6: '6deg',
    // 12: '12deg',
    .../* @__PURE__ */ ee(180, "deg", 45)
  },
  // 45: '45deg',
  // 90: '90deg',
  // 180: '180deg',
  saturate: /* @__PURE__ */ Y(200, "", 100, 0, 50),
  // 0: '0',
  // 50: '.5',
  // 100: '1',
  // 150: '1.5',
  // 200: '2',
  scale: {
    .../* @__PURE__ */ Y(150, "", 100, 0, 50),
    // 0: '0',
    // 50: '.5',
    // 150: '1.5',
    .../* @__PURE__ */ Y(110, "", 100, 90, 5),
    // 90: '.9',
    // 95: '.95',
    // 100: '1',
    // 105: '1.05',
    // 110: '1.1',
    75: "0.75",
    125: "1.25"
  },
  scrollMargin: /* @__PURE__ */ R("spacing"),
  scrollPadding: /* @__PURE__ */ R("spacing"),
  sepia: {
    0: "0",
    DEFAULT: "100%"
  },
  skew: {
    .../* @__PURE__ */ ee(2, "deg"),
    // 0: '0deg',
    // 1: '1deg',
    // 2: '2deg',
    .../* @__PURE__ */ ee(12, "deg", 3)
  },
  // 3: '3deg',
  // 6: '6deg',
  // 12: '12deg',
  space: /* @__PURE__ */ R("spacing"),
  stroke: ({ theme: e }) => ({
    ...e("colors"),
    none: "none"
  }),
  strokeWidth: /* @__PURE__ */ Y(2),
  // 0: '0',
  // 1: '1',
  // 2: '2',,
  textColor: /* @__PURE__ */ R("colors"),
  textDecorationColor: /* @__PURE__ */ R("colors"),
  textDecorationThickness: {
    "from-font": "from-font",
    auto: "auto",
    .../* @__PURE__ */ ee(8, "px")
  },
  // 0: '0px',
  // 1: '1px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',
  textUnderlineOffset: {
    auto: "auto",
    .../* @__PURE__ */ ee(8, "px")
  },
  // 0: '0px',
  // 1: '1px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',
  textIndent: /* @__PURE__ */ R("spacing"),
  textOpacity: /* @__PURE__ */ R("opacity"),
  // transformOrigin: {
  //   // The following are already handled by the plugin:
  //   // center, right, left, bottom, top
  //   // 'bottom-10px-right-20px' -> bottom 10px right 20px
  // },
  transitionDuration: ({ theme: e }) => ({
    ...e("durations"),
    DEFAULT: "150ms"
  }),
  transitionDelay: /* @__PURE__ */ R("durations"),
  transitionProperty: {
    none: "none",
    all: "all",
    DEFAULT: "color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter",
    colors: "color,background-color,border-color,text-decoration-color,fill,stroke",
    opacity: "opacity",
    shadow: "box-shadow",
    transform: "transform"
  },
  transitionTimingFunction: {
    DEFAULT: "cubic-bezier(0.4,0,0.2,1)",
    linear: "linear",
    in: "cubic-bezier(0.4,0,1,1)",
    out: "cubic-bezier(0,0,0.2,1)",
    "in-out": "cubic-bezier(0.4,0,0.2,1)"
  },
  translate: ({ theme: e }) => ({
    ...e("spacing"),
    ...Xe(2, 4),
    // '1/2': '50%',
    // '1/3': '33.333333%',
    // '2/3': '66.666667%',
    // '1/4': '25%',
    // '2/4': '50%',
    // '3/4': '75%',
    full: "100%"
  }),
  width: ({ theme: e }) => ({
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    screen: "100vw",
    ...e("flexBasis")
  }),
  willChange: {
    scroll: "scroll-position"
  },
  // other options handled by rules
  // auto: 'auto',
  // contents: 'contents',
  // transform: 'transform',
  zIndex: {
    .../* @__PURE__ */ Y(50, "", 1, 0, 10),
    // 0: '0',
    // 10: '10',
    // 20: '20',
    // 30: '30',
    // 40: '40',
    // 50: '50',
    auto: "auto"
  }
};
function Xe(e, t) {
  let r = {};
  do
    for (var s = 1; s < e; s++) r[`${s}/${e}`] = Number((s / e * 100).toFixed(6)) + "%";
  while (++e <= t);
  return r;
}
function ee(e, t, r = 0) {
  let s = {};
  for (; r <= e; r = 2 * r || 1) s[r] = r + t;
  return s;
}
function Y(e, t = "", r = 1, s = 0, i = 1, n = {}) {
  for (; s <= e; s += i) n[s] = s / r + t;
  return n;
}
function R(e) {
  return ({ theme: t }) => t(e);
}
let Yn = {
  /*
  1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
  2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
  */
  "*,::before,::after": {
    boxSizing: "border-box",
    /* 1 */
    borderWidth: "0",
    /* 2 */
    borderStyle: "solid",
    /* 2 */
    borderColor: "theme(borderColor.DEFAULT, currentColor)"
  },
  /* 2 */
  "::before,::after": {
    "--tw-content": "''"
  },
  /*
  1. Use a consistent sensible line-height in all browsers.
  2. Prevent adjustments of font size after orientation changes in iOS.
  3. Use a more readable tab size.
  4. Use the user's configured `sans` font-family by default.
  5. Use the user's configured `sans` font-feature-settings by default.
  */
  html: {
    lineHeight: 1.5,
    /* 1 */
    WebkitTextSizeAdjust: "100%",
    /* 2 */
    MozTabSize: "4",
    /* 3 */
    tabSize: 4,
    /* 3 */
    fontFamily: `theme(fontFamily.sans, ${ur.fontFamily.sans})`,
    /* 4 */
    fontFeatureSettings: "theme(fontFamily.sans[1].fontFeatureSettings, normal)"
  },
  /* 5 */
  /*
  1. Remove the margin in all browsers.
  2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.
  */
  body: {
    margin: "0",
    /* 1 */
    lineHeight: "inherit"
  },
  /* 2 */
  /*
  1. Add the correct height in Firefox.
  2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
  3. Ensure horizontal rules are visible by default.
  */
  hr: {
    height: "0",
    /* 1 */
    color: "inherit",
    /* 2 */
    borderTopWidth: "1px"
  },
  /* 3 */
  /*
  Add the correct text decoration in Chrome, Edge, and Safari.
  */
  "abbr:where([title])": {
    textDecoration: "underline dotted"
  },
  /*
  Remove the default font size and weight for headings.
  */
  "h1,h2,h3,h4,h5,h6": {
    fontSize: "inherit",
    fontWeight: "inherit"
  },
  /*
  Reset links to optimize for opt-in styling instead of opt-out.
  */
  a: {
    color: "inherit",
    textDecoration: "inherit"
  },
  /*
  Add the correct font weight in Edge and Safari.
  */
  "b,strong": {
    fontWeight: "bolder"
  },
  /*
  1. Use the user's configured `mono` font family by default.
  2. Use the user's configured `mono` font-feature-settings by default.
  3. Correct the odd `em` font sizing in all browsers.
  */
  "code,kbd,samp,pre": {
    fontFamily: `theme(fontFamily.mono, ${ur.fontFamily.mono})`,
    fontFeatureSettings: "theme(fontFamily.mono[1].fontFeatureSettings, normal)",
    fontSize: "1em"
  },
  /*
  Add the correct font size in all browsers.
  */
  small: {
    fontSize: "80%"
  },
  /*
  Prevent `sub` and `sup` elements from affecting the line height in all browsers.
  */
  "sub,sup": {
    fontSize: "75%",
    lineHeight: 0,
    position: "relative",
    verticalAlign: "baseline"
  },
  sub: {
    bottom: "-0.25em"
  },
  sup: {
    top: "-0.5em"
  },
  /*
  1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
  2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
  3. Remove gaps between table borders by default.
  */
  table: {
    textIndent: "0",
    /* 1 */
    borderColor: "inherit",
    /* 2 */
    borderCollapse: "collapse"
  },
  /* 3 */
  /*
  1. Change the font styles in all browsers.
  2. Remove the margin in Firefox and Safari.
  3. Remove default padding in all browsers.
  */
  "button,input,optgroup,select,textarea": {
    fontFamily: "inherit",
    /* 1 */
    fontSize: "100%",
    /* 1 */
    lineHeight: "inherit",
    /* 1 */
    color: "inherit",
    /* 1 */
    margin: "0",
    /* 2 */
    padding: "0"
  },
  /* 3 */
  /*
  Remove the inheritance of text transform in Edge and Firefox.
  */
  "button,select": {
    textTransform: "none"
  },
  /*
  1. Correct the inability to style clickable types in iOS and Safari.
  2. Remove default button styles.
  */
  "button,[type='button'],[type='reset'],[type='submit']": {
    WebkitAppearance: "button",
    /* 1 */
    backgroundColor: "transparent",
    /* 2 */
    backgroundImage: "none"
  },
  /* 4 */
  /*
  Use the modern Firefox focus style for all focusable elements.
  */
  ":-moz-focusring": {
    outline: "auto"
  },
  /*
  Remove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
  */
  ":-moz-ui-invalid": {
    boxShadow: "none"
  },
  /*
  Add the correct vertical alignment in Chrome and Firefox.
  */
  progress: {
    verticalAlign: "baseline"
  },
  /*
  Correct the cursor style of increment and decrement buttons in Safari.
  */
  "::-webkit-inner-spin-button,::-webkit-outer-spin-button": {
    height: "auto"
  },
  /*
  1. Correct the odd appearance in Chrome and Safari.
  2. Correct the outline style in Safari.
  */
  "[type='search']": {
    WebkitAppearance: "textfield",
    /* 1 */
    outlineOffset: "-2px"
  },
  /* 2 */
  /*
  Remove the inner padding in Chrome and Safari on macOS.
  */
  "::-webkit-search-decoration": {
    WebkitAppearance: "none"
  },
  /*
  1. Correct the inability to style clickable types in iOS and Safari.
  2. Change font properties to `inherit` in Safari.
  */
  "::-webkit-file-upload-button": {
    WebkitAppearance: "button",
    /* 1 */
    font: "inherit"
  },
  /* 2 */
  /*
  Add the correct display in Chrome and Safari.
  */
  summary: {
    display: "list-item"
  },
  /*
  Removes the default spacing and border for appropriate elements.
  */
  "blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre": {
    margin: "0"
  },
  fieldset: {
    margin: "0",
    padding: "0"
  },
  legend: {
    padding: "0"
  },
  "ol,ul,menu": {
    listStyle: "none",
    margin: "0",
    padding: "0"
  },
  /*
  Prevent resizing textareas horizontally by default.
  */
  textarea: {
    resize: "vertical"
  },
  /*
  1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
  2. Set the default placeholder color to the user's configured gray 400 color.
  */
  "input::placeholder,textarea::placeholder": {
    opacity: 1,
    /* 1 */
    color: "theme(colors.gray.400, #9ca3af)"
  },
  /* 2 */
  /*
  Set the default cursor for buttons.
  */
  'button,[role="button"]': {
    cursor: "pointer"
  },
  /*
  Make sure disabled buttons don't get the pointer cursor.
  */
  ":disabled": {
    cursor: "default"
  },
  /*
  1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)
  2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
    This can trigger a poorly considered lint error in some tools but is included by design.
  */
  "img,svg,video,canvas,audio,iframe,embed,object": {
    display: "block",
    /* 1 */
    verticalAlign: "middle"
  },
  /* 2 */
  /*
  Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
  */
  "img,video": {
    maxWidth: "100%",
    height: "auto"
  },
  /* Make elements with the HTML hidden attribute stay hidden by default */
  "[hidden]": {
    display: "none"
  }
};
function eo(e, t = "@media ") {
  return t + Ut(e).map((r) => (typeof r == "string" && (r = {
    min: r
  }), r.raw || Object.keys(r).map((s) => `(${s}-width:${r[s]})`).join(" and "))).join(",");
}
function Ut(e = []) {
  return Array.isArray(e) ? e : e == null ? [] : [
    e
  ];
}
function Qt(e, t) {
  return Math.round(parseInt(e, 16) * t);
}
function Se(e, t = {}) {
  if (typeof e == "function") return e(t);
  let { opacityValue: r = "1", opacityVariable: s } = t, i = s ? `var(${s})` : r;
  if (e.includes("<alpha-value>")) return e.replace("<alpha-value>", i);
  if (e[0] == "#" && (e.length == 4 || e.length == 7)) {
    let n = (e.length - 1) / 3, o = [
      17,
      1,
      0.062272
    ][n - 1];
    return `rgba(${[
      Qt(e.substr(1, n), o),
      Qt(e.substr(1 + n, n), o),
      Qt(e.substr(1 + 2 * n, n), o),
      i
    ]})`;
  }
  return i == "1" ? e : i == "0" ? "#0000" : (
    // convert rgb and hsl to alpha variant
    e.replace(/^(rgb|hsl)(\([^)]+)\)$/, `$1a$2,${i})`)
  );
}
function to(e, t) {
  return e.replace(/theme\((["'`])?(.+?)\1(?:\s*,\s*(["'`])?(.+?)\3)?\)/g, (r, s, i, n, o = "") => {
    let a = t(i, o);
    return typeof a == "function" && /color|fill|stroke/i.test(i) ? Se(a) : "" + Ut(a).filter((c) => Object(c) !== c);
  });
}
function b(e, t, r) {
  return [
    e,
    ro(t, r)
  ];
}
function ro(e, t) {
  return typeof e == "function" ? e : typeof e == "string" && /^[\w-]+$/.test(e) ? (
    // a CSS property alias
    (r, s) => ({
      [e]: t ? t(r, s) : hr(r, 1)
    })
  ) : (r) => (
    // CSSObject, shortcut or apply
    e || {
      [r[1]]: hr(r, 2)
    }
  );
}
function hr(e, t, r = e.slice(t).find(Boolean) || e.$$ || e.input) {
  return e.input[0] == "-" ? `calc(${r} * -1)` : r;
}
function w(e, t, r, s) {
  return [
    e,
    so(t, r, s)
  ];
}
function so(e, t, r) {
  let s = typeof t == "string" ? (i, n) => ({
    [t]: r ? r(i, n) : i._
  }) : t || (({ 1: i, _: n }, o, a) => ({
    [i || a]: n
  }));
  return (i, n) => {
    let o = Ys(e || i[1]), a = n.theme(o, i.$$) ?? we(i.$$, o, n);
    if (a != null) return i._ = hr(i, 0, a), s(i, n, o);
  };
}
function I(e, t = {}, r) {
  return [
    e,
    io(t, r)
  ];
}
function io(e = {}, t) {
  return (r, s) => {
    let { section: i = Ys(r[0]).replace("-", "") + "Color" } = e, [n, o] = no(r.$$);
    if (!n) return;
    let a = s.theme(i, n) || we(n, i, s);
    if (!a || typeof a == "object") return;
    let {
      // text- -> --tw-text-opacity
      // ring-offset(?:-|$) -> --tw-ring-offset-opacity
      // TODO move this default into preset-tailwind?
      opacityVariable: c = `--tw-${r[0].replace(/-$/, "")}-opacity`,
      opacitySection: d = i.replace("Color", "Opacity"),
      property: u = i,
      selector: h
    } = e, g = s.theme(d, o || "DEFAULT") || o && we(o, d, s), v = t || (({ _: y }) => {
      let x = xt(u, y);
      return h ? {
        [h]: x
      } : x;
    });
    r._ = {
      value: Se(a, {
        opacityVariable: c || void 0,
        opacityValue: g || void 0
      }),
      color: (y) => Se(a, y),
      opacityVariable: c || void 0,
      opacityValue: g || void 0
    };
    let m = v(r, s);
    if (!r.dark) {
      let y = s.d(i, n, a);
      y && y !== a && (r._ = {
        value: Se(y, {
          opacityVariable: c || void 0,
          opacityValue: g || "1"
        }),
        color: (x) => Se(y, x),
        opacityVariable: c || void 0,
        opacityValue: g || void 0
      }, m = {
        "&": m,
        [s.v("dark")]: v(r, s)
      });
    }
    return m;
  };
}
function no(e) {
  return (e.match(/^(\[[^\]]+]|[^/]+?)(?:\/(.+))?$/) || []).slice(1);
}
function xt(e, t) {
  let r = {};
  return typeof t == "string" ? r[e] = t : (t.opacityVariable && t.value.includes(t.opacityVariable) && (r[t.opacityVariable] = t.opacityValue || "1"), r[e] = t.value), r;
}
function we(e, t, r) {
  if (e[0] == "[" && e.slice(-1) == "]") {
    if (e = at(to(e.slice(1, -1), r.theme)), !t) return e;
    if (
      // Respect type hints from the user on ambiguous arbitrary values - https://tailwindcss.com/docs/adding-custom-styles#resolving-ambiguities
      !// If this is a color section and the value is a hex color, color function or color name
      (/color|fill|stroke/i.test(t) && !(/^color:/.test(e) || /^(#|((hsl|rgb)a?|hwb|lab|lch|color)\(|[a-z]+$)/.test(e)) || // url(, [a-z]-gradient(, image(, cross-fade(, image-set(
      /image/i.test(t) && !(/^image:/.test(e) || /^[a-z-]+\(/.test(e)) || // font-*
      // - fontWeight (type: ['lookup', 'number', 'any'])
      // - fontFamily (type: ['lookup', 'generic-name', 'family-name'])
      /weight/i.test(t) && !(/^(number|any):/.test(e) || /^\d+$/.test(e)) || // bg-*
      // - backgroundPosition (type: ['lookup', ['position', { preferOnConflict: true }]])
      // - backgroundSize (type: ['lookup', 'length', 'percentage', 'size'])
      /position/i.test(t) && /^(length|size):/.test(e))
    )
      return e.replace(/^[a-z-]+:/, "");
  }
}
function Ys(e) {
  return e.replace(/-./g, (t) => t[1].toUpperCase());
}
function at(e) {
  return (
    // Keep raw strings if it starts with `url(`
    e.includes("url(") ? e.replace(/(.*?)(url\(.*?\))(.*?)/g, (t, r = "", s, i = "") => at(r) + s + at(i)) : e.replace(/(^|[^\\])_+/g, (t, r) => r + " ".repeat(t.length - r.length)).replace(/\\_/g, "_").replace(/(calc|min|max|clamp)\(.+\)/g, (t) => t.replace(/(-?\d*\.?\d(?!\b-.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g, "$1 $2 "))
  );
}
let oo = [
  /* arbitrary properties: [paint-order:markers] */
  b("\\[([-\\w]+):(.+)]", ({ 1: e, 2: t }, r) => ({
    "@layer overrides": {
      "&": {
        [e]: we(`[${t}]`, "", r)
      }
    }
  })),
  /* Styling based on parent and peer state */
  b("(group|peer)([~/][^-[]+)?", ({ input: e }, { h: t }) => [
    {
      c: t(e)
    }
  ]),
  /* LAYOUT */
  w("aspect-", "aspectRatio"),
  b("container", (e, { theme: t }) => {
    let { screens: r = t("screens"), center: s, padding: i } = t("container"), n = {
      width: "100%",
      marginRight: s && "auto",
      marginLeft: s && "auto",
      ...o("xs")
    };
    for (let a in r) {
      let c = r[a];
      typeof c == "string" && (n[eo(c)] = {
        "&": {
          maxWidth: c,
          ...o(a)
        }
      });
    }
    return n;
    function o(a) {
      let c = i && (typeof i == "string" ? i : i[a] || i.DEFAULT);
      if (c) return {
        paddingRight: c,
        paddingLeft: c
      };
    }
  }),
  // Content
  w("content-", "content", ({ _: e }) => ({
    "--tw-content": e,
    content: "var(--tw-content)"
  })),
  // Box Decoration Break
  b("(?:box-)?decoration-(slice|clone)", "boxDecorationBreak"),
  // Box Sizing
  b("box-(border|content)", "boxSizing", ({ 1: e }) => e + "-box"),
  // Display
  b("hidden", {
    display: "none"
  }),
  // Table Layout
  b("table-(auto|fixed)", "tableLayout"),
  b([
    "(block|flex|table|grid|inline|contents|flow-root|list-item)",
    "(inline-(block|flex|table|grid))",
    "(table-(caption|cell|column|row|(column|row|footer|header)-group))"
  ], "display"),
  // Floats
  "(float)-(left|right|none)",
  // Clear
  "(clear)-(left|right|none|both)",
  // Overflow
  "(overflow(?:-[xy])?)-(auto|hidden|clip|visible|scroll)",
  // Isolation
  "(isolation)-(auto)",
  // Isolation
  b("isolate", "isolation"),
  // Object Fit
  b("object-(contain|cover|fill|none|scale-down)", "objectFit"),
  // Object Position
  w("object-", "objectPosition"),
  b("object-(top|bottom|center|(left|right)(-(top|bottom))?)", "objectPosition", wt),
  // Overscroll Behavior
  b("overscroll(-[xy])?-(auto|contain|none)", ({ 1: e = "", 2: t }) => ({
    ["overscroll-behavior" + e]: t
  })),
  // Position
  b("(static|fixed|absolute|relative|sticky)", "position"),
  // Top / Right / Bottom / Left
  w("-?inset(-[xy])?(?:$|-)", "inset", ({ 1: e, _: t }) => ({
    top: e != "-x" && t,
    right: e != "-y" && t,
    bottom: e != "-x" && t,
    left: e != "-y" && t
  })),
  w("-?(top|bottom|left|right)(?:$|-)", "inset"),
  // Visibility
  b("(visible|collapse)", "visibility"),
  b("invisible", {
    visibility: "hidden"
  }),
  // Z-Index
  w("-?z-", "zIndex"),
  /* FLEXBOX */
  // Flex Direction
  b("flex-((row|col)(-reverse)?)", "flexDirection", Qr),
  b("flex-(wrap|wrap-reverse|nowrap)", "flexWrap"),
  w("(flex-(?:grow|shrink))(?:$|-)"),
  /*, 'flex-grow' | flex-shrink */
  w("(flex)-"),
  /*, 'flex' */
  w("grow(?:$|-)", "flexGrow"),
  w("shrink(?:$|-)", "flexShrink"),
  w("basis-", "flexBasis"),
  w("-?(order)-"),
  /*, 'order' */
  "-?(order)-(\\d+)",
  /* GRID */
  // Grid Template Columns
  w("grid-cols-", "gridTemplateColumns"),
  b("grid-cols-(\\d+)", "gridTemplateColumns", rs),
  // Grid Column Start / End
  w("col-", "gridColumn"),
  b("col-(span)-(\\d+)", "gridColumn", ts),
  w("col-start-", "gridColumnStart"),
  b("col-start-(auto|\\d+)", "gridColumnStart"),
  w("col-end-", "gridColumnEnd"),
  b("col-end-(auto|\\d+)", "gridColumnEnd"),
  // Grid Template Rows
  w("grid-rows-", "gridTemplateRows"),
  b("grid-rows-(\\d+)", "gridTemplateRows", rs),
  // Grid Row Start / End
  w("row-", "gridRow"),
  b("row-(span)-(\\d+)", "gridRow", ts),
  w("row-start-", "gridRowStart"),
  b("row-start-(auto|\\d+)", "gridRowStart"),
  w("row-end-", "gridRowEnd"),
  b("row-end-(auto|\\d+)", "gridRowEnd"),
  // Grid Auto Flow
  b("grid-flow-((row|col)(-dense)?)", "gridAutoFlow", (e) => wt(Qr(e))),
  b("grid-flow-(dense)", "gridAutoFlow"),
  // Grid Auto Columns
  w("auto-cols-", "gridAutoColumns"),
  // Grid Auto Rows
  w("auto-rows-", "gridAutoRows"),
  // Gap
  w("gap-x(?:$|-)", "gap", "columnGap"),
  w("gap-y(?:$|-)", "gap", "rowGap"),
  w("gap(?:$|-)", "gap"),
  /* BOX ALIGNMENT */
  // Justify Items
  // Justify Self
  "(justify-(?:items|self))-",
  // Justify Content
  b("justify-", "justifyContent", Yr),
  // Align Content
  // Align Items
  // Align Self
  b("(content|items|self)-", (e) => ({
    ["align-" + e[1]]: Yr(e)
  })),
  // Place Content
  // Place Items
  // Place Self
  b("(place-(content|items|self))-", ({ 1: e, $$: t }) => ({
    [e]: ("wun".includes(t[3]) ? "space-" : "") + t
  })),
  /* SPACING */
  // Padding
  w("p([xytrbl])?(?:$|-)", "padding", He("padding")),
  // Margin
  w("-?m([xytrbl])?(?:$|-)", "margin", He("margin")),
  // Space Between
  w("-?space-(x|y)(?:$|-)", "space", ({ 1: e, _: t }) => ({
    "&>:not([hidden])~:not([hidden])": {
      [`--tw-space-${e}-reverse`]: "0",
      ["margin-" + {
        y: "top",
        x: "left"
      }[e]]: `calc(${t} * calc(1 - var(--tw-space-${e}-reverse)))`,
      ["margin-" + {
        y: "bottom",
        x: "right"
      }[e]]: `calc(${t} * var(--tw-space-${e}-reverse))`
    }
  })),
  b("space-(x|y)-reverse", ({ 1: e }) => ({
    "&>:not([hidden])~:not([hidden])": {
      [`--tw-space-${e}-reverse`]: "1"
    }
  })),
  /* SIZING */
  // Width
  w("w-", "width"),
  // Min-Width
  w("min-w-", "minWidth"),
  // Max-Width
  w("max-w-", "maxWidth"),
  // Height
  w("h-", "height"),
  // Min-Height
  w("min-h-", "minHeight"),
  // Max-Height
  w("max-h-", "maxHeight"),
  /* TYPOGRAPHY */
  // Font Weight
  w("font-", "fontWeight"),
  // Font Family
  w("font-", "fontFamily", ({ _: e }) => typeof (e = Ut(e))[1] == "string" ? {
    fontFamily: se(e)
  } : {
    fontFamily: se(e[0]),
    ...e[1]
  }),
  // Font Smoothing
  b("antialiased", {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale"
  }),
  b("subpixel-antialiased", {
    WebkitFontSmoothing: "auto",
    MozOsxFontSmoothing: "auto"
  }),
  // Font Style
  b("italic", "fontStyle"),
  b("not-italic", {
    fontStyle: "normal"
  }),
  // Font Variant Numeric
  b("(ordinal|slashed-zero|(normal|lining|oldstyle|proportional|tabular)-nums|(diagonal|stacked)-fractions)", ({ 1: e, 2: t = "", 3: r }) => (
    // normal-nums
    t == "normal" ? {
      fontVariantNumeric: "normal"
    } : {
      ["--tw-" + (r ? (
        // diagonal-fractions, stacked-fractions
        "numeric-fraction"
      ) : "pt".includes(t[0]) ? (
        // proportional-nums, tabular-nums
        "numeric-spacing"
      ) : t ? (
        // lining-nums, oldstyle-nums
        "numeric-figure"
      ) : (
        // ordinal, slashed-zero
        e
      ))]: e,
      fontVariantNumeric: "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)",
      ...ge({
        "--tw-ordinal": "var(--tw-empty,/*!*/ /*!*/)",
        "--tw-slashed-zero": "var(--tw-empty,/*!*/ /*!*/)",
        "--tw-numeric-figure": "var(--tw-empty,/*!*/ /*!*/)",
        "--tw-numeric-spacing": "var(--tw-empty,/*!*/ /*!*/)",
        "--tw-numeric-fraction": "var(--tw-empty,/*!*/ /*!*/)"
      })
    }
  )),
  // Letter Spacing
  w("tracking-", "letterSpacing"),
  // Line Height
  w("leading-", "lineHeight"),
  // List Style Position
  b("list-(inside|outside)", "listStylePosition"),
  // List Style Type
  w("list-", "listStyleType"),
  b("list-", "listStyleType"),
  // Placeholder Opacity
  w("placeholder-opacity-", "placeholderOpacity", ({ _: e }) => ({
    "&::placeholder": {
      "--tw-placeholder-opacity": e
    }
  })),
  // Placeholder Color
  I("placeholder-", {
    property: "color",
    selector: "&::placeholder"
  }),
  // Text Alignment
  b("text-(left|center|right|justify|start|end)", "textAlign"),
  b("text-(ellipsis|clip)", "textOverflow"),
  // Text Opacity
  w("text-opacity-", "textOpacity", "--tw-text-opacity"),
  // Text Color
  I("text-", {
    property: "color"
  }),
  // Font Size
  w("text-", "fontSize", ({ _: e }) => typeof e == "string" ? {
    fontSize: e
  } : {
    fontSize: e[0],
    ...typeof e[1] == "string" ? {
      lineHeight: e[1]
    } : e[1]
  }),
  // Text Indent
  w("indent-", "textIndent"),
  // Text Decoration
  b("(overline|underline|line-through)", "textDecorationLine"),
  b("no-underline", {
    textDecorationLine: "none"
  }),
  // Text Underline offset
  w("underline-offset-", "textUnderlineOffset"),
  // Text Decoration Color
  I("decoration-", {
    section: "textDecorationColor",
    opacityVariable: !1,
    opacitySection: "opacity"
  }),
  // Text Decoration Thickness
  w("decoration-", "textDecorationThickness"),
  // Text Decoration Style
  b("decoration-", "textDecorationStyle"),
  // Text Transform
  b("(uppercase|lowercase|capitalize)", "textTransform"),
  b("normal-case", {
    textTransform: "none"
  }),
  // Text Overflow
  b("truncate", {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  }),
  // Vertical Alignment
  b("align-", "verticalAlign"),
  // Whitespace
  b("whitespace-", "whiteSpace"),
  // Word Break
  b("break-normal", {
    wordBreak: "normal",
    overflowWrap: "normal"
  }),
  b("break-words", {
    overflowWrap: "break-word"
  }),
  b("break-all", {
    wordBreak: "break-all"
  }),
  b("break-keep", {
    wordBreak: "keep-all"
  }),
  // Caret Color
  I("caret-", {
    // section: 'caretColor',
    opacityVariable: !1,
    opacitySection: "opacity"
  }),
  // Accent Color
  I("accent-", {
    // section: 'accentColor',
    opacityVariable: !1,
    opacitySection: "opacity"
  }),
  // Gradient Color Stops
  b("bg-gradient-to-([trbl]|[tb][rl])", "backgroundImage", ({ 1: e }) => `linear-gradient(to ${ke(e, " ")},var(--tw-gradient-stops))`),
  I("from-", {
    section: "gradientColorStops",
    opacityVariable: !1,
    opacitySection: "opacity"
  }, ({ _: e }) => ({
    "--tw-gradient-from": e.value,
    "--tw-gradient-to": e.color({
      opacityValue: "0"
    }),
    "--tw-gradient-stops": "var(--tw-gradient-from),var(--tw-gradient-to)"
  })),
  I("via-", {
    section: "gradientColorStops",
    opacityVariable: !1,
    opacitySection: "opacity"
  }, ({ _: e }) => ({
    "--tw-gradient-to": e.color({
      opacityValue: "0"
    }),
    "--tw-gradient-stops": `var(--tw-gradient-from),${e.value},var(--tw-gradient-to)`
  })),
  I("to-", {
    section: "gradientColorStops",
    property: "--tw-gradient-to",
    opacityVariable: !1,
    opacitySection: "opacity"
  }),
  /* BACKGROUNDS */
  // Background Attachment
  b("bg-(fixed|local|scroll)", "backgroundAttachment"),
  // Background Origin
  b("bg-origin-(border|padding|content)", "backgroundOrigin", ({ 1: e }) => e + "-box"),
  // Background Repeat
  b([
    "bg-(no-repeat|repeat(-[xy])?)",
    "bg-repeat-(round|space)"
  ], "backgroundRepeat"),
  // Background Blend Mode
  b("bg-blend-", "backgroundBlendMode"),
  // Background Clip
  b("bg-clip-(border|padding|content|text)", "backgroundClip", ({ 1: e }) => e + (e == "text" ? "" : "-box")),
  // Background Opacity
  w("bg-opacity-", "backgroundOpacity", "--tw-bg-opacity"),
  // Background Color
  // bg-${backgroundColor}/${backgroundOpacity}
  I("bg-", {
    section: "backgroundColor"
  }),
  // Background Image
  // supported arbitrary types are: length, color, angle, list
  w("bg-", "backgroundImage"),
  // Background Position
  w("bg-", "backgroundPosition"),
  b("bg-(top|bottom|center|(left|right)(-(top|bottom))?)", "backgroundPosition", wt),
  // Background Size
  w("bg-", "backgroundSize"),
  /* BORDERS */
  // Border Radius
  w("rounded(?:$|-)", "borderRadius"),
  w("rounded-([trbl]|[tb][rl])(?:$|-)", "borderRadius", ({ 1: e, _: t }) => {
    let r = {
      t: [
        "tl",
        "tr"
      ],
      r: [
        "tr",
        "br"
      ],
      b: [
        "bl",
        "br"
      ],
      l: [
        "bl",
        "tl"
      ]
    }[e] || [
      e,
      e
    ];
    return {
      [`border-${ke(r[0])}-radius`]: t,
      [`border-${ke(r[1])}-radius`]: t
    };
  }),
  // Border Collapse
  b("border-(collapse|separate)", "borderCollapse"),
  // Border Opacity
  w("border-opacity(?:$|-)", "borderOpacity", "--tw-border-opacity"),
  // Border Style
  b("border-(solid|dashed|dotted|double|none)", "borderStyle"),
  // Border Spacing
  w("border-spacing(-[xy])?(?:$|-)", "borderSpacing", ({ 1: e, _: t }) => ({
    ...ge({
      "--tw-border-spacing-x": "0",
      "--tw-border-spacing-y": "0"
    }),
    ["--tw-border-spacing" + (e || "-x")]: t,
    ["--tw-border-spacing" + (e || "-y")]: t,
    "border-spacing": "var(--tw-border-spacing-x) var(--tw-border-spacing-y)"
  })),
  // Border Color
  I("border-([xytrbl])-", {
    section: "borderColor"
  }, He("border", "Color")),
  I("border-"),
  // Border Width
  w("border-([xytrbl])(?:$|-)", "borderWidth", He("border", "Width")),
  w("border(?:$|-)", "borderWidth"),
  // Divide Opacity
  w("divide-opacity(?:$|-)", "divideOpacity", ({ _: e }) => ({
    "&>:not([hidden])~:not([hidden])": {
      "--tw-divide-opacity": e
    }
  })),
  // Divide Style
  b("divide-(solid|dashed|dotted|double|none)", ({ 1: e }) => ({
    "&>:not([hidden])~:not([hidden])": {
      borderStyle: e
    }
  })),
  // Divide Width
  b("divide-([xy]-reverse)", ({ 1: e }) => ({
    "&>:not([hidden])~:not([hidden])": {
      ["--tw-divide-" + e]: "1"
    }
  })),
  w("divide-([xy])(?:$|-)", "divideWidth", ({ 1: e, _: t }) => {
    let r = {
      x: "lr",
      y: "tb"
    }[e];
    return {
      "&>:not([hidden])~:not([hidden])": {
        [`--tw-divide-${e}-reverse`]: "0",
        [`border-${ke(r[0])}Width`]: `calc(${t} * calc(1 - var(--tw-divide-${e}-reverse)))`,
        [`border-${ke(r[1])}Width`]: `calc(${t} * var(--tw-divide-${e}-reverse))`
      }
    };
  }),
  // Divide Color
  I("divide-", {
    // section: $0.replace('-', 'Color') -> 'divideColor'
    property: "borderColor",
    // opacityVariable: '--tw-border-opacity',
    // opacitySection: section.replace('Color', 'Opacity') -> 'divideOpacity'
    selector: "&>:not([hidden])~:not([hidden])"
  }),
  // Ring Offset Opacity
  w("ring-opacity(?:$|-)", "ringOpacity", "--tw-ring-opacity"),
  // Ring Offset Color
  I("ring-offset-", {
    // section: 'ringOffsetColor',
    property: "--tw-ring-offset-color",
    opacityVariable: !1
  }),
  // opacitySection: section.replace('Color', 'Opacity') -> 'ringOffsetOpacity'
  // Ring Offset Width
  w("ring-offset(?:$|-)", "ringOffsetWidth", "--tw-ring-offset-width"),
  // Ring Inset
  b("ring-inset", {
    "--tw-ring-inset": "inset"
  }),
  // Ring Color
  I("ring-", {
    // section: 'ringColor',
    property: "--tw-ring-color"
  }),
  // opacityVariable: '--tw-ring-opacity',
  // opacitySection: section.replace('Color', 'Opacity') -> 'ringOpacity'
  // Ring Width
  w("ring(?:$|-)", "ringWidth", ({ _: e }, { theme: t }) => ({
    ...ge({
      "--tw-ring-offset-shadow": "0 0 #0000",
      "--tw-ring-shadow": "0 0 #0000",
      "--tw-shadow": "0 0 #0000",
      "--tw-shadow-colored": "0 0 #0000",
      // Within own declaration to have the defaults above to be merged with defaults from shadow
      "&": {
        "--tw-ring-inset": "var(--tw-empty,/*!*/ /*!*/)",
        "--tw-ring-offset-width": t("ringOffsetWidth", "", "0px"),
        "--tw-ring-offset-color": Se(t("ringOffsetColor", "", "#fff")),
        "--tw-ring-color": Se(t("ringColor", "", "#93c5fd"), {
          opacityVariable: "--tw-ring-opacity"
        }),
        "--tw-ring-opacity": t("ringOpacity", "", "0.5")
      }
    }),
    "--tw-ring-offset-shadow": "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
    "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 calc(${e} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
    boxShadow: "var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)"
  })),
  /* EFFECTS */
  // Box Shadow Color
  I("shadow-", {
    section: "boxShadowColor",
    opacityVariable: !1,
    opacitySection: "opacity"
  }, ({ _: e }) => ({
    "--tw-shadow-color": e.value,
    "--tw-shadow": "var(--tw-shadow-colored)"
  })),
  // Box Shadow
  w("shadow(?:$|-)", "boxShadow", ({ _: e }) => ({
    ...ge({
      "--tw-ring-offset-shadow": "0 0 #0000",
      "--tw-ring-shadow": "0 0 #0000",
      "--tw-shadow": "0 0 #0000",
      "--tw-shadow-colored": "0 0 #0000"
    }),
    "--tw-shadow": se(e),
    // replace all colors with reference to --tw-shadow-colored
    // this matches colors after non-comma char (keyword, offset) before comma or the end
    "--tw-shadow-colored": se(e).replace(/([^,]\s+)(?:#[a-f\d]+|(?:(?:hsl|rgb)a?|hwb|lab|lch|color|var)\(.+?\)|[a-z]+)(,|$)/g, "$1var(--tw-shadow-color)$2"),
    boxShadow: "var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)"
  })),
  // Opacity
  w("(opacity)-"),
  /*, 'opacity' */
  // Mix Blend Mode
  b("mix-blend-", "mixBlendMode"),
  /* FILTERS */
  ...es(),
  ...es("backdrop-"),
  /* TRANSITIONS AND ANIMATION */
  // Transition Property
  w("transition(?:$|-)", "transitionProperty", (e, { theme: t }) => ({
    transitionProperty: se(e),
    transitionTimingFunction: e._ == "none" ? void 0 : se(t("transitionTimingFunction", "")),
    transitionDuration: e._ == "none" ? void 0 : se(t("transitionDuration", ""))
  })),
  // Transition Duration
  w("duration(?:$|-)", "transitionDuration", "transitionDuration", se),
  // Transition Timing Function
  w("ease(?:$|-)", "transitionTimingFunction", "transitionTimingFunction", se),
  // Transition Delay
  w("delay(?:$|-)", "transitionDelay", "transitionDelay", se),
  w("animate(?:$|-)", "animation", (e, { theme: t, h: r, e: s }) => {
    let i = se(e), n = i.split(" "), o = t("keyframes", n[0]);
    return o ? {
      ["@keyframes " + (n[0] = s(r(n[0])))]: o,
      animation: n.join(" ")
    } : {
      animation: i
    };
  }),
  /* TRANSFORMS */
  // Transform
  "(transform)-(none)",
  b("transform", fr),
  b("transform-(cpu|gpu)", ({ 1: e }) => ({
    "--tw-transform": ei(e == "gpu")
  })),
  // Scale
  w("scale(-[xy])?-", "scale", ({ 1: e, _: t }) => ({
    ["--tw-scale" + (e || "-x")]: t,
    ["--tw-scale" + (e || "-y")]: t,
    ...fr()
  })),
  // Rotate
  w("-?(rotate)-", "rotate", Yt),
  // Translate
  w("-?(translate-[xy])-", "translate", Yt),
  // Skew
  w("-?(skew-[xy])-", "skew", Yt),
  // Transform Origin
  b("origin-(center|((top|bottom)(-(left|right))?)|left|right)", "transformOrigin", wt),
  /* INTERACTIVITY */
  // Appearance
  "(appearance)-",
  // Columns
  w("(columns)-"),
  /*, 'columns' */
  "(columns)-(\\d+)",
  // Break Before, After and Inside
  "(break-(?:before|after|inside))-",
  // Cursor
  w("(cursor)-"),
  /*, 'cursor' */
  "(cursor)-",
  // Scroll Snap Type
  b("snap-(none)", "scroll-snap-type"),
  b("snap-(x|y|both)", ({ 1: e }) => ({
    ...ge({
      "--tw-scroll-snap-strictness": "proximity"
    }),
    "scroll-snap-type": e + " var(--tw-scroll-snap-strictness)"
  })),
  b("snap-(mandatory|proximity)", "--tw-scroll-snap-strictness"),
  // Scroll Snap Align
  b("snap-(?:(start|end|center)|align-(none))", "scroll-snap-align"),
  // Scroll Snap Stop
  b("snap-(normal|always)", "scroll-snap-stop"),
  b("scroll-(auto|smooth)", "scroll-behavior"),
  // Scroll Margin
  // Padding
  w("scroll-p([xytrbl])?(?:$|-)", "padding", He("scroll-padding")),
  // Margin
  w("-?scroll-m([xytrbl])?(?:$|-)", "scroll-margin", He("scroll-margin")),
  // Touch Action
  b("touch-(auto|none|manipulation)", "touch-action"),
  b("touch-(pinch-zoom|pan-(?:(x|left|right)|(y|up|down)))", ({ 1: e, 2: t, 3: r }) => ({
    ...ge({
      "--tw-pan-x": "var(--tw-empty,/*!*/ /*!*/)",
      "--tw-pan-y": "var(--tw-empty,/*!*/ /*!*/)",
      "--tw-pinch-zoom": "var(--tw-empty,/*!*/ /*!*/)",
      "--tw-touch-action": "var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)"
    }),
    // x, left, right -> pan-x
    // y, up, down -> pan-y
    // -> pinch-zoom
    [`--tw-${t ? "pan-x" : r ? "pan-y" : e}`]: e,
    "touch-action": "var(--tw-touch-action)"
  })),
  // Outline Style
  b("outline-none", {
    outline: "2px solid transparent",
    "outline-offset": "2px"
  }),
  b("outline", {
    outlineStyle: "solid"
  }),
  b("outline-(dashed|dotted|double)", "outlineStyle"),
  // Outline Offset
  w("-?(outline-offset)-"),
  /*, 'outlineOffset'*/
  // Outline Color
  I("outline-", {
    opacityVariable: !1,
    opacitySection: "opacity"
  }),
  // Outline Width
  w("outline-", "outlineWidth"),
  // Pointer Events
  "(pointer-events)-",
  // Will Change
  w("(will-change)-"),
  /*, 'willChange' */
  "(will-change)-",
  // Resize
  [
    "resize(?:-(none|x|y))?",
    "resize",
    ({ 1: e }) => ({
      x: "horizontal",
      y: "vertical"
    })[e] || e || "both"
  ],
  // User Select
  b("select-(none|text|all|auto)", "userSelect"),
  /* SVG */
  // Fill, Stroke
  I("fill-", {
    section: "fill",
    opacityVariable: !1,
    opacitySection: "opacity"
  }),
  I("stroke-", {
    section: "stroke",
    opacityVariable: !1,
    opacitySection: "opacity"
  }),
  // Stroke Width
  w("stroke-", "strokeWidth"),
  /* ACCESSIBILITY */
  // Screen Readers
  b("sr-only", {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    clip: "rect(0,0,0,0)",
    borderWidth: "0"
  }),
  b("not-sr-only", {
    position: "static",
    width: "auto",
    height: "auto",
    padding: "0",
    margin: "0",
    overflow: "visible",
    whiteSpace: "normal",
    clip: "auto"
  })
];
function wt(e) {
  return (typeof e == "string" ? e : e[1]).replace(/-/g, " ").trim();
}
function Qr(e) {
  return (typeof e == "string" ? e : e[1]).replace("col", "column");
}
function ke(e, t = "-") {
  let r = [];
  for (let s of e) r.push({
    t: "top",
    r: "right",
    b: "bottom",
    l: "left"
  }[s]);
  return r.join(t);
}
function se(e) {
  return e && "" + (e._ || e);
}
function Yr({ $$: e }) {
  return ({
    // /* aut*/ o: '',
    /* sta*/
    r: (
      /*t*/
      "flex-"
    ),
    /* end*/
    "": "flex-",
    // /* cen*/ t /*er*/: '',
    /* bet*/
    w: (
      /*een*/
      "space-"
    ),
    /* aro*/
    u: (
      /*nd*/
      "space-"
    ),
    /* eve*/
    n: (
      /*ly*/
      "space-"
    )
  }[e[3] || ""] || "") + e;
}
function He(e, t = "") {
  return ({ 1: r, _: s }) => {
    let i = {
      x: "lr",
      y: "tb"
    }[r] || r + r;
    return i ? {
      ...xt(e + "-" + ke(i[0]) + t, s),
      ...xt(e + "-" + ke(i[1]) + t, s)
    } : xt(e + t, s);
  };
}
function es(e = "") {
  let t = [
    "blur",
    "brightness",
    "contrast",
    "grayscale",
    "hue-rotate",
    "invert",
    e && "opacity",
    "saturate",
    "sepia",
    !e && "drop-shadow"
  ].filter(Boolean), r = {};
  for (let s of t) r[`--tw-${e}${s}`] = "var(--tw-empty,/*!*/ /*!*/)";
  return r = {
    // move defaults
    ...ge(r),
    // add default filter which allows standalone usage
    [`${e}filter`]: t.map((s) => `var(--tw-${e}${s})`).join(" ")
  }, [
    `(${e}filter)-(none)`,
    b(`${e}filter`, r),
    ...t.map((s) => w(
      // hue-rotate can be negated
      `${s[0] == "h" ? "-?" : ""}(${e}${s})(?:$|-)`,
      s,
      ({ 1: i, _: n }) => ({
        [`--tw-${i}`]: Ut(n).map((o) => `${s}(${o})`).join(" "),
        ...r
      })
    ))
  ];
}
function Yt({ 1: e, _: t }) {
  return {
    ["--tw-" + e]: t,
    ...fr()
  };
}
function fr() {
  return {
    ...ge({
      "--tw-translate-x": "0",
      "--tw-translate-y": "0",
      "--tw-rotate": "0",
      "--tw-skew-x": "0",
      "--tw-skew-y": "0",
      "--tw-scale-x": "1",
      "--tw-scale-y": "1",
      "--tw-transform": ei()
    }),
    transform: "var(--tw-transform)"
  };
}
function ei(e) {
  return [
    e ? (
      // -gpu
      "translate3d(var(--tw-translate-x),var(--tw-translate-y),0)"
    ) : "translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y))",
    "rotate(var(--tw-rotate))",
    "skewX(var(--tw-skew-x))",
    "skewY(var(--tw-skew-y))",
    "scaleX(var(--tw-scale-x))",
    "scaleY(var(--tw-scale-y))"
  ].join(" ");
}
function ts({ 1: e, 2: t }) {
  return `${e} ${t} / ${e} ${t}`;
}
function rs({ 1: e }) {
  return `repeat(${e},minmax(0,1fr))`;
}
function ge(e) {
  return {
    "@layer defaults": {
      "*,::before,::after": e,
      "::backdrop": e
    }
  };
}
let ao = [
  [
    "sticky",
    "@supports ((position: -webkit-sticky) or (position:sticky))"
  ],
  [
    "motion-reduce",
    "@media (prefers-reduced-motion:reduce)"
  ],
  [
    "motion-safe",
    "@media (prefers-reduced-motion:no-preference)"
  ],
  [
    "print",
    "@media print"
  ],
  [
    "(portrait|landscape)",
    ({ 1: e }) => `@media (orientation:${e})`
  ],
  [
    "contrast-(more|less)",
    ({ 1: e }) => `@media (prefers-contrast:${e})`
  ],
  [
    "(first-(letter|line)|placeholder|backdrop|before|after)",
    ({ 1: e }) => `&::${e}`
  ],
  [
    "(marker|selection)",
    ({ 1: e }) => `& *::${e},&::${e}`
  ],
  [
    "file",
    "&::file-selector-button"
  ],
  [
    "(first|last|only)",
    ({ 1: e }) => `&:${e}-child`
  ],
  [
    "even",
    "&:nth-child(2n)"
  ],
  [
    "odd",
    "&:nth-child(odd)"
  ],
  [
    "open",
    "&[open]"
  ],
  // All other pseudo classes are already supported by twind
  [
    "(aria|data)-",
    ({
      1: e,
      /* aria or data */
      $$: t
    }, r) => t && `&[${e}-${// aria-asc or data-checked -> from theme
    r.theme(e, t) || // aria-[...] or data-[...]
    we(t, "", r) || // default handling
    `${t}="true"`}]`
  ],
  /* Styling based on parent and peer state */
  // Groups classes like: group-focus and group-hover
  // these need to add a marker selector with the pseudo class
  // => '.group:focus .group-focus:selector'
  [
    "((group|peer)(~[^-[]+)?)(-\\[(.+)]|[-[].+?)(\\/.+)?",
    ({ 2: e, 3: t = "", 4: r, 5: s = "", 6: i = t }, { e: n, h: o, v: a }) => {
      let c = at(s) || (r[0] == "[" ? r : a(r.slice(1)));
      return `${(c.includes("&") ? c : "&" + c).replace(/&/g, `:merge(.${n(o(e + i))})`)}${e[0] == "p" ? "~" : " "}&`;
    }
  ],
  // direction variants
  [
    "(ltr|rtl)",
    ({ 1: e }) => `[dir="${e}"] &`
  ],
  [
    "supports-",
    ({ $$: e }, t) => {
      if (e && (e = t.theme("supports", e) || we(e, "", t)), e) return e.includes(":") || (e += ":var(--tw)"), /^\w*\s*\(/.test(e) || (e = `(${e})`), // Chrome has a bug where `(condtion1)or(condition2)` is not valid
      // But `(condition1) or (condition2)` is supported.
      `@supports ${e.replace(/\b(and|or|not)\b/g, " $1 ").trim()}`;
    }
  ],
  [
    "max-",
    ({ $$: e }, t) => {
      if (e && (e = t.theme("screens", e) || we(e, "", t)), typeof e == "string") return `@media not all and (min-width:${e})`;
    }
  ],
  [
    "min-",
    ({ $$: e }, t) => (e && (e = we(e, "", t)), e && `@media (min-width:${e})`)
  ],
  // Arbitrary variants
  [
    /^\[(.+)]$/,
    ({ 1: e }) => /[&@]/.test(e) && at(e).replace(/[}]+$/, "").split("{")
  ]
];
function lo({ colors: e, disablePreflight: t } = {}) {
  return {
    // allow other preflight to run
    preflight: t ? void 0 : Yn,
    theme: {
      ...ur,
      colors: {
        inherit: "inherit",
        current: "currentColor",
        transparent: "transparent",
        black: "#000",
        white: "#fff",
        ...e
      }
    },
    variants: ao,
    rules: oo,
    finalize(r) {
      return (
        // automatically add `content: ''` to before and after so you don’t have to specify it unless you want a different value
        // ignore global, preflight, and auto added rules
        r.n && // only if there are declarations
        r.d && // and it has a ::before or ::after selector
        r.r.some((s) => /^&::(before|after)$/.test(s)) && // there is no content property yet
        !/(^|;)content:/.test(r.d) ? {
          ...r,
          d: "content:var(--tw-content);" + r.d
        } : r
      );
    }
  };
}
let co = {
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  900: "#0f172a"
}, uo = {
  50: "#f9fafb",
  100: "#f3f4f6",
  200: "#e5e7eb",
  300: "#d1d5db",
  400: "#9ca3af",
  500: "#6b7280",
  600: "#4b5563",
  700: "#374151",
  800: "#1f2937",
  900: "#111827"
}, ho = {
  50: "#fafafa",
  100: "#f4f4f5",
  200: "#e4e4e7",
  300: "#d4d4d8",
  400: "#a1a1aa",
  500: "#71717a",
  600: "#52525b",
  700: "#3f3f46",
  800: "#27272a",
  900: "#18181b"
}, fo = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#e5e5e5",
  300: "#d4d4d4",
  400: "#a3a3a3",
  500: "#737373",
  600: "#525252",
  700: "#404040",
  800: "#262626",
  900: "#171717"
}, po = {
  50: "#fafaf9",
  100: "#f5f5f4",
  200: "#e7e5e4",
  300: "#d6d3d1",
  400: "#a8a29e",
  500: "#78716c",
  600: "#57534e",
  700: "#44403c",
  800: "#292524",
  900: "#1c1917"
}, mo = {
  50: "#fef2f2",
  100: "#fee2e2",
  200: "#fecaca",
  300: "#fca5a5",
  400: "#f87171",
  500: "#ef4444",
  600: "#dc2626",
  700: "#b91c1c",
  800: "#991b1b",
  900: "#7f1d1d"
}, go = {
  50: "#fff7ed",
  100: "#ffedd5",
  200: "#fed7aa",
  300: "#fdba74",
  400: "#fb923c",
  500: "#f97316",
  600: "#ea580c",
  700: "#c2410c",
  800: "#9a3412",
  900: "#7c2d12"
}, bo = {
  50: "#fffbeb",
  100: "#fef3c7",
  200: "#fde68a",
  300: "#fcd34d",
  400: "#fbbf24",
  500: "#f59e0b",
  600: "#d97706",
  700: "#b45309",
  800: "#92400e",
  900: "#78350f"
}, wo = {
  50: "#fefce8",
  100: "#fef9c3",
  200: "#fef08a",
  300: "#fde047",
  400: "#facc15",
  500: "#eab308",
  600: "#ca8a04",
  700: "#a16207",
  800: "#854d0e",
  900: "#713f12"
}, yo = {
  50: "#f7fee7",
  100: "#ecfccb",
  200: "#d9f99d",
  300: "#bef264",
  400: "#a3e635",
  500: "#84cc16",
  600: "#65a30d",
  700: "#4d7c0f",
  800: "#3f6212",
  900: "#365314"
}, vo = {
  50: "#f0fdf4",
  100: "#dcfce7",
  200: "#bbf7d0",
  300: "#86efac",
  400: "#4ade80",
  500: "#22c55e",
  600: "#16a34a",
  700: "#15803d",
  800: "#166534",
  900: "#14532d"
}, xo = {
  50: "#ecfdf5",
  100: "#d1fae5",
  200: "#a7f3d0",
  300: "#6ee7b7",
  400: "#34d399",
  500: "#10b981",
  600: "#059669",
  700: "#047857",
  800: "#065f46",
  900: "#064e3b"
}, $o = {
  50: "#f0fdfa",
  100: "#ccfbf1",
  200: "#99f6e4",
  300: "#5eead4",
  400: "#2dd4bf",
  500: "#14b8a6",
  600: "#0d9488",
  700: "#0f766e",
  800: "#115e59",
  900: "#134e4a"
}, _o = {
  50: "#ecfeff",
  100: "#cffafe",
  200: "#a5f3fc",
  300: "#67e8f9",
  400: "#22d3ee",
  500: "#06b6d4",
  600: "#0891b2",
  700: "#0e7490",
  800: "#155e75",
  900: "#164e63"
}, Co = {
  50: "#f0f9ff",
  100: "#e0f2fe",
  200: "#bae6fd",
  300: "#7dd3fc",
  400: "#38bdf8",
  500: "#0ea5e9",
  600: "#0284c7",
  700: "#0369a1",
  800: "#075985",
  900: "#0c4a6e"
}, ko = {
  50: "#eff6ff",
  100: "#dbeafe",
  200: "#bfdbfe",
  300: "#93c5fd",
  400: "#60a5fa",
  500: "#3b82f6",
  600: "#2563eb",
  700: "#1d4ed8",
  800: "#1e40af",
  900: "#1e3a8a"
}, Ao = {
  50: "#eef2ff",
  100: "#e0e7ff",
  200: "#c7d2fe",
  300: "#a5b4fc",
  400: "#818cf8",
  500: "#6366f1",
  600: "#4f46e5",
  700: "#4338ca",
  800: "#3730a3",
  900: "#312e81"
}, So = {
  50: "#f5f3ff",
  100: "#ede9fe",
  200: "#ddd6fe",
  300: "#c4b5fd",
  400: "#a78bfa",
  500: "#8b5cf6",
  600: "#7c3aed",
  700: "#6d28d9",
  800: "#5b21b6",
  900: "#4c1d95"
}, Eo = {
  50: "#faf5ff",
  100: "#f3e8ff",
  200: "#e9d5ff",
  300: "#d8b4fe",
  400: "#c084fc",
  500: "#a855f7",
  600: "#9333ea",
  700: "#7e22ce",
  800: "#6b21a8",
  900: "#581c87"
}, Ro = {
  50: "#fdf4ff",
  100: "#fae8ff",
  200: "#f5d0fe",
  300: "#f0abfc",
  400: "#e879f9",
  500: "#d946ef",
  600: "#c026d3",
  700: "#a21caf",
  800: "#86198f",
  900: "#701a75"
}, To = {
  50: "#fdf2f8",
  100: "#fce7f3",
  200: "#fbcfe8",
  300: "#f9a8d4",
  400: "#f472b6",
  500: "#ec4899",
  600: "#db2777",
  700: "#be185d",
  800: "#9d174d",
  900: "#831843"
}, Lo = {
  50: "#fff1f2",
  100: "#ffe4e6",
  200: "#fecdd3",
  300: "#fda4af",
  400: "#fb7185",
  500: "#f43f5e",
  600: "#e11d48",
  700: "#be123c",
  800: "#9f1239",
  900: "#881337"
}, Mo = {
  __proto__: null,
  slate: co,
  gray: uo,
  zinc: ho,
  neutral: fo,
  stone: po,
  red: mo,
  orange: go,
  amber: bo,
  yellow: wo,
  lime: yo,
  green: vo,
  emerald: xo,
  teal: $o,
  cyan: _o,
  sky: Co,
  blue: ko,
  indigo: Ao,
  violet: So,
  purple: Eo,
  fuchsia: Ro,
  pink: To,
  rose: Lo
};
function Oo({ disablePreflight: e } = {}) {
  return lo({
    colors: Mo,
    disablePreflight: e
  });
}
let Uo = [
  [
    "-webkit-",
    1
  ],
  // 0b001
  [
    "-moz-",
    2
  ],
  // 0b010
  [
    "-ms-",
    4
  ]
];
function zo() {
  return ({ stringify: e }) => ({
    stringify(t, r, s) {
      let i = "", n = Ls(t);
      n && (i += e(n, r, s) + ";");
      let o = Ms(t), a = Os(t, r);
      for (let c of Uo)
        o & c[1] && (i += e(c[0] + t, r, s) + ";"), a & c[1] && (i += e(t, c[0] + r, s) + ";");
      return i + e(t, r, s);
    }
  });
}
var Do = "#000", Ho = "#fff", Bo = {
  50: "#fff1f2",
  100: "#ffe4e6",
  200: "#fecdd3",
  300: "#fda4af",
  400: "#fb7185",
  500: "#f43f5e",
  600: "#e11d48",
  700: "#be123c",
  800: "#9f1239",
  900: "#881337"
}, Fo = {
  50: "#fdf2f8",
  100: "#fce7f3",
  200: "#fbcfe8",
  300: "#f9a8d4",
  400: "#f472b6",
  500: "#ec4899",
  600: "#db2777",
  700: "#be185d",
  800: "#9d174d",
  900: "#831843"
}, jo = {
  50: "#fdf4ff",
  100: "#fae8ff",
  200: "#f5d0fe",
  300: "#f0abfc",
  400: "#e879f9",
  500: "#d946ef",
  600: "#c026d3",
  700: "#a21caf",
  800: "#86198f",
  900: "#701a75"
}, No = {
  50: "#faf5ff",
  100: "#f3e8ff",
  200: "#e9d5ff",
  300: "#d8b4fe",
  400: "#c084fc",
  500: "#a855f7",
  600: "#9333ea",
  700: "#7e22ce",
  800: "#6b21a8",
  900: "#581c87"
}, Po = {
  50: "#f5f3ff",
  100: "#ede9fe",
  200: "#ddd6fe",
  300: "#c4b5fd",
  400: "#a78bfa",
  500: "#8b5cf6",
  600: "#7c3aed",
  700: "#6d28d9",
  800: "#5b21b6",
  900: "#4c1d95"
}, Io = {
  50: "#eef2ff",
  100: "#e0e7ff",
  200: "#c7d2fe",
  300: "#a5b4fc",
  400: "#818cf8",
  500: "#6366f1",
  600: "#4f46e5",
  700: "#4338ca",
  800: "#3730a3",
  900: "#312e81"
}, Vo = {
  50: "#eff6ff",
  100: "#dbeafe",
  200: "#bfdbfe",
  300: "#93c5fd",
  400: "#60a5fa",
  500: "#3b82f6",
  600: "#2563eb",
  700: "#1d4ed8",
  800: "#1e40af",
  900: "#1e3a8a"
}, qo = {
  50: "#f0f9ff",
  100: "#e0f2fe",
  200: "#bae6fd",
  300: "#7dd3fc",
  400: "#38bdf8",
  500: "#0ea5e9",
  600: "#0284c7",
  700: "#0369a1",
  800: "#075985",
  900: "#0c4a6e"
}, Wo = {
  50: "#ecfeff",
  100: "#cffafe",
  200: "#a5f3fc",
  300: "#67e8f9",
  400: "#22d3ee",
  500: "#06b6d4",
  600: "#0891b2",
  700: "#0e7490",
  800: "#155e75",
  900: "#164e63"
}, Zo = {
  50: "#f0f9ff",
  100: "#e0f2fe",
  200: "#bae6fd",
  300: "#7dd3fc",
  400: "#38bdf8",
  500: "#0ea5e9",
  600: "#0284c7",
  700: "#0369a1",
  800: "#075985",
  900: "#0c4a6e"
}, Go = {
  50: "#f0fdfa",
  100: "#ccfbf1",
  200: "#99f6e4",
  300: "#5eead4",
  400: "#2dd4bf",
  500: "#14b8a6",
  600: "#0d9488",
  700: "#0f766e",
  800: "#115e59",
  900: "#134e4a"
}, Ko = {
  50: "#ecfdf5",
  100: "#d1fae5",
  200: "#a7f3d0",
  300: "#6ee7b7",
  400: "#34d399",
  500: "#10b981",
  600: "#059669",
  700: "#047857",
  800: "#065f46",
  900: "#064e3b"
}, Jo = {
  50: "#f0fdf4",
  100: "#dcfce7",
  200: "#bbf7d0",
  300: "#86efac",
  400: "#4ade80",
  500: "#22c55e",
  600: "#16a34a",
  700: "#15803d",
  800: "#166534",
  900: "#14532d"
}, Xo = {
  50: "#f7fee7",
  100: "#ecfccb",
  200: "#d9f99d",
  300: "#bef264",
  400: "#a3e635",
  500: "#84cc16",
  600: "#65a30d",
  700: "#4d7c0f",
  800: "#3f6212",
  900: "#365314"
}, Qo = {
  50: "#fefce8",
  100: "#fef9c3",
  200: "#fef08a",
  300: "#fde047",
  400: "#facc15",
  500: "#eab308",
  600: "#ca8a04",
  700: "#a16207",
  800: "#854d0e",
  900: "#713f12"
}, Yo = {
  50: "#fffbeb",
  100: "#fef3c7",
  200: "#fde68a",
  300: "#fcd34d",
  400: "#fbbf24",
  500: "#f59e0b",
  600: "#d97706",
  700: "#b45309",
  800: "#92400e",
  900: "#78350f"
}, ea = {
  50: "#fff7ed",
  100: "#ffedd5",
  200: "#fed7aa",
  300: "#fdba74",
  400: "#fb923c",
  500: "#f97316",
  600: "#ea580c",
  700: "#c2410c",
  800: "#9a3412",
  900: "#7c2d12"
}, ta = {
  50: "#fef2f2",
  100: "#fee2e2",
  200: "#fecaca",
  300: "#fca5a5",
  400: "#f87171",
  500: "#ef4444",
  600: "#dc2626",
  700: "#b91c1c",
  800: "#991b1b",
  900: "#7f1d1d"
}, ra = {
  50: "#fafaf9",
  100: "#f5f5f4",
  200: "#e7e5e4",
  300: "#d6d3d1",
  400: "#a8a29e",
  500: "#78716c",
  600: "#57534e",
  700: "#44403c",
  800: "#292524",
  900: "#1c1917"
}, sa = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#e5e5e5",
  300: "#d4d4d4",
  400: "#a3a3a3",
  500: "#737373",
  600: "#525252",
  700: "#404040",
  800: "#262626",
  900: "#171717"
}, ia = {
  50: "#fafafa",
  100: "#f4f4f5",
  200: "#e4e4e7",
  300: "#d4d4d8",
  400: "#a1a1aa",
  500: "#71717a",
  600: "#52525b",
  700: "#3f3f46",
  800: "#27272a",
  900: "#18181b"
}, na = {
  50: "#f9fafb",
  100: "#f3f4f6",
  200: "#e5e7eb",
  300: "#d1d5db",
  400: "#9ca3af",
  500: "#6b7280",
  600: "#4b5563",
  700: "#374151",
  800: "#1f2937",
  900: "#111827"
}, oa = {
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  900: "#0f172a"
};
const aa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  amber: Yo,
  black: Do,
  blue: Vo,
  blueGray: oa,
  coolGray: na,
  cyan: Wo,
  emerald: Ko,
  fuchsia: jo,
  gray: ia,
  green: Jo,
  indigo: Io,
  lightBlue: qo,
  lime: Xo,
  orange: ea,
  pink: Fo,
  purple: No,
  red: ta,
  rose: Bo,
  sky: Zo,
  teal: Go,
  trueGray: sa,
  violet: Po,
  warmGray: ra,
  white: Ho,
  yellow: Qo
}, Symbol.toStringTag, { value: "Module" })), Pe = qs({ target: new CSSStyleSheet() }), { tw: l, setup: la } = Qn({
  sheet: Pe,
  presets: [
    // 1) автопрефиксер для вендорных префиксов
    zo(),
    // 2) сам Tailwind (включая Preflight)
    Oo()
  ],
  theme: {
    // если нужно расширить палитру по умолчанию
    extend: { colors: aa }
  }
});
la();
function ti(e, t) {
  return function() {
    return e.apply(t, arguments);
  };
}
const { toString: ca } = Object.prototype, { getPrototypeOf: Rr } = Object, { iterator: zt, toStringTag: ri } = Symbol, Dt = /* @__PURE__ */ ((e) => (t) => {
  const r = ca.call(t);
  return e[r] || (e[r] = r.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), ne = (e) => (e = e.toLowerCase(), (t) => Dt(t) === e), Ht = (e) => (t) => typeof t === e, { isArray: Ve } = Array, lt = Ht("undefined");
function da(e) {
  return e !== null && !lt(e) && e.constructor !== null && !lt(e.constructor) && X(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const si = ne("ArrayBuffer");
function ua(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && si(e.buffer), t;
}
const ha = Ht("string"), X = Ht("function"), ii = Ht("number"), Bt = (e) => e !== null && typeof e == "object", fa = (e) => e === !0 || e === !1, $t = (e) => {
  if (Dt(e) !== "object")
    return !1;
  const t = Rr(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(ri in e) && !(zt in e);
}, pa = ne("Date"), ma = ne("File"), ga = ne("Blob"), ba = ne("FileList"), wa = (e) => Bt(e) && X(e.pipe), ya = (e) => {
  let t;
  return e && (typeof FormData == "function" && e instanceof FormData || X(e.append) && ((t = Dt(e)) === "formdata" || // detect form-data instance
  t === "object" && X(e.toString) && e.toString() === "[object FormData]"));
}, va = ne("URLSearchParams"), [xa, $a, _a, Ca] = ["ReadableStream", "Request", "Response", "Headers"].map(ne), ka = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function dt(e, t, { allOwnKeys: r = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let s, i;
  if (typeof e != "object" && (e = [e]), Ve(e))
    for (s = 0, i = e.length; s < i; s++)
      t.call(null, e[s], s, e);
  else {
    const n = r ? Object.getOwnPropertyNames(e) : Object.keys(e), o = n.length;
    let a;
    for (s = 0; s < o; s++)
      a = n[s], t.call(null, e[a], a, e);
  }
}
function ni(e, t) {
  t = t.toLowerCase();
  const r = Object.keys(e);
  let s = r.length, i;
  for (; s-- > 0; )
    if (i = r[s], t === i.toLowerCase())
      return i;
  return null;
}
const Ee = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, oi = (e) => !lt(e) && e !== Ee;
function pr() {
  const { caseless: e } = oi(this) && this || {}, t = {}, r = (s, i) => {
    const n = e && ni(t, i) || i;
    $t(t[n]) && $t(s) ? t[n] = pr(t[n], s) : $t(s) ? t[n] = pr({}, s) : Ve(s) ? t[n] = s.slice() : t[n] = s;
  };
  for (let s = 0, i = arguments.length; s < i; s++)
    arguments[s] && dt(arguments[s], r);
  return t;
}
const Aa = (e, t, r, { allOwnKeys: s } = {}) => (dt(t, (i, n) => {
  r && X(i) ? e[n] = ti(i, r) : e[n] = i;
}, { allOwnKeys: s }), e), Sa = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), Ea = (e, t, r, s) => {
  e.prototype = Object.create(t.prototype, s), e.prototype.constructor = e, Object.defineProperty(e, "super", {
    value: t.prototype
  }), r && Object.assign(e.prototype, r);
}, Ra = (e, t, r, s) => {
  let i, n, o;
  const a = {};
  if (t = t || {}, e == null) return t;
  do {
    for (i = Object.getOwnPropertyNames(e), n = i.length; n-- > 0; )
      o = i[n], (!s || s(o, e, t)) && !a[o] && (t[o] = e[o], a[o] = !0);
    e = r !== !1 && Rr(e);
  } while (e && (!r || r(e, t)) && e !== Object.prototype);
  return t;
}, Ta = (e, t, r) => {
  e = String(e), (r === void 0 || r > e.length) && (r = e.length), r -= t.length;
  const s = e.indexOf(t, r);
  return s !== -1 && s === r;
}, La = (e) => {
  if (!e) return null;
  if (Ve(e)) return e;
  let t = e.length;
  if (!ii(t)) return null;
  const r = new Array(t);
  for (; t-- > 0; )
    r[t] = e[t];
  return r;
}, Ma = /* @__PURE__ */ ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && Rr(Uint8Array)), Oa = (e, t) => {
  const s = (e && e[zt]).call(e);
  let i;
  for (; (i = s.next()) && !i.done; ) {
    const n = i.value;
    t.call(e, n[0], n[1]);
  }
}, Ua = (e, t) => {
  let r;
  const s = [];
  for (; (r = e.exec(t)) !== null; )
    s.push(r);
  return s;
}, za = ne("HTMLFormElement"), Da = (e) => e.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(r, s, i) {
    return s.toUpperCase() + i;
  }
), ss = (({ hasOwnProperty: e }) => (t, r) => e.call(t, r))(Object.prototype), Ha = ne("RegExp"), ai = (e, t) => {
  const r = Object.getOwnPropertyDescriptors(e), s = {};
  dt(r, (i, n) => {
    let o;
    (o = t(i, n, e)) !== !1 && (s[n] = o || i);
  }), Object.defineProperties(e, s);
}, Ba = (e) => {
  ai(e, (t, r) => {
    if (X(e) && ["arguments", "caller", "callee"].indexOf(r) !== -1)
      return !1;
    const s = e[r];
    if (X(s)) {
      if (t.enumerable = !1, "writable" in t) {
        t.writable = !1;
        return;
      }
      t.set || (t.set = () => {
        throw Error("Can not rewrite read-only method '" + r + "'");
      });
    }
  });
}, Fa = (e, t) => {
  const r = {}, s = (i) => {
    i.forEach((n) => {
      r[n] = !0;
    });
  };
  return Ve(e) ? s(e) : s(String(e).split(t)), r;
}, ja = () => {
}, Na = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;
function Pa(e) {
  return !!(e && X(e.append) && e[ri] === "FormData" && e[zt]);
}
const Ia = (e) => {
  const t = new Array(10), r = (s, i) => {
    if (Bt(s)) {
      if (t.indexOf(s) >= 0)
        return;
      if (!("toJSON" in s)) {
        t[i] = s;
        const n = Ve(s) ? [] : {};
        return dt(s, (o, a) => {
          const c = r(o, i + 1);
          !lt(c) && (n[a] = c);
        }), t[i] = void 0, n;
      }
    }
    return s;
  };
  return r(e, 0);
}, Va = ne("AsyncFunction"), qa = (e) => e && (Bt(e) || X(e)) && X(e.then) && X(e.catch), li = ((e, t) => e ? setImmediate : t ? ((r, s) => (Ee.addEventListener("message", ({ source: i, data: n }) => {
  i === Ee && n === r && s.length && s.shift()();
}, !1), (i) => {
  s.push(i), Ee.postMessage(r, "*");
}))(`axios@${Math.random()}`, []) : (r) => setTimeout(r))(
  typeof setImmediate == "function",
  X(Ee.postMessage)
), Wa = typeof queueMicrotask < "u" ? queueMicrotask.bind(Ee) : typeof process < "u" && process.nextTick || li, Za = (e) => e != null && X(e[zt]), f = {
  isArray: Ve,
  isArrayBuffer: si,
  isBuffer: da,
  isFormData: ya,
  isArrayBufferView: ua,
  isString: ha,
  isNumber: ii,
  isBoolean: fa,
  isObject: Bt,
  isPlainObject: $t,
  isReadableStream: xa,
  isRequest: $a,
  isResponse: _a,
  isHeaders: Ca,
  isUndefined: lt,
  isDate: pa,
  isFile: ma,
  isBlob: ga,
  isRegExp: Ha,
  isFunction: X,
  isStream: wa,
  isURLSearchParams: va,
  isTypedArray: Ma,
  isFileList: ba,
  forEach: dt,
  merge: pr,
  extend: Aa,
  trim: ka,
  stripBOM: Sa,
  inherits: Ea,
  toFlatObject: Ra,
  kindOf: Dt,
  kindOfTest: ne,
  endsWith: Ta,
  toArray: La,
  forEachEntry: Oa,
  matchAll: Ua,
  isHTMLForm: za,
  hasOwnProperty: ss,
  hasOwnProp: ss,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: ai,
  freezeMethods: Ba,
  toObjectSet: Fa,
  toCamelCase: Da,
  noop: ja,
  toFiniteNumber: Na,
  findKey: ni,
  global: Ee,
  isContextDefined: oi,
  isSpecCompliantForm: Pa,
  toJSONObject: Ia,
  isAsyncFn: Va,
  isThenable: qa,
  setImmediate: li,
  asap: Wa,
  isIterable: Za
};
function k(e, t, r, s, i) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", t && (this.code = t), r && (this.config = r), s && (this.request = s), i && (this.response = i, this.status = i.status ? i.status : null);
}
f.inherits(k, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: f.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const ci = k.prototype, di = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((e) => {
  di[e] = { value: e };
});
Object.defineProperties(k, di);
Object.defineProperty(ci, "isAxiosError", { value: !0 });
k.from = (e, t, r, s, i, n) => {
  const o = Object.create(ci);
  return f.toFlatObject(e, o, function(c) {
    return c !== Error.prototype;
  }, (a) => a !== "isAxiosError"), k.call(o, e.message, t, r, s, i), o.cause = e, o.name = e.name, n && Object.assign(o, n), o;
};
const Ga = null;
function mr(e) {
  return f.isPlainObject(e) || f.isArray(e);
}
function ui(e) {
  return f.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function is(e, t, r) {
  return e ? e.concat(t).map(function(i, n) {
    return i = ui(i), !r && n ? "[" + i + "]" : i;
  }).join(r ? "." : "") : t;
}
function Ka(e) {
  return f.isArray(e) && !e.some(mr);
}
const Ja = f.toFlatObject(f, {}, null, function(t) {
  return /^is[A-Z]/.test(t);
});
function Ft(e, t, r) {
  if (!f.isObject(e))
    throw new TypeError("target must be an object");
  t = t || new FormData(), r = f.toFlatObject(r, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(y, x) {
    return !f.isUndefined(x[y]);
  });
  const s = r.metaTokens, i = r.visitor || u, n = r.dots, o = r.indexes, c = (r.Blob || typeof Blob < "u" && Blob) && f.isSpecCompliantForm(t);
  if (!f.isFunction(i))
    throw new TypeError("visitor must be a function");
  function d(m) {
    if (m === null) return "";
    if (f.isDate(m))
      return m.toISOString();
    if (!c && f.isBlob(m))
      throw new k("Blob is not supported. Use a Buffer instead.");
    return f.isArrayBuffer(m) || f.isTypedArray(m) ? c && typeof Blob == "function" ? new Blob([m]) : Buffer.from(m) : m;
  }
  function u(m, y, x) {
    let S = m;
    if (m && !x && typeof m == "object") {
      if (f.endsWith(y, "{}"))
        y = s ? y : y.slice(0, -2), m = JSON.stringify(m);
      else if (f.isArray(m) && Ka(m) || (f.isFileList(m) || f.endsWith(y, "[]")) && (S = f.toArray(m)))
        return y = ui(y), S.forEach(function(C, H) {
          !(f.isUndefined(C) || C === null) && t.append(
            // eslint-disable-next-line no-nested-ternary
            o === !0 ? is([y], H, n) : o === null ? y : y + "[]",
            d(C)
          );
        }), !1;
    }
    return mr(m) ? !0 : (t.append(is(x, y, n), d(m)), !1);
  }
  const h = [], g = Object.assign(Ja, {
    defaultVisitor: u,
    convertValue: d,
    isVisitable: mr
  });
  function v(m, y) {
    if (!f.isUndefined(m)) {
      if (h.indexOf(m) !== -1)
        throw Error("Circular reference detected in " + y.join("."));
      h.push(m), f.forEach(m, function(S, U) {
        (!(f.isUndefined(S) || S === null) && i.call(
          t,
          S,
          f.isString(U) ? U.trim() : U,
          y,
          g
        )) === !0 && v(S, y ? y.concat(U) : [U]);
      }), h.pop();
    }
  }
  if (!f.isObject(e))
    throw new TypeError("data must be an object");
  return v(e), t;
}
function ns(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function(s) {
    return t[s];
  });
}
function Tr(e, t) {
  this._pairs = [], e && Ft(e, this, t);
}
const hi = Tr.prototype;
hi.append = function(t, r) {
  this._pairs.push([t, r]);
};
hi.toString = function(t) {
  const r = t ? function(s) {
    return t.call(this, s, ns);
  } : ns;
  return this._pairs.map(function(i) {
    return r(i[0]) + "=" + r(i[1]);
  }, "").join("&");
};
function Xa(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function fi(e, t, r) {
  if (!t)
    return e;
  const s = r && r.encode || Xa;
  f.isFunction(r) && (r = {
    serialize: r
  });
  const i = r && r.serialize;
  let n;
  if (i ? n = i(t, r) : n = f.isURLSearchParams(t) ? t.toString() : new Tr(t, r).toString(s), n) {
    const o = e.indexOf("#");
    o !== -1 && (e = e.slice(0, o)), e += (e.indexOf("?") === -1 ? "?" : "&") + n;
  }
  return e;
}
class os {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(t, r, s) {
    return this.handlers.push({
      fulfilled: t,
      rejected: r,
      synchronous: s ? s.synchronous : !1,
      runWhen: s ? s.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(t) {
    f.forEach(this.handlers, function(s) {
      s !== null && t(s);
    });
  }
}
const pi = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, Qa = typeof URLSearchParams < "u" ? URLSearchParams : Tr, Ya = typeof FormData < "u" ? FormData : null, el = typeof Blob < "u" ? Blob : null, tl = {
  isBrowser: !0,
  classes: {
    URLSearchParams: Qa,
    FormData: Ya,
    Blob: el
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, Lr = typeof window < "u" && typeof document < "u", gr = typeof navigator == "object" && navigator || void 0, rl = Lr && (!gr || ["ReactNative", "NativeScript", "NS"].indexOf(gr.product) < 0), sl = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", il = Lr && window.location.href || "http://localhost", nl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: Lr,
  hasStandardBrowserEnv: rl,
  hasStandardBrowserWebWorkerEnv: sl,
  navigator: gr,
  origin: il
}, Symbol.toStringTag, { value: "Module" })), W = {
  ...nl,
  ...tl
};
function ol(e, t) {
  return Ft(e, new W.classes.URLSearchParams(), Object.assign({
    visitor: function(r, s, i, n) {
      return W.isNode && f.isBuffer(r) ? (this.append(s, r.toString("base64")), !1) : n.defaultVisitor.apply(this, arguments);
    }
  }, t));
}
function al(e) {
  return f.matchAll(/\w+|\[(\w*)]/g, e).map((t) => t[0] === "[]" ? "" : t[1] || t[0]);
}
function ll(e) {
  const t = {}, r = Object.keys(e);
  let s;
  const i = r.length;
  let n;
  for (s = 0; s < i; s++)
    n = r[s], t[n] = e[n];
  return t;
}
function mi(e) {
  function t(r, s, i, n) {
    let o = r[n++];
    if (o === "__proto__") return !0;
    const a = Number.isFinite(+o), c = n >= r.length;
    return o = !o && f.isArray(i) ? i.length : o, c ? (f.hasOwnProp(i, o) ? i[o] = [i[o], s] : i[o] = s, !a) : ((!i[o] || !f.isObject(i[o])) && (i[o] = []), t(r, s, i[o], n) && f.isArray(i[o]) && (i[o] = ll(i[o])), !a);
  }
  if (f.isFormData(e) && f.isFunction(e.entries)) {
    const r = {};
    return f.forEachEntry(e, (s, i) => {
      t(al(s), i, r, 0);
    }), r;
  }
  return null;
}
function cl(e, t, r) {
  if (f.isString(e))
    try {
      return (t || JSON.parse)(e), f.trim(e);
    } catch (s) {
      if (s.name !== "SyntaxError")
        throw s;
    }
  return (r || JSON.stringify)(e);
}
const ut = {
  transitional: pi,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(t, r) {
    const s = r.getContentType() || "", i = s.indexOf("application/json") > -1, n = f.isObject(t);
    if (n && f.isHTMLForm(t) && (t = new FormData(t)), f.isFormData(t))
      return i ? JSON.stringify(mi(t)) : t;
    if (f.isArrayBuffer(t) || f.isBuffer(t) || f.isStream(t) || f.isFile(t) || f.isBlob(t) || f.isReadableStream(t))
      return t;
    if (f.isArrayBufferView(t))
      return t.buffer;
    if (f.isURLSearchParams(t))
      return r.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
    let a;
    if (n) {
      if (s.indexOf("application/x-www-form-urlencoded") > -1)
        return ol(t, this.formSerializer).toString();
      if ((a = f.isFileList(t)) || s.indexOf("multipart/form-data") > -1) {
        const c = this.env && this.env.FormData;
        return Ft(
          a ? { "files[]": t } : t,
          c && new c(),
          this.formSerializer
        );
      }
    }
    return n || i ? (r.setContentType("application/json", !1), cl(t)) : t;
  }],
  transformResponse: [function(t) {
    const r = this.transitional || ut.transitional, s = r && r.forcedJSONParsing, i = this.responseType === "json";
    if (f.isResponse(t) || f.isReadableStream(t))
      return t;
    if (t && f.isString(t) && (s && !this.responseType || i)) {
      const o = !(r && r.silentJSONParsing) && i;
      try {
        return JSON.parse(t);
      } catch (a) {
        if (o)
          throw a.name === "SyntaxError" ? k.from(a, k.ERR_BAD_RESPONSE, this, null, this.response) : a;
      }
    }
    return t;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: W.classes.FormData,
    Blob: W.classes.Blob
  },
  validateStatus: function(t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
f.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
  ut.headers[e] = {};
});
const dl = f.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), ul = (e) => {
  const t = {};
  let r, s, i;
  return e && e.split(`
`).forEach(function(o) {
    i = o.indexOf(":"), r = o.substring(0, i).trim().toLowerCase(), s = o.substring(i + 1).trim(), !(!r || t[r] && dl[r]) && (r === "set-cookie" ? t[r] ? t[r].push(s) : t[r] = [s] : t[r] = t[r] ? t[r] + ", " + s : s);
  }), t;
}, as = Symbol("internals");
function Qe(e) {
  return e && String(e).trim().toLowerCase();
}
function _t(e) {
  return e === !1 || e == null ? e : f.isArray(e) ? e.map(_t) : String(e);
}
function hl(e) {
  const t = /* @__PURE__ */ Object.create(null), r = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let s;
  for (; s = r.exec(e); )
    t[s[1]] = s[2];
  return t;
}
const fl = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function er(e, t, r, s, i) {
  if (f.isFunction(s))
    return s.call(this, t, r);
  if (i && (t = r), !!f.isString(t)) {
    if (f.isString(s))
      return t.indexOf(s) !== -1;
    if (f.isRegExp(s))
      return s.test(t);
  }
}
function pl(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, r, s) => r.toUpperCase() + s);
}
function ml(e, t) {
  const r = f.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((s) => {
    Object.defineProperty(e, s + r, {
      value: function(i, n, o) {
        return this[s].call(this, t, i, n, o);
      },
      configurable: !0
    });
  });
}
let Q = class {
  constructor(t) {
    t && this.set(t);
  }
  set(t, r, s) {
    const i = this;
    function n(a, c, d) {
      const u = Qe(c);
      if (!u)
        throw new Error("header name must be a non-empty string");
      const h = f.findKey(i, u);
      (!h || i[h] === void 0 || d === !0 || d === void 0 && i[h] !== !1) && (i[h || c] = _t(a));
    }
    const o = (a, c) => f.forEach(a, (d, u) => n(d, u, c));
    if (f.isPlainObject(t) || t instanceof this.constructor)
      o(t, r);
    else if (f.isString(t) && (t = t.trim()) && !fl(t))
      o(ul(t), r);
    else if (f.isObject(t) && f.isIterable(t)) {
      let a = {}, c, d;
      for (const u of t) {
        if (!f.isArray(u))
          throw TypeError("Object iterator must return a key-value pair");
        a[d = u[0]] = (c = a[d]) ? f.isArray(c) ? [...c, u[1]] : [c, u[1]] : u[1];
      }
      o(a, r);
    } else
      t != null && n(r, t, s);
    return this;
  }
  get(t, r) {
    if (t = Qe(t), t) {
      const s = f.findKey(this, t);
      if (s) {
        const i = this[s];
        if (!r)
          return i;
        if (r === !0)
          return hl(i);
        if (f.isFunction(r))
          return r.call(this, i, s);
        if (f.isRegExp(r))
          return r.exec(i);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, r) {
    if (t = Qe(t), t) {
      const s = f.findKey(this, t);
      return !!(s && this[s] !== void 0 && (!r || er(this, this[s], s, r)));
    }
    return !1;
  }
  delete(t, r) {
    const s = this;
    let i = !1;
    function n(o) {
      if (o = Qe(o), o) {
        const a = f.findKey(s, o);
        a && (!r || er(s, s[a], a, r)) && (delete s[a], i = !0);
      }
    }
    return f.isArray(t) ? t.forEach(n) : n(t), i;
  }
  clear(t) {
    const r = Object.keys(this);
    let s = r.length, i = !1;
    for (; s--; ) {
      const n = r[s];
      (!t || er(this, this[n], n, t, !0)) && (delete this[n], i = !0);
    }
    return i;
  }
  normalize(t) {
    const r = this, s = {};
    return f.forEach(this, (i, n) => {
      const o = f.findKey(s, n);
      if (o) {
        r[o] = _t(i), delete r[n];
        return;
      }
      const a = t ? pl(n) : String(n).trim();
      a !== n && delete r[n], r[a] = _t(i), s[a] = !0;
    }), this;
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const r = /* @__PURE__ */ Object.create(null);
    return f.forEach(this, (s, i) => {
      s != null && s !== !1 && (r[i] = t && f.isArray(s) ? s.join(", ") : s);
    }), r;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, r]) => t + ": " + r).join(`
`);
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...r) {
    const s = new this(t);
    return r.forEach((i) => s.set(i)), s;
  }
  static accessor(t) {
    const s = (this[as] = this[as] = {
      accessors: {}
    }).accessors, i = this.prototype;
    function n(o) {
      const a = Qe(o);
      s[a] || (ml(i, o), s[a] = !0);
    }
    return f.isArray(t) ? t.forEach(n) : n(t), this;
  }
};
Q.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
f.reduceDescriptors(Q.prototype, ({ value: e }, t) => {
  let r = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(s) {
      this[r] = s;
    }
  };
});
f.freezeMethods(Q);
function tr(e, t) {
  const r = this || ut, s = t || r, i = Q.from(s.headers);
  let n = s.data;
  return f.forEach(e, function(a) {
    n = a.call(r, n, i.normalize(), t ? t.status : void 0);
  }), i.normalize(), n;
}
function gi(e) {
  return !!(e && e.__CANCEL__);
}
function qe(e, t, r) {
  k.call(this, e ?? "canceled", k.ERR_CANCELED, t, r), this.name = "CanceledError";
}
f.inherits(qe, k, {
  __CANCEL__: !0
});
function bi(e, t, r) {
  const s = r.config.validateStatus;
  !r.status || !s || s(r.status) ? e(r) : t(new k(
    "Request failed with status code " + r.status,
    [k.ERR_BAD_REQUEST, k.ERR_BAD_RESPONSE][Math.floor(r.status / 100) - 4],
    r.config,
    r.request,
    r
  ));
}
function gl(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return t && t[1] || "";
}
function bl(e, t) {
  e = e || 10;
  const r = new Array(e), s = new Array(e);
  let i = 0, n = 0, o;
  return t = t !== void 0 ? t : 1e3, function(c) {
    const d = Date.now(), u = s[n];
    o || (o = d), r[i] = c, s[i] = d;
    let h = n, g = 0;
    for (; h !== i; )
      g += r[h++], h = h % e;
    if (i = (i + 1) % e, i === n && (n = (n + 1) % e), d - o < t)
      return;
    const v = u && d - u;
    return v ? Math.round(g * 1e3 / v) : void 0;
  };
}
function wl(e, t) {
  let r = 0, s = 1e3 / t, i, n;
  const o = (d, u = Date.now()) => {
    r = u, i = null, n && (clearTimeout(n), n = null), e.apply(null, d);
  };
  return [(...d) => {
    const u = Date.now(), h = u - r;
    h >= s ? o(d, u) : (i = d, n || (n = setTimeout(() => {
      n = null, o(i);
    }, s - h)));
  }, () => i && o(i)];
}
const Rt = (e, t, r = 3) => {
  let s = 0;
  const i = bl(50, 250);
  return wl((n) => {
    const o = n.loaded, a = n.lengthComputable ? n.total : void 0, c = o - s, d = i(c), u = o <= a;
    s = o;
    const h = {
      loaded: o,
      total: a,
      progress: a ? o / a : void 0,
      bytes: c,
      rate: d || void 0,
      estimated: d && a && u ? (a - o) / d : void 0,
      event: n,
      lengthComputable: a != null,
      [t ? "download" : "upload"]: !0
    };
    e(h);
  }, r);
}, ls = (e, t) => {
  const r = e != null;
  return [(s) => t[0]({
    lengthComputable: r,
    total: e,
    loaded: s
  }), t[1]];
}, cs = (e) => (...t) => f.asap(() => e(...t)), yl = W.hasStandardBrowserEnv ? /* @__PURE__ */ ((e, t) => (r) => (r = new URL(r, W.origin), e.protocol === r.protocol && e.host === r.host && (t || e.port === r.port)))(
  new URL(W.origin),
  W.navigator && /(msie|trident)/i.test(W.navigator.userAgent)
) : () => !0, vl = W.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(e, t, r, s, i, n) {
      const o = [e + "=" + encodeURIComponent(t)];
      f.isNumber(r) && o.push("expires=" + new Date(r).toGMTString()), f.isString(s) && o.push("path=" + s), f.isString(i) && o.push("domain=" + i), n === !0 && o.push("secure"), document.cookie = o.join("; ");
    },
    read(e) {
      const t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));
      return t ? decodeURIComponent(t[3]) : null;
    },
    remove(e) {
      this.write(e, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function xl(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function $l(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function wi(e, t, r) {
  let s = !xl(t);
  return e && (s || r == !1) ? $l(e, t) : t;
}
const ds = (e) => e instanceof Q ? { ...e } : e;
function Ue(e, t) {
  t = t || {};
  const r = {};
  function s(d, u, h, g) {
    return f.isPlainObject(d) && f.isPlainObject(u) ? f.merge.call({ caseless: g }, d, u) : f.isPlainObject(u) ? f.merge({}, u) : f.isArray(u) ? u.slice() : u;
  }
  function i(d, u, h, g) {
    if (f.isUndefined(u)) {
      if (!f.isUndefined(d))
        return s(void 0, d, h, g);
    } else return s(d, u, h, g);
  }
  function n(d, u) {
    if (!f.isUndefined(u))
      return s(void 0, u);
  }
  function o(d, u) {
    if (f.isUndefined(u)) {
      if (!f.isUndefined(d))
        return s(void 0, d);
    } else return s(void 0, u);
  }
  function a(d, u, h) {
    if (h in t)
      return s(d, u);
    if (h in e)
      return s(void 0, d);
  }
  const c = {
    url: n,
    method: n,
    data: n,
    baseURL: o,
    transformRequest: o,
    transformResponse: o,
    paramsSerializer: o,
    timeout: o,
    timeoutMessage: o,
    withCredentials: o,
    withXSRFToken: o,
    adapter: o,
    responseType: o,
    xsrfCookieName: o,
    xsrfHeaderName: o,
    onUploadProgress: o,
    onDownloadProgress: o,
    decompress: o,
    maxContentLength: o,
    maxBodyLength: o,
    beforeRedirect: o,
    transport: o,
    httpAgent: o,
    httpsAgent: o,
    cancelToken: o,
    socketPath: o,
    responseEncoding: o,
    validateStatus: a,
    headers: (d, u, h) => i(ds(d), ds(u), h, !0)
  };
  return f.forEach(Object.keys(Object.assign({}, e, t)), function(u) {
    const h = c[u] || i, g = h(e[u], t[u], u);
    f.isUndefined(g) && h !== a || (r[u] = g);
  }), r;
}
const yi = (e) => {
  const t = Ue({}, e);
  let { data: r, withXSRFToken: s, xsrfHeaderName: i, xsrfCookieName: n, headers: o, auth: a } = t;
  t.headers = o = Q.from(o), t.url = fi(wi(t.baseURL, t.url, t.allowAbsoluteUrls), e.params, e.paramsSerializer), a && o.set(
    "Authorization",
    "Basic " + btoa((a.username || "") + ":" + (a.password ? unescape(encodeURIComponent(a.password)) : ""))
  );
  let c;
  if (f.isFormData(r)) {
    if (W.hasStandardBrowserEnv || W.hasStandardBrowserWebWorkerEnv)
      o.setContentType(void 0);
    else if ((c = o.getContentType()) !== !1) {
      const [d, ...u] = c ? c.split(";").map((h) => h.trim()).filter(Boolean) : [];
      o.setContentType([d || "multipart/form-data", ...u].join("; "));
    }
  }
  if (W.hasStandardBrowserEnv && (s && f.isFunction(s) && (s = s(t)), s || s !== !1 && yl(t.url))) {
    const d = i && n && vl.read(n);
    d && o.set(i, d);
  }
  return t;
}, _l = typeof XMLHttpRequest < "u", Cl = _l && function(e) {
  return new Promise(function(r, s) {
    const i = yi(e);
    let n = i.data;
    const o = Q.from(i.headers).normalize();
    let { responseType: a, onUploadProgress: c, onDownloadProgress: d } = i, u, h, g, v, m;
    function y() {
      v && v(), m && m(), i.cancelToken && i.cancelToken.unsubscribe(u), i.signal && i.signal.removeEventListener("abort", u);
    }
    let x = new XMLHttpRequest();
    x.open(i.method.toUpperCase(), i.url, !0), x.timeout = i.timeout;
    function S() {
      if (!x)
        return;
      const C = Q.from(
        "getAllResponseHeaders" in x && x.getAllResponseHeaders()
      ), D = {
        data: !a || a === "text" || a === "json" ? x.responseText : x.response,
        status: x.status,
        statusText: x.statusText,
        headers: C,
        config: e,
        request: x
      };
      bi(function(_) {
        r(_), y();
      }, function(_) {
        s(_), y();
      }, D), x = null;
    }
    "onloadend" in x ? x.onloadend = S : x.onreadystatechange = function() {
      !x || x.readyState !== 4 || x.status === 0 && !(x.responseURL && x.responseURL.indexOf("file:") === 0) || setTimeout(S);
    }, x.onabort = function() {
      x && (s(new k("Request aborted", k.ECONNABORTED, e, x)), x = null);
    }, x.onerror = function() {
      s(new k("Network Error", k.ERR_NETWORK, e, x)), x = null;
    }, x.ontimeout = function() {
      let H = i.timeout ? "timeout of " + i.timeout + "ms exceeded" : "timeout exceeded";
      const D = i.transitional || pi;
      i.timeoutErrorMessage && (H = i.timeoutErrorMessage), s(new k(
        H,
        D.clarifyTimeoutError ? k.ETIMEDOUT : k.ECONNABORTED,
        e,
        x
      )), x = null;
    }, n === void 0 && o.setContentType(null), "setRequestHeader" in x && f.forEach(o.toJSON(), function(H, D) {
      x.setRequestHeader(D, H);
    }), f.isUndefined(i.withCredentials) || (x.withCredentials = !!i.withCredentials), a && a !== "json" && (x.responseType = i.responseType), d && ([g, m] = Rt(d, !0), x.addEventListener("progress", g)), c && x.upload && ([h, v] = Rt(c), x.upload.addEventListener("progress", h), x.upload.addEventListener("loadend", v)), (i.cancelToken || i.signal) && (u = (C) => {
      x && (s(!C || C.type ? new qe(null, e, x) : C), x.abort(), x = null);
    }, i.cancelToken && i.cancelToken.subscribe(u), i.signal && (i.signal.aborted ? u() : i.signal.addEventListener("abort", u)));
    const U = gl(i.url);
    if (U && W.protocols.indexOf(U) === -1) {
      s(new k("Unsupported protocol " + U + ":", k.ERR_BAD_REQUEST, e));
      return;
    }
    x.send(n || null);
  });
}, kl = (e, t) => {
  const { length: r } = e = e ? e.filter(Boolean) : [];
  if (t || r) {
    let s = new AbortController(), i;
    const n = function(d) {
      if (!i) {
        i = !0, a();
        const u = d instanceof Error ? d : this.reason;
        s.abort(u instanceof k ? u : new qe(u instanceof Error ? u.message : u));
      }
    };
    let o = t && setTimeout(() => {
      o = null, n(new k(`timeout ${t} of ms exceeded`, k.ETIMEDOUT));
    }, t);
    const a = () => {
      e && (o && clearTimeout(o), o = null, e.forEach((d) => {
        d.unsubscribe ? d.unsubscribe(n) : d.removeEventListener("abort", n);
      }), e = null);
    };
    e.forEach((d) => d.addEventListener("abort", n));
    const { signal: c } = s;
    return c.unsubscribe = () => f.asap(a), c;
  }
}, Al = function* (e, t) {
  let r = e.byteLength;
  if (r < t) {
    yield e;
    return;
  }
  let s = 0, i;
  for (; s < r; )
    i = s + t, yield e.slice(s, i), s = i;
}, Sl = async function* (e, t) {
  for await (const r of El(e))
    yield* Al(r, t);
}, El = async function* (e) {
  if (e[Symbol.asyncIterator]) {
    yield* e;
    return;
  }
  const t = e.getReader();
  try {
    for (; ; ) {
      const { done: r, value: s } = await t.read();
      if (r)
        break;
      yield s;
    }
  } finally {
    await t.cancel();
  }
}, us = (e, t, r, s) => {
  const i = Sl(e, t);
  let n = 0, o, a = (c) => {
    o || (o = !0, s && s(c));
  };
  return new ReadableStream({
    async pull(c) {
      try {
        const { done: d, value: u } = await i.next();
        if (d) {
          a(), c.close();
          return;
        }
        let h = u.byteLength;
        if (r) {
          let g = n += h;
          r(g);
        }
        c.enqueue(new Uint8Array(u));
      } catch (d) {
        throw a(d), d;
      }
    },
    cancel(c) {
      return a(c), i.return();
    }
  }, {
    highWaterMark: 2
  });
}, jt = typeof fetch == "function" && typeof Request == "function" && typeof Response == "function", vi = jt && typeof ReadableStream == "function", Rl = jt && (typeof TextEncoder == "function" ? /* @__PURE__ */ ((e) => (t) => e.encode(t))(new TextEncoder()) : async (e) => new Uint8Array(await new Response(e).arrayBuffer())), xi = (e, ...t) => {
  try {
    return !!e(...t);
  } catch {
    return !1;
  }
}, Tl = vi && xi(() => {
  let e = !1;
  const t = new Request(W.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      return e = !0, "half";
    }
  }).headers.has("Content-Type");
  return e && !t;
}), hs = 64 * 1024, br = vi && xi(() => f.isReadableStream(new Response("").body)), Tt = {
  stream: br && ((e) => e.body)
};
jt && ((e) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((t) => {
    !Tt[t] && (Tt[t] = f.isFunction(e[t]) ? (r) => r[t]() : (r, s) => {
      throw new k(`Response type '${t}' is not supported`, k.ERR_NOT_SUPPORT, s);
    });
  });
})(new Response());
const Ll = async (e) => {
  if (e == null)
    return 0;
  if (f.isBlob(e))
    return e.size;
  if (f.isSpecCompliantForm(e))
    return (await new Request(W.origin, {
      method: "POST",
      body: e
    }).arrayBuffer()).byteLength;
  if (f.isArrayBufferView(e) || f.isArrayBuffer(e))
    return e.byteLength;
  if (f.isURLSearchParams(e) && (e = e + ""), f.isString(e))
    return (await Rl(e)).byteLength;
}, Ml = async (e, t) => {
  const r = f.toFiniteNumber(e.getContentLength());
  return r ?? Ll(t);
}, Ol = jt && (async (e) => {
  let {
    url: t,
    method: r,
    data: s,
    signal: i,
    cancelToken: n,
    timeout: o,
    onDownloadProgress: a,
    onUploadProgress: c,
    responseType: d,
    headers: u,
    withCredentials: h = "same-origin",
    fetchOptions: g
  } = yi(e);
  d = d ? (d + "").toLowerCase() : "text";
  let v = kl([i, n && n.toAbortSignal()], o), m;
  const y = v && v.unsubscribe && (() => {
    v.unsubscribe();
  });
  let x;
  try {
    if (c && Tl && r !== "get" && r !== "head" && (x = await Ml(u, s)) !== 0) {
      let D = new Request(t, {
        method: "POST",
        body: s,
        duplex: "half"
      }), P;
      if (f.isFormData(s) && (P = D.headers.get("content-type")) && u.setContentType(P), D.body) {
        const [_, E] = ls(
          x,
          Rt(cs(c))
        );
        s = us(D.body, hs, _, E);
      }
    }
    f.isString(h) || (h = h ? "include" : "omit");
    const S = "credentials" in Request.prototype;
    m = new Request(t, {
      ...g,
      signal: v,
      method: r.toUpperCase(),
      headers: u.normalize().toJSON(),
      body: s,
      duplex: "half",
      credentials: S ? h : void 0
    });
    let U = await fetch(m);
    const C = br && (d === "stream" || d === "response");
    if (br && (a || C && y)) {
      const D = {};
      ["status", "statusText", "headers"].forEach((O) => {
        D[O] = U[O];
      });
      const P = f.toFiniteNumber(U.headers.get("content-length")), [_, E] = a && ls(
        P,
        Rt(cs(a), !0)
      ) || [];
      U = new Response(
        us(U.body, hs, _, () => {
          E && E(), y && y();
        }),
        D
      );
    }
    d = d || "text";
    let H = await Tt[f.findKey(Tt, d) || "text"](U, e);
    return !C && y && y(), await new Promise((D, P) => {
      bi(D, P, {
        data: H,
        headers: Q.from(U.headers),
        status: U.status,
        statusText: U.statusText,
        config: e,
        request: m
      });
    });
  } catch (S) {
    throw y && y(), S && S.name === "TypeError" && /Load failed|fetch/i.test(S.message) ? Object.assign(
      new k("Network Error", k.ERR_NETWORK, e, m),
      {
        cause: S.cause || S
      }
    ) : k.from(S, S && S.code, e, m);
  }
}), wr = {
  http: Ga,
  xhr: Cl,
  fetch: Ol
};
f.forEach(wr, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const fs = (e) => `- ${e}`, Ul = (e) => f.isFunction(e) || e === null || e === !1, $i = {
  getAdapter: (e) => {
    e = f.isArray(e) ? e : [e];
    const { length: t } = e;
    let r, s;
    const i = {};
    for (let n = 0; n < t; n++) {
      r = e[n];
      let o;
      if (s = r, !Ul(r) && (s = wr[(o = String(r)).toLowerCase()], s === void 0))
        throw new k(`Unknown adapter '${o}'`);
      if (s)
        break;
      i[o || "#" + n] = s;
    }
    if (!s) {
      const n = Object.entries(i).map(
        ([a, c]) => `adapter ${a} ` + (c === !1 ? "is not supported by the environment" : "is not available in the build")
      );
      let o = t ? n.length > 1 ? `since :
` + n.map(fs).join(`
`) : " " + fs(n[0]) : "as no adapter specified";
      throw new k(
        "There is no suitable adapter to dispatch the request " + o,
        "ERR_NOT_SUPPORT"
      );
    }
    return s;
  },
  adapters: wr
};
function rr(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new qe(null, e);
}
function ps(e) {
  return rr(e), e.headers = Q.from(e.headers), e.data = tr.call(
    e,
    e.transformRequest
  ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), $i.getAdapter(e.adapter || ut.adapter)(e).then(function(s) {
    return rr(e), s.data = tr.call(
      e,
      e.transformResponse,
      s
    ), s.headers = Q.from(s.headers), s;
  }, function(s) {
    return gi(s) || (rr(e), s && s.response && (s.response.data = tr.call(
      e,
      e.transformResponse,
      s.response
    ), s.response.headers = Q.from(s.response.headers))), Promise.reject(s);
  });
}
const _i = "1.9.0", Nt = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  Nt[e] = function(s) {
    return typeof s === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const ms = {};
Nt.transitional = function(t, r, s) {
  function i(n, o) {
    return "[Axios v" + _i + "] Transitional option '" + n + "'" + o + (s ? ". " + s : "");
  }
  return (n, o, a) => {
    if (t === !1)
      throw new k(
        i(o, " has been removed" + (r ? " in " + r : "")),
        k.ERR_DEPRECATED
      );
    return r && !ms[o] && (ms[o] = !0, console.warn(
      i(
        o,
        " has been deprecated since v" + r + " and will be removed in the near future"
      )
    )), t ? t(n, o, a) : !0;
  };
};
Nt.spelling = function(t) {
  return (r, s) => (console.warn(`${s} is likely a misspelling of ${t}`), !0);
};
function zl(e, t, r) {
  if (typeof e != "object")
    throw new k("options must be an object", k.ERR_BAD_OPTION_VALUE);
  const s = Object.keys(e);
  let i = s.length;
  for (; i-- > 0; ) {
    const n = s[i], o = t[n];
    if (o) {
      const a = e[n], c = a === void 0 || o(a, n, e);
      if (c !== !0)
        throw new k("option " + n + " must be " + c, k.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (r !== !0)
      throw new k("Unknown option " + n, k.ERR_BAD_OPTION);
  }
}
const Ct = {
  assertOptions: zl,
  validators: Nt
}, ae = Ct.validators;
let Le = class {
  constructor(t) {
    this.defaults = t || {}, this.interceptors = {
      request: new os(),
      response: new os()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(t, r) {
    try {
      return await this._request(t, r);
    } catch (s) {
      if (s instanceof Error) {
        let i = {};
        Error.captureStackTrace ? Error.captureStackTrace(i) : i = new Error();
        const n = i.stack ? i.stack.replace(/^.+\n/, "") : "";
        try {
          s.stack ? n && !String(s.stack).endsWith(n.replace(/^.+\n.+\n/, "")) && (s.stack += `
` + n) : s.stack = n;
        } catch {
        }
      }
      throw s;
    }
  }
  _request(t, r) {
    typeof t == "string" ? (r = r || {}, r.url = t) : r = t || {}, r = Ue(this.defaults, r);
    const { transitional: s, paramsSerializer: i, headers: n } = r;
    s !== void 0 && Ct.assertOptions(s, {
      silentJSONParsing: ae.transitional(ae.boolean),
      forcedJSONParsing: ae.transitional(ae.boolean),
      clarifyTimeoutError: ae.transitional(ae.boolean)
    }, !1), i != null && (f.isFunction(i) ? r.paramsSerializer = {
      serialize: i
    } : Ct.assertOptions(i, {
      encode: ae.function,
      serialize: ae.function
    }, !0)), r.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? r.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : r.allowAbsoluteUrls = !0), Ct.assertOptions(r, {
      baseUrl: ae.spelling("baseURL"),
      withXsrfToken: ae.spelling("withXSRFToken")
    }, !0), r.method = (r.method || this.defaults.method || "get").toLowerCase();
    let o = n && f.merge(
      n.common,
      n[r.method]
    );
    n && f.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (m) => {
        delete n[m];
      }
    ), r.headers = Q.concat(o, n);
    const a = [];
    let c = !0;
    this.interceptors.request.forEach(function(y) {
      typeof y.runWhen == "function" && y.runWhen(r) === !1 || (c = c && y.synchronous, a.unshift(y.fulfilled, y.rejected));
    });
    const d = [];
    this.interceptors.response.forEach(function(y) {
      d.push(y.fulfilled, y.rejected);
    });
    let u, h = 0, g;
    if (!c) {
      const m = [ps.bind(this), void 0];
      for (m.unshift.apply(m, a), m.push.apply(m, d), g = m.length, u = Promise.resolve(r); h < g; )
        u = u.then(m[h++], m[h++]);
      return u;
    }
    g = a.length;
    let v = r;
    for (h = 0; h < g; ) {
      const m = a[h++], y = a[h++];
      try {
        v = m(v);
      } catch (x) {
        y.call(this, x);
        break;
      }
    }
    try {
      u = ps.call(this, v);
    } catch (m) {
      return Promise.reject(m);
    }
    for (h = 0, g = d.length; h < g; )
      u = u.then(d[h++], d[h++]);
    return u;
  }
  getUri(t) {
    t = Ue(this.defaults, t);
    const r = wi(t.baseURL, t.url, t.allowAbsoluteUrls);
    return fi(r, t.params, t.paramsSerializer);
  }
};
f.forEach(["delete", "get", "head", "options"], function(t) {
  Le.prototype[t] = function(r, s) {
    return this.request(Ue(s || {}, {
      method: t,
      url: r,
      data: (s || {}).data
    }));
  };
});
f.forEach(["post", "put", "patch"], function(t) {
  function r(s) {
    return function(n, o, a) {
      return this.request(Ue(a || {}, {
        method: t,
        headers: s ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: n,
        data: o
      }));
    };
  }
  Le.prototype[t] = r(), Le.prototype[t + "Form"] = r(!0);
});
let Dl = class Ci {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let r;
    this.promise = new Promise(function(n) {
      r = n;
    });
    const s = this;
    this.promise.then((i) => {
      if (!s._listeners) return;
      let n = s._listeners.length;
      for (; n-- > 0; )
        s._listeners[n](i);
      s._listeners = null;
    }), this.promise.then = (i) => {
      let n;
      const o = new Promise((a) => {
        s.subscribe(a), n = a;
      }).then(i);
      return o.cancel = function() {
        s.unsubscribe(n);
      }, o;
    }, t(function(n, o, a) {
      s.reason || (s.reason = new qe(n, o, a), r(s.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : this._listeners = [t];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(t) {
    if (!this._listeners)
      return;
    const r = this._listeners.indexOf(t);
    r !== -1 && this._listeners.splice(r, 1);
  }
  toAbortSignal() {
    const t = new AbortController(), r = (s) => {
      t.abort(s);
    };
    return this.subscribe(r), t.signal.unsubscribe = () => this.unsubscribe(r), t.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let t;
    return {
      token: new Ci(function(i) {
        t = i;
      }),
      cancel: t
    };
  }
};
function Hl(e) {
  return function(r) {
    return e.apply(null, r);
  };
}
function Bl(e) {
  return f.isObject(e) && e.isAxiosError === !0;
}
const yr = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(yr).forEach(([e, t]) => {
  yr[t] = e;
});
function ki(e) {
  const t = new Le(e), r = ti(Le.prototype.request, t);
  return f.extend(r, Le.prototype, t, { allOwnKeys: !0 }), f.extend(r, t, null, { allOwnKeys: !0 }), r.create = function(i) {
    return ki(Ue(e, i));
  }, r;
}
const N = ki(ut);
N.Axios = Le;
N.CanceledError = qe;
N.CancelToken = Dl;
N.isCancel = gi;
N.VERSION = _i;
N.toFormData = Ft;
N.AxiosError = k;
N.Cancel = N.CanceledError;
N.all = function(t) {
  return Promise.all(t);
};
N.spread = Hl;
N.isAxiosError = Bl;
N.mergeConfig = Ue;
N.AxiosHeaders = Q;
N.formToJSON = (e) => mi(f.isHTMLForm(e) ? new FormData(e) : e);
N.getAdapter = $i.getAdapter;
N.HttpStatusCode = yr;
N.default = N;
const {
  Axios: t0,
  AxiosError: r0,
  CanceledError: s0,
  isCancel: i0,
  CancelToken: n0,
  VERSION: o0,
  all: a0,
  Cancel: l0,
  isAxiosError: c0,
  spread: d0,
  toFormData: u0,
  AxiosHeaders: h0,
  HttpStatusCode: f0,
  formToJSON: p0,
  getAdapter: m0,
  mergeConfig: g0
} = N, ie = "data:image/svg+xml,%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Transformed%20by:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='SVGRepo_bgCarrier'%20stroke-width='0'/%3e%3cg%20id='SVGRepo_tracerCarrier'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cg%20id='SVGRepo_iconCarrier'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M4.6138%208.54479L4.1875%2010.25H2C1.58579%2010.25%201.25%2010.5858%201.25%2011C1.25%2011.4142%201.58579%2011.75%202%2011.75H22C22.4142%2011.75%2022.75%2011.4142%2022.75%2011C22.75%2010.5858%2022.4142%2010.25%2022%2010.25H19.8125L19.3862%208.54479C18.8405%206.36211%2018.5677%205.27077%2017.7539%204.63538C16.9401%204%2015.8152%204%2013.5653%204H10.4347C8.1848%204%207.05988%204%206.24609%204.63538C5.43231%205.27077%205.15947%206.36211%204.6138%208.54479ZM6.5%2021C8.12316%2021%209.48826%2019.8951%209.88417%2018.3963L10.9938%2017.8415C11.6272%2017.5248%2012.3728%2017.5248%2013.0062%2017.8415L14.1158%2018.3963C14.5117%2019.8951%2015.8768%2021%2017.5%2021C19.433%2021%2021%2019.433%2021%2017.5C21%2015.567%2019.433%2014%2017.5%2014C15.8399%2014%2014.4498%2015.1558%2014.0903%2016.7065L13.6771%2016.4999C12.6213%2015.972%2011.3787%2015.972%2010.3229%2016.4999L9.90967%2016.7065C9.55023%2015.1558%208.16009%2014%206.5%2014C4.567%2014%203%2015.567%203%2017.5C3%2019.433%204.567%2021%206.5%2021Z'%20fill='%23000000'/%3e%3c/g%3e%3c/svg%3e", J = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2016%2016'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='m%208%201%20c%20-1.65625%200%20-3%201.34375%20-3%203%20s%201.34375%203%203%203%20s%203%20-1.34375%203%20-3%20s%20-1.34375%20-3%20-3%20-3%20z%20m%20-1.5%207%20c%20-2.492188%200%20-4.5%202.007812%20-4.5%204.5%20v%200.5%20c%200%201.109375%200.890625%202%202%202%20h%208%20c%201.109375%200%202%20-0.890625%202%20-2%20v%20-0.5%20c%200%20-2.492188%20-2.007812%20-4.5%20-4.5%20-4.5%20z%20m%200%200'%20fill='%232e3436'/%3e%3c/svg%3e";
class Z extends Fe {
  createRenderRoot() {
    const t = super.createRenderRoot();
    if (t.adoptedStyleSheets.includes(Pe.target) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, Pe.target]), !t.__spriteInjected) {
      const r = document.createElement("template");
      r.innerHTML = Ts, t.prepend(r.content.cloneNode(!0)), t.__spriteInjected = !0;
    }
    return t;
  }
}
class Ai extends Z {
  render() {
    const t = this.data || {};
    if (this.type === "reviews") {
      const {
        average: r = 0,
        total: s = 0,
        distribution: i = [],
        sentiments: n = {},
        emotions: o = {}
      } = t, a = [
        { key: "positive", label: "Положительные", icon: "bx-happy", bg: l`bg-green-50`, textClass: l`text-green-700`, iconClass: l`text-green-500` },
        { key: "neutral", label: "Нейтральные", icon: "bx-meh", bg: l`bg-gray-50`, textClass: l`text-gray-700`, iconClass: l`text-gray-500` },
        { key: "negative", label: "Отрицательные", icon: "bx-sad", bg: l`bg-red-50`, textClass: l`text-red-700`, iconClass: l`text-red-500` }
      ], c = [
        { key: "joy", label: "Радость", icon: "bx-happy-alt", bg: l`bg-amber-50`, trackBg: l`bg-amber-200`, fillBg: l`bg-amber-500`, iconClass: l`text-amber-500` },
        { key: "interest", label: "Интерес", icon: "bx-search-alt", bg: l`bg-indigo-50`, trackBg: l`bg-indigo-200`, fillBg: l`bg-indigo-500`, iconClass: l`text-indigo-500` },
        { key: "surprise", label: "Удивление", icon: "bx-shocked", bg: l`bg-amber-50`, trackBg: l`bg-amber-200`, fillBg: l`bg-amber-500`, iconClass: l`text-amber-500` },
        { key: "sadness", label: "Грусть", icon: "bx-sad", bg: l`bg-blue-50`, trackBg: l`bg-blue-200`, fillBg: l`bg-blue-500`, iconClass: l`text-blue-500` },
        { key: "anger", label: "Злость", icon: "bx-angry", bg: l`bg-red-50`, trackBg: l`bg-red-200`, fillBg: l`bg-red-500`, iconClass: l`text-red-500` },
        { key: "disgust", label: "Отвращение", icon: "bx-bug", bg: l`bg-lime-50`, trackBg: l`bg-lime-200`, fillBg: l`bg-lime-600`, iconClass: l`text-lime-600` },
        { key: "fear", label: "Страх", icon: "bx-alarm-exclamation", bg: l`bg-blue-50`, trackBg: l`bg-blue-200`, fillBg: l`bg-blue-500`, iconClass: l`text-blue-500` },
        { key: "guilt", label: "Вина", icon: "bx-tired", bg: l`bg-indigo-50`, trackBg: l`bg-indigo-200`, fillBg: l`bg-indigo-500`, iconClass: l`text-indigo-500` },
        { key: "neutrality", label: "Нейтральность", icon: "ri-emotion-normal-line", bg: l`bg-gray-100`, trackBg: l`bg-gray-200`, fillBg: l`bg-gray-500`, iconClass: l`text-gray-500` }
      ];
      return $`
        <div class="${l`mb-8`}">
          <div class="${l`text-center mb-4`}">
            <div class="${l`text-5xl font-bold`}">${r.toFixed(1)}</div>
            <div class="${l`flex justify-center mb-1 space-x-1`}">
              ${[1, 2, 3, 4, 5].map((d) => $`
                <svg class="${l`${d <= Math.round(r) ? "text-yellow-400" : "text-gray-300"} text-xl`}"
                     fill="currentColor" width="1em" height="1em">
                  <use href="#bxs-star"/>
                </svg>`)}
            </div>
            <div class="${l`text-sm text-gray-500`}">На основе ${s} отзывов</div>
          </div>

          <div class="${l`space-y-2 mb-6`}">
            ${i.map(({ stars: d, percent: u }) => $`
              <div class="${l`flex items-center`}">
                <span class="${l`w-4 mr-2`}">${d}</span>
                <svg class="${l`text-yellow-400 mr-2`}" fill="currentColor" width="1em" height="1em">
                  <use href="#bxs-star"/>
                </svg>
                <div class="${l`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`}">
                  <div class="${l`h-full bg-yellow-400 rounded-full`}" style="width:${u}%"></div>
                </div>
                <span class="${l`ml-2 text-sm text-gray-500 w-9`}">${u}%</span>
              </div>`)}
          </div>

          <div class="${l`grid grid-cols-3 gap-2 mb-6 text-center`}">
            ${a.map((d) => {
        const u = n[d.key] ?? 0;
        return $`
                <div class="${l`flex flex-col items-center ${d.bg} rounded-2xl p-3`}">
                  <div class="${l`${d.textClass} text-lg font-medium`}">${u}%</div>
                  <svg class="${l`${d.iconClass} text-xl mt-1`}" fill="currentColor" width="1em" height="1em">
                    <use href="#${d.icon}"/>
                  </svg>
                </div>`;
      })}
          </div>

          <div class="${l`space-y-3`}">
            ${c.map((d) => {
        const u = o[d.key] ?? 0;
        return u ? $`
                <div class="${l`flex flex-col ${d.bg} rounded-2xl p-3`}">
                  <div class="${l`flex items-center`}">
                    <svg class="${`${d.iconClass} ${l`mr-3`}`}" fill="currentColor" width="1em" height="1em">
                      <use href="#${d.icon}"/>
                    </svg>
                    <div class="${l`flex-1`}">
                      <div class="${l`text-sm font-medium`}">
                        ${d.label}
                        <span class="${l`ml-2 text-xs text-gray-500`}">${u}% отзывов</span>
                      </div>
                    </div>
                  </div>
                  <div class="${l`mt-2 h-1 ${d.trackBg} rounded-full overflow-hidden`}">
                    <div class="${l`h-full ${d.fillBg}`}" style="width:${u}%"></div>
                  </div>
                </div>` : $``;
      })}
          </div>
        </div>
      `;
    }
    if (this.type === "qa") {
      const {
        totalQuestions: r = 0,
        answeredCount: s = 0,
        unansweredCount: i = 0
      } = t;
      let n = r ? Math.round(s / r * 100) : 0, o = r ? Math.round(i / r * 100) : 0;
      return $`
        <div class="${l`mb-8`}">
          <div class="${l`text-center mb-4`}">
            <div class="${l`text-5xl font-bold`}">${r}</div>
            <div class="${l`text-sm text-gray-500`}">Всего вопросов</div>
          </div>

          <div class="${l`space-y-6 text-sm`}">
            <div>
              <div class="${l`text-black font-medium mb-1`}">С ответом</div>
              <div class="${l`flex items-center`}">
                <svg class="${l`text-green-500 mr-2 text-base`}" fill="currentColor" width="1em" height="1em">
                  <use href="#bx-check-circle"/>
                </svg>
                <div class="${l`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`}">
                  <div class="${l`h-full bg-green-500 rounded-full`}" style="width:${n}%"></div>
                </div>
                <span class="${l`ml-2 text-gray-500`}">${s}</span>
              </div>
            </div>

            <div>
              <div class="${l`text-black font-medium mb-1`}">Без ответа</div>
              <div class="${l`flex items-center`}">
                <svg class="${l`text-red-500 mr-2 text-base`}" fill="currentColor" width="1em" height="1em">
                  <use href="#bx-x-circle"/>
                </svg>
                <div class="${l`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`}">
                  <div class="${l`h-full bg-red-500 rounded-full`}" style="width:${o}%"></div>
                </div>
                <span class="${l`ml-2 text-gray-500`}">${i}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    return $``;
  }
}
A(Ai, "properties", {
  type: { type: String },
  // 'reviews' или 'qa'
  data: { type: Object }
});
customElements.define("stats-panel", Ai);
class Si extends Z {
  constructor() {
    super(), this.active = "reviews";
  }
  _onClick(t) {
    this.dispatchEvent(new CustomEvent("tab-change", {
      detail: { tab: t },
      bubbles: !0,
      composed: !0
    }));
  }
  render() {
    return $`
        <div data-role="tabs" class="${l`flex space-x-4 px-6 py-4`}">
          <button
            @click=${() => this._onClick("reviews")}
            class=${l`
              focus:outline-none px-4 py-2 text-sm font-medium
              ${this.active === "reviews" ? "text-sky-600 border-b-2 border-sky-600" : "text-gray-500 hover:text-gray-700"}
            `}>
            Отзывы
          </button>
          <button
            @click=${() => this._onClick("qa")}
            class=${l`
              focus:outline-none px-4 py-2 text-sm font-medium
              ${this.active === "qa" ? "text-sky-600 border-b-2 border-sky-600" : "text-gray-500 hover:text-gray-700"}
            `}>
            Вопрос-ответ
          </button>
        </div>
    `;
  }
}
A(Si, "properties", { active: { type: String } });
customElements.define("tab-nav", Si);
class Ei extends Z {
  constructor() {
    super(...arguments);
    // bubbling-событий
    A(this, "_onLogin", () => this.dispatchEvent(new CustomEvent("login", { bubbles: !0, composed: !0 })));
    A(this, "_onLogout", () => this.dispatchEvent(new CustomEvent("logout", { bubbles: !0, composed: !0 })));
  }
  render() {
    const {
      isAuthenticated: r = !1,
      name: s = "",
      email: i = "",
      avatar: n = ""
    } = this.user || {}, o = !r && this.allowAnonymous;
    return $`
      <div class="${l`flex items-center space-x-2 pr-6`}">
        ${r ? $`
              <!-- панель авторизованного пользователя -->
              <a href="http://localhost:3000/profile" class="${l`flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 px-2 py-2 rounded-xl focus:outline-none`}">
                <img
                  src=${n || J}
                  @error=${(a) => a.currentTarget.src = J}
                  class="${l`w-8 h-8 rounded-full object-cover`}" />
                <div class="${l`text-left`}">
                  <div class="${l`text-sm font-medium text-gray-900`}">${s}</div>
                  <div class="${l`text-sm text-gray-500`}">${i}</div>
                </div>
              </a>

              <button @click=${this._onLogout}
                      class="${l`px-3 py-4 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl focus:outline-none`}">
                <svg class="${l`text-lg`}" fill="currentColor" width="1em" height="1em">
                  <use href="#ri-logout-box-r-line"></use>
                </svg>
              </button>` : $`
              <!-- если анонимия разрешена — компактная карточка «Аноним» -->
              ${o ? $`
                <div class="${l`flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-xl`}">
                  <img src=${ie}
                       class="${l`w-8 h-10 rounded-full object-cover`}" />
                  <span class="${l`text-sm text-gray-700`}">Аноним</span>
                </div>` : ""}

              <button @click=${this._onLogin}
                      class="${l`px-6 py-4 bg-sky-600 text-white text-sm font-medium rounded-xl focus:outline-none`}">
                Войти
              </button>`}
      </div>`;
  }
}
A(Ei, "properties", {
  user: { type: Object },
  allowAnonymous: { type: Boolean }
});
customElements.define("user-menu", Ei);
class Ri extends Z {
  constructor() {
    super(), this.searchText = "", this.sortBy = "date-asc", this.active = "all";
  }
  _onSearch(t) {
    this.searchText = t.target.value, this.dispatchEvent(new CustomEvent("search-change", {
      detail: this.searchText,
      bubbles: !0,
      composed: !0
    }));
  }
  _onSort(t) {
    const [r, s] = t.target.value.split("-");
    this.sortBy = `${r}-${s}`, this.dispatchEvent(new CustomEvent("sort-change", {
      detail: { key: r, dir: s },
      bubbles: !0,
      composed: !0
    }));
  }
  _onFilter(t) {
    const r = t.currentTarget.dataset.f;
    this.active = r, this.dispatchEvent(new CustomEvent("filter-change", {
      detail: r,
      bubbles: !0,
      composed: !0
    }));
  }
  _btn(t) {
    return this.active === t ? l`border-sky-600 bg-sky-100` : l`border-gray-200 bg-gray-50 hover:bg-gray-100`;
  }
  render() {
    const t = [5, 4, 3, 2, 1], r = [
      { label: "Положительные", f: "positive" },
      { label: "Нейтральные", f: "neutral" },
      { label: "Отрицательные", f: "negative" }
    ];
    return $`
      <div class=${l`mb-6`}>
        <div class=${l`flex items-center space-x-3 mb-4`}>
          <div class=${l`relative flex-1`}>
            <input
              .value=${this.searchText}
              @input=${this._onSearch}
              placeholder="Поиск в отзывах"
              class=${l`w-full bg-gray-100 py-2 pl-10 pr-3 rounded-md focus:ring-2 focus:ring-sky-600 focus:outline-none`} />
            <div class=${l`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
              <svg width="1em" height="1em" class=${l`text-gray-500`}><use href="#ri-search-line"/></svg>
            </div>
          </div>
          <select
            @change=${this._onSort}
            class=${l`bg-gray-100 py-2 pl-3 pr-8 rounded-md text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none`}>
            <option value="date-asc"  ?selected=${this.sortBy === "date-asc"}>По дате (сначала старые)</option>
            <option value="date-desc" ?selected=${this.sortBy === "date-desc"}>По дате (сначала новые)</option>
            <option value="pop-asc"   ?selected=${this.sortBy === "pop-asc"}>По популярности (по возрастанию)</option>
            <option value="pop-desc"  ?selected=${this.sortBy === "pop-desc"}>По популярности (по убыванию)</option>
          </select>
        </div>

        <div class=${l`flex flex-wrap gap-2`}>
          <button
            data-f="all"
            @click=${this._onFilter}
            class=${`${l`border px-3 py-2 rounded-xl focus:outline-none`} ${this._btn("all")}`}>
            Все
          </button>

          ${t.map((s) => $`
            <button
              data-f="${s}"
              @click=${this._onFilter}
              class=${`${l`border px-3 py-2 rounded-xl flex items-center whitespace-nowrap focus:outline-none fill-current`} ${this._btn(String(s))}`}>
              ${s}
              <svg class=${l`ml-1 text-yellow-400`} width="1em" height="1em"><use href="#ri-star-fill"/></svg>
            </button>
          `)}

          ${r.map((s) => $`
            <button
              data-f="${s.f}"
              @click=${this._onFilter}
              class=${`${l`border px-3 py-2 rounded-xl whitespace-nowrap focus:outline-none`} ${this._btn(s.f)}`}>
              ${s.label}
            </button>
          `)}
        </div>
      </div>
    `;
  }
}
A(Ri, "properties", {
  searchText: { type: String },
  sortBy: { type: String },
  active: { type: String }
  // all|1|2|3|4|5|positive|neutral|negative
});
customElements.define("reviews-filters", Ri);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fl = { CHILD: 2 }, jl = (e) => (...t) => ({ _$litDirective$: e, values: t });
class Nl {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, r, s) {
    this._$Ct = t, this._$AM = r, this._$Ci = s;
  }
  _$AS(t, r) {
    return this.update(t, r);
  }
  update(t, r) {
    return this.render(...r);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: Pl } = hn, gs = () => document.createComment(""), Ye = (e, t, r) => {
  var n;
  const s = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
  if (r === void 0) {
    const o = s.insertBefore(gs(), i), a = s.insertBefore(gs(), i);
    r = new Pl(o, a, e, e.options);
  } else {
    const o = r._$AB.nextSibling, a = r._$AM, c = a !== e;
    if (c) {
      let d;
      (n = r._$AQ) == null || n.call(r, e), r._$AM = e, r._$AP !== void 0 && (d = e._$AU) !== a._$AU && r._$AP(d);
    }
    if (o !== i || c) {
      let d = r._$AA;
      for (; d !== o; ) {
        const u = d.nextSibling;
        s.insertBefore(d, i), d = u;
      }
    }
  }
  return r;
}, _e = (e, t, r = e) => (e._$AI(t, r), e), Il = {}, Vl = (e, t = Il) => e._$AH = t, ql = (e) => e._$AH, sr = (e) => {
  var s;
  (s = e._$AP) == null || s.call(e, !1, !0);
  let t = e._$AA;
  const r = e._$AB.nextSibling;
  for (; t !== r; ) {
    const i = t.nextSibling;
    t.remove(), t = i;
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bs = (e, t, r) => {
  const s = /* @__PURE__ */ new Map();
  for (let i = t; i <= r; i++) s.set(e[i], i);
  return s;
}, Ti = jl(class extends Nl {
  constructor(e) {
    if (super(e), e.type !== Fl.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e, t, r) {
    let s;
    r === void 0 ? r = t : t !== void 0 && (s = t);
    const i = [], n = [];
    let o = 0;
    for (const a of e) i[o] = s ? s(a, o) : o, n[o] = r(a, o), o++;
    return { values: n, keys: i };
  }
  render(e, t, r) {
    return this.dt(e, t, r).values;
  }
  update(e, [t, r, s]) {
    const i = ql(e), { values: n, keys: o } = this.dt(t, r, s);
    if (!Array.isArray(i)) return this.ut = o, n;
    const a = this.ut ?? (this.ut = []), c = [];
    let d, u, h = 0, g = i.length - 1, v = 0, m = n.length - 1;
    for (; h <= g && v <= m; ) if (i[h] === null) h++;
    else if (i[g] === null) g--;
    else if (a[h] === o[v]) c[v] = _e(i[h], n[v]), h++, v++;
    else if (a[g] === o[m]) c[m] = _e(i[g], n[m]), g--, m--;
    else if (a[h] === o[m]) c[m] = _e(i[h], n[m]), Ye(e, c[m + 1], i[h]), h++, m--;
    else if (a[g] === o[v]) c[v] = _e(i[g], n[v]), Ye(e, i[h], i[g]), g--, v++;
    else if (d === void 0 && (d = bs(o, v, m), u = bs(a, h, g)), d.has(a[h])) if (d.has(a[g])) {
      const y = u.get(o[v]), x = y !== void 0 ? i[y] : null;
      if (x === null) {
        const S = Ye(e, i[h]);
        _e(S, n[v]), c[v] = S;
      } else c[v] = _e(x, n[v]), Ye(e, i[h], x), i[y] = null;
      v++;
    } else sr(i[g]), g--;
    else sr(i[h]), h++;
    for (; v <= m; ) {
      const y = Ye(e, c[m + 1]);
      _e(y, n[v]), c[v++] = y;
    }
    for (; h <= g; ) {
      const y = i[h++];
      y !== null && sr(y);
    }
    return this.ut = o, Vl(e, c), Oe;
  }
}), Wl = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M22.0187%2016.8203L18.8887%209.50027C18.3187%208.16027%2017.4687%207.40027%2016.4987%207.35027C15.5387%207.30027%2014.6087%207.97027%2013.8987%209.25027L11.9987%2012.6603C11.5987%2013.3803%2011.0287%2013.8103%2010.4087%2013.8603C9.77867%2013.9203%209.14867%2013.5903%208.63867%2012.9403L8.41867%2012.6603C7.70867%2011.7703%206.82867%2011.3403%205.92867%2011.4303C5.02867%2011.5203%204.25867%2012.1403%203.74867%2013.1503L2.01867%2016.6003C1.39867%2017.8503%201.45867%2019.3003%202.18867%2020.4803C2.91867%2021.6603%204.18867%2022.3703%205.57867%2022.3703H18.3387C19.6787%2022.3703%2020.9287%2021.7003%2021.6687%2020.5803C22.4287%2019.4603%2022.5487%2018.0503%2022.0187%2016.8203Z'%20fill='%23292D32'/%3e%3cpath%20d='M6.96984%208.38109C8.83657%208.38109%2010.3498%206.86782%2010.3498%205.00109C10.3498%203.13437%208.83657%201.62109%206.96984%201.62109C5.10312%201.62109%203.58984%203.13437%203.58984%205.00109C3.58984%206.86782%205.10312%208.38109%206.96984%208.38109Z'%20fill='%23292D32'/%3e%3c/svg%3e", Zl = "http://localhost:3000";
class vr extends Z {
  constructor() {
    super(), this.media = [], this.active = 0;
  }
  _select(t) {
    this.active = t, this.dispatchEvent(
      new CustomEvent("view-media", { detail: { index: t }, bubbles: !0, composed: !0 })
    );
  }
  render() {
    return $`
        <div class="relative">
          <div class="${l`flex space-x-3 overflow-x-auto pb-2`} scroll">
            ${this.media.map((t, r) => {
      const s = typeof t == "string" && !t.startsWith("http") ? Zl + t : t;
      return $`
                <div
                  class="${l`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer`}"
                  @click=${() => this._select(r)}>
                  <img
                    src="${s}"
                    class="${l`w-full h-full object-cover`}"
                    @error=${(i) => i.currentTarget.src = Wl}
                  />
                </div>
              `;
    })}
          </div>
        </div>
      `;
  }
}
A(vr, "properties", { media: { type: Array }, active: { state: !0 } }), A(vr, "styles", [
  Cs`
      :host { display:block }
      .scroll::-webkit-scrollbar{height:4px;width:6px}
      .scroll::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:10px}
      .scroll::-webkit-scrollbar-track{background:#f1f1f1;border-radius:10px}`
]);
customElements.define("media-gallery", vr);
class Li extends Z {
  constructor() {
    super(), this.comments = [], this.currentUser = {}, this._commentText = "", this.allowAnonymous = !1;
  }
  _onInput(t) {
    this._commentText = t.target.value;
  }
  _send() {
    const t = this._commentText.trim();
    t && (this.dispatchEvent(new CustomEvent("send-comment", {
      detail: { reviewId: this.reviewId, text: t },
      bubbles: !0,
      composed: !0
    })), this._commentText = "");
  }
  render() {
    const { isAuthenticated: t = !1, avatar: r } = this.currentUser, s = !this._commentText.trim(), i = t || this.allowAnonymous, n = t ? r || J : this.allowAnonymous ? ie : "", o = (a) => a && typeof a == "object" && a.avatar ? a.avatar : !a || typeof a == "string" ? ie : J;
    return $`
      <div class=${l`mt-4 border-l-2 border-sky-600 bg-gray-50 rounded-r-lg`}>
        ${i ? $`
          <div class=${l`p-4`}>
            <div class=${l`flex space-x-3`}>
              <img
                src=${n}
                @error=${(a) => a.currentTarget.src = J}
                class=${l`w-10 h-10 rounded-full object-cover`} />
              <div class=${l`flex-1`}>
                <textarea
                  rows="3"
                  .value=${this._commentText}
                  @input=${this._onInput}
                  class=${l`w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:outline-none`}
                  placeholder="Напишите ваш комментарий…"></textarea>
                <div class=${l`mt-2 flex justify-end`}>
                  <button
                    type="button"
                    @click=${this._send}
                    ?disabled=${s}
                    class=${l`px-4 py-2 text-sm rounded-xl ${s ? "bg-gray-200 text-gray-400" : "bg-sky-600 text-white"}`}>
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>` : ""}

        ${this.comments.map((a, c) => {
      var h, g, v, m;
      const d = a.myReaction === "like", u = a.myReaction === "dislike";
      return $`
            <div class=${l`px-4 pt-4 ${c === this.comments.length - 1 ? "pb-4" : ""}`}>
              <div class=${l`flex items-start space-x-3`}>
                <div class=${l`w-8 h-8 rounded-full bg-gray-200 overflow-hidden`}>
                  <img
                    src=${o(a.author)}
                    @error=${(y) => y.currentTarget.src = J}
                    class=${l`w-full h-full object-cover`} />
                </div>
                <div class=${l`flex-1`}>
                  <div class=${l`flex items-center space-x-2`}>
                    <span class=${l`font-medium text-sm`}>
                      ${((h = a.author) == null ? void 0 : h.fullname) ?? "Аноним"}
                    </span>
                    <span class=${l`text-xs text-gray-500`}>${a.date}</span>
                  </div>
                  <p class=${l`text-sm mt-1`}>${a.text}</p>
                  <div class=${l`mt-2 flex justify-between items-center`}>
                    <div class=${l`flex space-x-4`}>
                      <button
                        type="button"
                        @click=${() => this.dispatchEvent(new CustomEvent("comment-like", {
        detail: { reviewId: this.reviewId, commentId: a.id },
        bubbles: !0,
        composed: !0
      }))}
                        ?disabled=${!t || ((g = a.author) == null ? void 0 : g.id) === this.currentUser.id}
                        class=${l`flex items-center text-sm fill-current focus:outline-none ${d ? "text-sky-500" : "text-gray-500 hover:text-gray-700"}`}>
                        <svg class=${l`mr-1`} width="1em" height="1em"><use href="#ri-thumb-up-line"/></svg>
                        <span>${a.likes}</span>
                      </button>
                      <button
                        type="button"
                        @click=${() => this.dispatchEvent(new CustomEvent("comment-dislike", {
        detail: { reviewId: this.reviewId, commentId: a.id },
        bubbles: !0,
        composed: !0
      }))}
                        ?disabled=${!t || ((v = a.author) == null ? void 0 : v.id) === this.currentUser.id}
                        class=${l`flex items-center text-sm fill-current focus:outline-none ${u ? "text-red-500" : "text-gray-500 hover:text-gray-700"}`}>
                        <svg class=${l`mr-1`} width="1em" height="1em"><use href="#ri-thumb-down-line"/></svg>
                        <span>${a.dislikes}</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      @click=${() => this.dispatchEvent(new CustomEvent("comment-report", {
        detail: { reviewId: this.reviewId, commentId: a.id },
        bubbles: !0,
        composed: !0
      }))}
                      ?disabled=${!t || ((m = a.author) == null ? void 0 : m.id) === this.currentUser.id}
                      class=${l`flex items-center text-sm fill-current text-gray-500 hover:text-gray-700`}>
                      <svg class=${l`mr-1`} width="1em" height="1em"><use href="#ri-flag-line"/></svg>
                      <span>Пожаловаться</span>
                    </button>
                  </div>
                </div>
              </div>
              ${c < this.comments.length - 1 ? $`<hr class=${l`border-gray-200 mt-4`}>` : ""}
            </div>`;
    })}
      </div>
    `;
  }
}
A(Li, "properties", {
  comments: { type: Array },
  currentUser: { type: Object },
  reviewId: { type: Number },
  allowAnonymous: { type: Boolean },
  _commentText: { state: !0 }
});
customElements.define("comment-section", Li);
const ws = [
  { key: "positive", label: "Положительный", bgClass: l`bg-green-50`, textClass: l`text-green-700` },
  { key: "neutral", label: "Нейтральный", bgClass: l`bg-gray-100`, textClass: l`text-gray-700` },
  { key: "negative", label: "Отрицательный", bgClass: l`bg-red-50`, textClass: l`text-red-700` }
], ys = [
  { key: "joy", label: "Радость", bgClass: l`bg-amber-50`, textClass: l`text-amber-700` },
  { key: "interest", label: "Интерес", bgClass: l`bg-indigo-50`, textClass: l`text-indigo-700` },
  { key: "surprise", label: "Удивление", bgClass: l`bg-yellow-50`, textClass: l`text-yellow-700` },
  { key: "sadness", label: "Грусть", bgClass: l`bg-blue-50`, textClass: l`text-blue-700` },
  { key: "anger", label: "Злость", bgClass: l`bg-red-50`, textClass: l`text-red-700` },
  { key: "disgust", label: "Отвращение", bgClass: l`bg-lime-50`, textClass: l`text-lime-700` },
  { key: "fear", label: "Страх", bgClass: l`bg-blue-50`, textClass: l`text-blue-700` },
  { key: "guilt", label: "Вина", bgClass: l`bg-indigo-50`, textClass: l`text-indigo-700` },
  { key: "neutrality", label: "Нейтральность", bgClass: l`bg-gray-100`, textClass: l`text-gray-700` }
];
class Mi extends Z {
  constructor() {
    super(), this.currentUser = { avatar: "", name: "" }, this.highlighted = !1;
  }
  render() {
    const {
      id: t,
      author: r,
      date: s,
      sentiment: i = "neutral",
      emotion: n = "neutrality",
      rating: o,
      text: a,
      media: c = [],
      likes: d,
      dislikes: u,
      replies: h = [],
      showReplies: g,
      myReaction: v
    } = this.review, m = ws.find((C) => C.key === i) || ws[1], y = ys.find((C) => C.key === n) || ys[8], x = h.length > 0 ? h.length : this.review.commentsCount, S = x ? `Комментарии (${x})` : "Комментировать", U = this.highlighted ? l`p-4 bg-blue-50 bg-opacity-50 border border-blue-100 rounded-2xl mb-6` : l`p-4 border-b border-gray-100 mb-6`;
    return $`
      <article class=${U}>
        ${this.highlighted ? $`
          <div class=${l`mb-2 flex items-center justify-center fill-current`}>
            <svg class=${l`text-blue-500 mr-2`} width="1em" height="1em"><use href="#ri-thumb-up-fill"/></svg>
            <span class=${l`text-sm font-medium text-blue-700`}>Самый полезный отзыв</span>
          </div>` : ""}

        <div class=${l`flex items-start`}>
          <div class=${l`w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3`}>
            <img
              src="${r.avatar}"
              alt="Аватар ${r.name}"
              @error=${(C) => C.currentTarget.src = J}
              class=${l`w-full h-full object-cover`} />
          </div>
          <div class=${l`flex-1`}>
            <div class=${l`flex justify-between items-start`}>
              <div>
                ${r.id && r.id !== this.currentUser.id ? $`<a
                      href="http://localhost:3000/users/${r.id}"
                      class=${l`font-medium hover:text-gray-700 no-underline`}
                    >${r.fullname}</a>` : $`<div class=${l`font-medium`}>${r.fullname}</div>`}
                <div class=${l`text-sm text-gray-500`}>${s}</div>
                <div class=${l`flex items-center space-x-2 mb-2`}>
                  <span class=${`${l`px-2 py-1 text-xs rounded-full`} ${m.bgClass} ${m.textClass}`}>${m.label}</span>
                  <span class=${`${l`px-2 py-1 text-xs rounded-full`} ${y.bgClass} ${y.textClass}`}>${y.label}</span>
                </div>
              </div>
              <div class=${l`flex space-x-0.5`}>
                ${[1, 2, 3, 4, 5].map((C) => $`
                  <svg class=${l`${C <= o ? "text-yellow-400" : "text-gray-300"} text-base fill-current`} width="1em" height="1em">
                    <use href="#ri-star-fill"/>
                  </svg>`)}
              </div>
            </div>

            <p class=${l`mt-2 text-sm text-gray-800 mb-3`}>${a}</p>

            ${c.length ? $`
              <media-gallery
                .media=${c}
                @view-media=${(C) => this.dispatchEvent(new CustomEvent("view-media", {
      detail: { id: t, index: C.detail.index },
      bubbles: !0,
      composed: !0
    }))}>
              </media-gallery>` : ""}

            <div class=${l`mt-3 flex items-center justify-between`}>
              <div class=${l`flex space-x-4`}>
                <button
                  type="button"
                  @click=${() => this.dispatchEvent(new CustomEvent("review-like", {
      detail: { reviewId: t },
      bubbles: !0,
      composed: !0
    }))}
                  ?disabled=${!this.currentUser.isAuthenticated || this.currentUser.id === r.id}
                  class=${l`flex items-center text-sm fill-current focus:outline-none ${v === "like" ? "text-sky-500" : "text-gray-500 hover:text-gray-700"}`}>
                  <svg class=${l`mr-1`} width="1em" height="1em"><use href="#ri-thumb-up-line"/></svg>
                  <span>${d}</span>
                </button>
                <button
                  type="button"
                  @click=${() => this.dispatchEvent(new CustomEvent("review-dislike", {
      detail: { reviewId: t },
      bubbles: !0,
      composed: !0
    }))}
                  ?disabled=${!this.currentUser.isAuthenticated || this.currentUser.id === r.id}
                  class=${l`flex items-center text-sm fill-current focus:outline-none ${v === "dislike" ? "text-red-500" : "text-gray-500 hover:text-gray-700"}`}>
                  <svg class=${l`mr-1`} width="1em" height="1em"><use href="#ri-thumb-down-line"/></svg>
                  <span>${u}</span>
                </button>
                <button
                  type="button"
                  @click=${() => this.dispatchEvent(new CustomEvent("comment-toggle", {
      detail: { reviewId: t },
      bubbles: !0,
      composed: !0
    }))}
                  class=${l`flex items-center text-sm text-gray-500 hover:text-gray-700 fill-current focus:outline-none`}>
                  <svg class=${l`mr-1`} width="1em" height="1em"><use href="#ri-chat-1-line"/></svg>
                  <span>${S}</span>
                </button>
              </div>
              <button
                type="button"
                @click=${() => this.dispatchEvent(new CustomEvent("review-report", {
      detail: { reviewId: t },
      bubbles: !0,
      composed: !0
    }))}
                ?disabled=${!this.currentUser.isAuthenticated || this.currentUser.id === r.id}
                class=${l`flex items-center text-sm text-gray-500 hover:text-gray-700 fill-current focus:outline-none`}>
                <svg class=${l`mr-1`} width="1em" height="1em"><use href="#ri-flag-line"/></svg>
                <span>Пожаловаться</span>
              </button>
            </div>

            ${g ? $`
              <comment-section
                .comments=${h}
                .currentUser=${this.currentUser}
                .reviewId=${t}
                .allowAnonymous=${this.allowAnonymous}>
              </comment-section>` : ""}
          </div>
        </div>
      </article>
    `;
  }
}
A(Mi, "properties", {
  review: { type: Object },
  currentUser: { type: Object },
  highlighted: { type: Boolean, reflect: !0 },
  allowAnonymous: { type: Boolean }
});
customElements.define("review-item", Mi);
class Oi extends Z {
  constructor() {
    super(), this.reviews = [], this.currentUser = {};
  }
  render() {
    const t = Array.isArray(this.reviews) ? this.reviews : [];
    if (!t.length)
      return $`<div class=${l`text-center text-gray-500`}>Нет отзывов.</div>`;
    const r = t.reduce((s, i) => i.likes > s.likes ? i : s, t[0]).id;
    return $`
      <section class=${l`space-y-6`}>
        ${Ti(t, (s) => s.id, (s) => $`
          <review-item
            .review=${s}
            .currentUser=${this.currentUser}
            .allowAnonymous=${this.allowAnonymous}
            ?highlighted=${s.id === r}>
          </review-item>`)}
      </section>
    `;
  }
}
A(Oi, "properties", {
  reviews: { type: Array },
  currentUser: { type: Object },
  allowAnonymous: { type: Boolean }
});
customElements.define("reviews-list", Oi);
class Ui extends Z {
  constructor() {
    super();
    A(this, "_onSearch", (r) => {
      clearTimeout(this._searchDebounce), this._searchDebounce = setTimeout(() => {
        this._search = r.detail, this._page = 1, this._procCache.clear();
      }, 100);
    });
    A(this, "_onSort", (r) => {
      this._sortKey = r.detail.key, this._sortDir = r.detail.dir, this._page = 1, this._procCache.clear();
    });
    A(this, "_onFilter", (r) => {
      clearTimeout(this._filterDebounce), this._filterDebounce = setTimeout(() => {
        this._filter = r.detail, this._page = 1, this._procCache.clear();
      }, 100);
    });
    A(this, "_loadMore", () => {
      this._page++, this._procCache.clear();
    });
    this.reviews = [], this.currentUser = {}, this.pageSize = 5, this._page = 1, this._search = "", this._sortKey = "date", this._sortDir = "desc", this._filter = "all", this._procCache = /* @__PURE__ */ new Map();
  }
  _ensureArray(r) {
    return Array.isArray(r) ? r : (console.error("Expected array, got", r), []);
  }
  _parseDate(r) {
    const [s, i, n] = r.split(" "), o = {
      января: 0,
      февраля: 1,
      марта: 2,
      апреля: 3,
      мая: 4,
      июня: 5,
      июля: 6,
      августа: 7,
      сентября: 8,
      октября: 9,
      ноября: 10,
      декабря: 11
    };
    return new Date(Number(n), o[i] ?? 0, Number(s));
  }
  _topReview() {
    const r = this._ensureArray(this.reviews);
    return r.length ? r.reduce((s, i) => {
      const n = (s.likes || 0) - (s.dislikes || 0);
      return (i.likes || 0) - (i.dislikes || 0) > n ? i : s;
    }, r[0]) : null;
  }
  _processed(r = null) {
    const s = JSON.stringify({
      q: this._search.trim().toLowerCase(),
      f: this._filter,
      sk: this._sortKey,
      sd: this._sortDir,
      ex: r,
      u: this.currentUser.isAuthenticated
    });
    if (this._procCache.has(s))
      return [...this._procCache.get(s)];
    let i = [...this._ensureArray(this.reviews)];
    if (this._search) {
      const n = this._search.toLowerCase();
      i = i.filter((o) => o.text.toLowerCase().includes(n) || o.author.name.toLowerCase().includes(n));
    }
    return this._filter !== "all" && (/^[1-5]$/.test(this._filter) ? i = i.filter((n) => n.rating === +this._filter) : i = i.filter((n) => n.sentiment === this._filter)), i.sort((n, o) => {
      let a = 0;
      if (this._sortKey === "date")
        a = this._parseDate(n.date) - this._parseDate(o.date);
      else {
        const c = (n.likes || 0) - (n.dislikes || 0), d = (o.likes || 0) - (o.dislikes || 0);
        a = c - d;
      }
      return this._sortDir === "desc" ? -a : a;
    }), r != null && (i = i.filter((n) => n.id !== r)), this._procCache.set(s, i), [...i];
  }
  _slice(r) {
    return this._processed(r).slice(0, this._page * this.pageSize);
  }
  updated(r) {
    (r.has("reviews") || r.has("currentUser") || r.has("_search") || r.has("_filter") || r.has("_sortKey") || r.has("_sortDir") || r.has("_page")) && this._procCache.clear();
  }
  render() {
    const r = this._ensureArray(this.reviews).flatMap((u) => u.media || []), s = this._topReview(), i = (s == null ? void 0 : s.id) ?? null, n = this._slice(i), o = this._processed(i).length, a = n.length, c = a < o, d = s ? [s, ...n] : n;
    return $`
      ${r.length ? $`
        <div class=${l`mb-6`}>
          <media-gallery
            .media=${r}
            @view-media=${(u) => this.dispatchEvent(new CustomEvent("view-media", {
      detail: { media: r, index: u.detail.index },
      bubbles: !0,
      composed: !0
    }))}>
          </media-gallery>` : ""}

      <reviews-filters
        .searchText=${this._search}
        .sortBy=${`${this._sortKey}-${this._sortDir}`}
        .active=${this._filter}
        @search-change=${this._onSearch}
        @sort-change=${this._onSort}
        @filter-change=${this._onFilter}>
      </reviews-filters>

      <reviews-list
        .reviews=${d}
        .currentUser=${this.currentUser}
        .allowAnonymous=${this.allowAnonymous}>
      </reviews-list>

      ${o > 0 ? $`
        <div class=${l`mt-8 flex flex-col items-center`}>
          <div class=${l`text-sm text-gray-500 mb-4`}>
            Показано ${a} из ${o} отзывов
          </div>
          ${c ? $`
            <button @click=${this._loadMore}
                    class=${l`px-6 py-3 bg-gray-200 bg-opacity-60 rounded-xl hover:bg-gray-200 w-full focus:outline-none`}>
              Показать ещё
              <svg width="1em" height="1em" class=${l`inline ml-1 fill-current`}>
                <use href="#ri-arrow-down-s-line"></use>
              </svg>
            </button>` : ""}
        </div>` : ""}
    `;
  }
}
A(Ui, "properties", {
  reviews: { type: Array },
  currentUser: { type: Object },
  pageSize: { type: Number },
  allowAnonymous: { type: Boolean },
  _page: { state: !0 },
  _search: { state: !0 },
  _sortKey: { state: !0 },
  _sortDir: { state: !0 },
  _filter: { state: !0 }
});
customElements.define("reviews-section", Ui);
class zi extends Z {
  constructor() {
    super(), this.searchText = "", this.sortBy = "date-desc", this.active = "all";
  }
  _onSearch(t) {
    this.searchText = t.target.value, this.dispatchEvent(new CustomEvent("search-change", {
      detail: this.searchText,
      bubbles: !0,
      composed: !0
    }));
  }
  _onSort(t) {
    this.sortBy = t.target.value;
    const [r, s] = this.sortBy.split("-");
    this.dispatchEvent(new CustomEvent("sort-change", {
      detail: { key: r, dir: s },
      bubbles: !0,
      composed: !0
    }));
  }
  _onFilter(t) {
    this.active = t.currentTarget.dataset.f, this.dispatchEvent(new CustomEvent("filter-change", {
      detail: this.active,
      bubbles: !0,
      composed: !0
    }));
  }
  _btn(t) {
    return this.active === t ? l`border-sky-600 bg-sky-100` : l`border-gray-200 bg-gray-50 hover:bg-gray-100`;
  }
  render() {
    return $`
      <div class=${l`mb-6`}>
        <div class=${l`flex items-center space-x-3 mb-4`}>
          <div class=${l`relative flex-1`}>
            <input
              .value=${this.searchText}
              @input=${this._onSearch}
              placeholder="Поиск в вопросах"
              class=${l`w-full bg-gray-100 py-2 pl-10 pr-3 rounded-md focus:ring-2 focus:ring-sky-600 focus:outline-none`} />
            <div class=${l`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
              <svg width="1em" height="1em" class=${l`text-gray-500`}><use href="#ri-search-line"/></svg>
            </div>
          </div>
          <select @change=${this._onSort}
                  class=${l`bg-gray-100 py-2 pl-3 pr-8 rounded-md text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none`}>
            <option value="date-asc"  ?selected=${this.sortBy === "date-asc"}>По дате (старые)</option>
            <option value="date-desc" ?selected=${this.sortBy === "date-desc"}>По дате (новые)</option>
            <option value="pop-asc"   ?selected=${this.sortBy === "pop-asc"}>Популярность (по возрастанию)</option>
            <option value="pop-desc"  ?selected=${this.sortBy === "pop-desc"}>Популярность (по убыванию)</option>
          </select>
        </div>
        <div class=${l`flex flex-wrap gap-2`}>
          <button data-f="all" @click=${this._onFilter}
                  class=${`${l`border px-3 py-2 rounded-xl focus:outline-none`} ${this._btn("all")}`}>Все</button>
          <button data-f="answered" @click=${this._onFilter}
                  class=${`${l`border px-3 py-2 rounded-xl focus:outline-none`} ${this._btn("answered")}`}>С ответом</button>
          <button data-f="unanswered" @click=${this._onFilter}
                  class=${`${l`border px-3 py-2 rounded-xl focus:outline-none`} ${this._btn("unanswered")}`}>Без ответа</button>
        </div>
      </div>
    `;
  }
}
A(zi, "properties", {
  searchText: { type: String },
  sortBy: { type: String },
  active: { type: String }
});
customElements.define("qa-filters", zi);
class Di extends Z {
  constructor() {
    super(), this.answers = [], this.currentUser = {}, this._answerText = "", this.allowAnonymous = !1;
  }
  _onInput(t) {
    this._answerText = t.target.value;
  }
  _send() {
    const t = this._answerText.trim();
    t && (this.dispatchEvent(new CustomEvent("send-answer", {
      detail: { questionId: this.questionId, text: t },
      bubbles: !0,
      composed: !0
    })), this._answerText = "");
  }
  render() {
    const { isAuthenticated: t = !1, avatar: r } = this.currentUser, s = !this._answerText.trim(), i = t || this.allowAnonymous, n = t ? r || J : this.allowAnonymous ? ie : "", o = (a) => a && typeof a == "object" && a.avatar ? a.avatar : !a || typeof a == "string" ? ie : J;
    return $`
      <div class=${l`mt-4 border-l-2 border-sky-600 bg-gray-50 rounded-r-lg`}>
        ${i ? $`
          <div class=${l`p-4`}>
            <div class=${l`flex space-x-3`}>
              <img
                src=${n}
                @error=${(a) => a.currentTarget.src = J}
                class=${l`w-10 h-10 rounded-full object-cover`} />
              <div class=${l`flex-1`}>
                <textarea
                  rows="3"
                  .value=${this._answerText}
                  @input=${this._onInput}
                  class=${l`w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:outline-none`}
                  placeholder="Напишите ваш ответ…"></textarea>
                <div class=${l`mt-2 flex justify-end`}>
                  <button
                    type="button"
                    @click=${this._send}
                    ?disabled=${s}
                    class=${l`px-4 py-2 text-sm rounded-xl ${s ? "bg-gray-200 text-gray-400" : "bg-sky-600 text-white"}`}>
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>` : ""}

        ${this.answers.map((a, c) => {
      var h, g, v, m;
      const d = a.myReaction === "like", u = a.myReaction === "dislike";
      return $`
            <div class=${l`px-4 pt-4 ${c === this.answers.length - 1 ? "pb-4" : ""}`}>
              <div class=${l`flex items-start space-x-3`}>
                <img
                  src=${o(a.author)}
                  @error=${(y) => y.currentTarget.src = J}
                  class=${l`w-8 h-8 rounded-full`} />
                <div class=${l`flex-1`}>
                  <div class=${l`flex items-center space-x-2`}>
                    <span class=${l`font-medium text-sm`}>
                      ${((h = a.author) == null ? void 0 : h.fullname) ?? "Аноним"}
                    </span>
                    <span class=${l`text-xs text-gray-500`}>${a.date}</span>
                  </div>
                  <p class=${l`text-sm mt-1`}>${a.text}</p>
                  <div class=${l`mt-2 flex justify-between items-center`}>
                    <div class=${l`flex space-x-4`}>
                      <button
                        type="button"
                        @click=${() => this.dispatchEvent(new CustomEvent("answer-like", {
        detail: { questionId: this.questionId, answerId: a.id },
        bubbles: !0,
        composed: !0
      }))}
                        ?disabled=${!t || ((g = a.author) == null ? void 0 : g.id) === this.currentUser.id}
                        class=${l`flex items-center text-sm fill-current focus:outline-none ${d ? "text-sky-500" : "text-gray-500 hover:text-gray-700"}`}>
                        <svg class=${l`mr-1`} width="1em" height="1em"><use href="#ri-thumb-up-line"/></svg>
                        <span>${a.likes}</span>
                      </button>
                      <button
                        type="button"
                        @click=${() => this.dispatchEvent(new CustomEvent("answer-dislike", {
        detail: { questionId: this.questionId, answerId: a.id },
        bubbles: !0,
        composed: !0
      }))}
                        ?disabled=${!t || ((v = a.author) == null ? void 0 : v.id) === this.currentUser.id}
                        class=${l`flex items-center text-sm fill-current focus:outline-none ${u ? "text-red-500" : "text-gray-500 hover:text-gray-700"}`}>
                        <svg class=${l`mr-1`} width="1em" height="1em"><use href="#ri-thumb-down-line"/></svg>
                        <span>${a.dislikes}</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      @click=${() => this.dispatchEvent(new CustomEvent("answer-report", {
        detail: { questionId: this.questionId, answerId: a.id },
        bubbles: !0,
        composed: !0
      }))}
                      ?disabled=${!t || ((m = a.author) == null ? void 0 : m.id) === this.currentUser.id}
                      class=${l`flex items-center text-sm fill-current text-gray-500 hover:text-gray-700`}>
                      <svg class=${l`mr-1`} width="1em" height="1em"><use href="#ri-flag-line"/></svg>
                      <span>Пожаловаться</span>
                    </button>
                  </div>
                </div>
              </div>
              ${c < this.answers.length - 1 ? $`<hr class=${l`border-gray-200 mt-4`}>` : ""}
            </div>`;
    })}
      </div>
    `;
  }
}
A(Di, "properties", {
  answers: { type: Array },
  currentUser: { type: Object },
  questionId: { type: Number },
  allowAnonymous: { type: Boolean },
  _answerText: { state: !0 }
});
customElements.define("answer-section", Di);
class Hi extends Z {
  constructor() {
    super(), this.currentUser = { avatar: "", name: "" }, this.highlighted = !1;
  }
  render() {
    const {
      id: t,
      author: r,
      date: s,
      text: i,
      likes: n,
      dislikes: o,
      answers: a = [],
      showAnswers: c,
      myReaction: d
    } = this.question, u = this.highlighted ? l`p-4 bg-blue-50 bg-opacity-50 border border-blue-100 rounded-2xl mb-6` : l`p-4 border-b border-gray-100 mb-6`, h = a.length > 0 ? a.length : this.question.answersCount, g = h ? `Ответы (${h})` : "Ответить";
    return $`
      <article class=${u}>
        ${this.highlighted ? $`
          <div class=${l`mb-2 flex items-center justify-center fill-current`}>
            <svg class=${l`text-blue-500 mr-2`} width="1em" height="1em"><use href="#ri-thumb-up-fill"/></svg>
            <span class=${l`text-sm font-medium text-blue-700`}>Самый популярный вопрос</span>
          </div>` : ""}

        <div class=${l`flex items-start`}>
          <div class=${l`w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3`}>
            <img
              src=${r.avatar}
              @error=${(v) => v.currentTarget.src = J}
              class=${l`w-full h-full object-cover`} />
          </div>
          <div class=${l`flex-1`}>
            <div class=${l`flex justify-between items-start mb-2`}>
              <div>
                <div class=${l`font-medium`}>${r.fullname}</div>
                <div class=${l`text-sm text-gray-500`}>${s}</div>
              </div>
            </div>
            <p class=${l`text-sm text-gray-800 mb-3`}>${i}</p>

            <div class=${l`mt-3 flex items-center justify-between`}>
              <div class=${l`flex space-x-4`}>
                <button
                  type="button"
                  @click=${() => this.dispatchEvent(new CustomEvent("question-like", {
      detail: { questionId: t },
      bubbles: !0,
      composed: !0
    }))}
                  ?disabled=${!this.currentUser.isAuthenticated || r.id === this.currentUser.id}
                  class=${l`flex items-center text-sm fill-current focus:outline-none ${d === "like" ? "text-sky-500" : "text-gray-500 hover:text-gray-700"}`}>
                  <svg class=${l`mr-1`} width="1em" height="1em"><use href="#ri-thumb-up-line"/></svg>
                  <span>${n}</span>
                </button>
                <button
                  type="button"
                  @click=${() => this.dispatchEvent(new CustomEvent("question-dislike", {
      detail: { questionId: t },
      bubbles: !0,
      composed: !0
    }))}
                  ?disabled=${!this.currentUser.isAuthenticated || r.id === this.currentUser.id}
                  class=${l`flex items-center text-sm fill-current focus:outline-none ${d === "dislike" ? "text-red-500" : "text-gray-500 hover:text-gray-700"}`}>
                  <svg class=${l`mr-1`} width="1em" height="1em"><use href="#ri-thumb-down-line"/></svg>
                  <span>${o}</span>
                </button>
                <button
                  type="button"
                  @click=${() => this.dispatchEvent(new CustomEvent("answer-toggle", {
      detail: { questionId: t },
      bubbles: !0,
      composed: !0
    }))}
                  class=${l`flex items-center text-sm text-gray-500 hover:text-gray-700 fill-current focus:outline-none`}>
                  <svg class=${l`mr-1`} width="1em" height="1em"><use href="#ri-chat-1-line"/></svg>
                  <span>${g}</span>
                </button>
              </div>
              <button
                type="button"
                @click=${() => this.dispatchEvent(new CustomEvent("question-report", {
      detail: { questionId: t },
      bubbles: !0,
      composed: !0
    }))}
                ?disabled=${!this.currentUser.isAuthenticated || r.id === this.currentUser.id}
                class=${l`flex items-center text-sm fill-current text-gray-500 hover:text-gray-700 focus:outline-none`}>
                <svg class=${l`mr-1`} width="1em" height="1em"><use href="#ri-flag-line"/></svg>
                <span>Пожаловаться</span>
              </button>
            </div>

            ${c ? $`
              <answer-section
                .answers=${a}
                .currentUser=${this.currentUser}
                .questionId=${t}
                .allowAnonymous=${this.allowAnonymous}>
              </answer-section>` : ""}
          </div>
        </div>
      </article>
    `;
  }
}
A(Hi, "properties", {
  question: { type: Object },
  currentUser: { type: Object },
  highlighted: { type: Boolean, reflect: !0 },
  allowAnonymous: { type: Boolean }
});
customElements.define("qa-item", Hi);
class Bi extends Z {
  constructor() {
    super(), this.questions = [], this.currentUser = {};
  }
  render() {
    const t = Array.isArray(this.questions) ? this.questions : [];
    if (!t.length)
      return $`<div class=${l`text-center text-gray-500`}>Нет вопросов.</div>`;
    const r = t.reduce((s, i) => {
      const n = (s.likes || 0) - (s.dislikes || 0);
      return (i.likes || 0) - (i.dislikes || 0) > n ? i : s;
    }, t[0]).id;
    return $`
      <section class=${l`space-y-6`}>
        ${Ti(
      t,
      (s) => s.id,
      (s) => $`
            <qa-item
              .question=${s}
              .currentUser=${this.currentUser}
              .allowAnonymous=${this.allowAnonymous}
              ?highlighted=${s.id === r}>
            </qa-item>
          `
    )}
      </section>
    `;
  }
}
A(Bi, "properties", {
  questions: { type: Array },
  currentUser: { type: Object },
  allowAnonymous: { type: Boolean }
});
customElements.define("qa-list", Bi);
class Fi extends Z {
  constructor() {
    super();
    A(this, "_onSearch", (r) => {
      clearTimeout(this._searchDebounce), this._searchDebounce = setTimeout(() => {
        this._search = r.detail, this._page = 1, this._procCache.clear();
      }, 200);
    });
    A(this, "_onSort", (r) => {
      this._sortKey = r.detail.key, this._sortDir = r.detail.dir, this._page = 1, this._procCache.clear();
    });
    A(this, "_onFilter", (r) => {
      clearTimeout(this._filterDebounce), this._filterDebounce = setTimeout(() => {
        this._filter = r.detail, this._page = 1, this._procCache.clear();
      }, 200);
    });
    A(this, "_loadMore", () => {
      this._page += 1, this._procCache.clear();
    });
    this.questions = [], this.currentUser = {}, this.pageSize = 5, this._page = 1, this._search = "", this._sortKey = "date", this._sortDir = "desc", this._filter = "all", this._procCache = /* @__PURE__ */ new Map(), this._searchDebounce = null, this._filterDebounce = null;
  }
  _ensureArray(r) {
    return Array.isArray(r) ? r : [];
  }
  _parseDate(r) {
    const [s, i, n] = r.split(" "), o = {
      января: 0,
      февраля: 1,
      марта: 2,
      апреля: 3,
      мая: 4,
      июня: 5,
      июля: 6,
      августа: 7,
      сентября: 8,
      октября: 9,
      ноября: 10,
      декабря: 11
    };
    return new Date(+n, o[i] ?? 0, +s);
  }
  _topQuestion() {
    const r = this._ensureArray(this.questions);
    return r.length ? r.reduce((s, i) => {
      const n = (s.likes || 0) - (s.dislikes || 0);
      return (i.likes || 0) - (i.dislikes || 0) > n ? i : s;
    }, r[0]) : null;
  }
  _processed(r = null) {
    const s = JSON.stringify({
      q: this._search.trim().toLowerCase(),
      f: this._filter,
      sk: this._sortKey,
      sd: this._sortDir,
      ex: r,
      u: this.currentUser.isAuthenticated
    });
    if (this._procCache.has(s))
      return [...this._procCache.get(s)];
    let i = [...this._ensureArray(this.questions)];
    if (this._search) {
      const n = this._search.toLowerCase();
      i = i.filter(
        (o) => o.text.toLowerCase().includes(n) || o.author.name.toLowerCase().includes(n)
      );
    }
    return this._filter === "answered" ? i = i.filter((n) => {
      var o;
      return (((o = n.answers) == null ? void 0 : o.length) || 0) > 0;
    }) : this._filter === "unanswered" && (i = i.filter((n) => {
      var o;
      return (((o = n.answers) == null ? void 0 : o.length) || 0) === 0;
    })), i.sort((n, o) => {
      let a = 0;
      return this._sortKey === "date" ? a = this._parseDate(n.date) - this._parseDate(o.date) : a = (n.likes || 0) - (n.dislikes || 0) - ((o.likes || 0) - (o.dislikes || 0)), this._sortDir === "desc" ? -a : a;
    }), r !== null && (i = i.filter((n) => n.id !== r)), this._procCache.set(s, i), [...i];
  }
  _slice(r) {
    return this._processed(r).slice(0, this._page * this.pageSize);
  }
  updated(r) {
    (r.has("questions") || r.has("currentUser") || r.has("_search") || r.has("_filter") || r.has("_sortKey") || r.has("_sortDir") || r.has("_page")) && this._procCache.clear();
  }
  render() {
    const r = this._ensureArray(this.questions).flatMap((u) => u.media || []), s = this._topQuestion(), i = (s == null ? void 0 : s.id) ?? null, n = this._slice(i), o = this._processed(i).length, a = n.length, c = a < o, d = s ? [s, ...n] : n;
    return $`
      ${r.length ? $`
        <div class=${l`mb-6`}>
          <media-gallery
            .media=${r}
            @view-media=${(u) => this.dispatchEvent(new CustomEvent("view-media", {
      detail: { media: r, index: u.detail.index },
      bubbles: !0,
      composed: !0
    }))}>
          </media-gallery>
        </div>` : ""}

      <qa-filters
        .searchText=${this._search}
        .sortBy=${`${this._sortKey}-${this._sortDir}`}
        .active=${this._filter}
        @search-change=${this._onSearch}
        @sort-change=${this._onSort}
        @filter-change=${this._onFilter}>
      </qa-filters>

      <qa-list
        .questions=${d}
        .currentUser=${this.currentUser}
        .allowAnonymous=${this.allowAnonymous}>
      </qa-list>

      ${o > 0 ? $`
        <div class=${l`mt-8 flex flex-col items-center`}>
          <div class=${l`text-sm text-gray-500 mb-4`}>
            Показано ${a} из ${o} вопросов
          </div>
          ${c ? $`
            <button @click=${this._loadMore}
                    class=${l`px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 w-full`}>
              Показать ещё
              <svg width="1em" height="1em" class=${l`inline ml-1`}><use href="#ri-arrow-down-s-line"/></svg>
            </button>` : ""}
        </div>` : ""}
    `;
  }
}
A(Fi, "properties", {
  questions: { type: Array },
  currentUser: { type: Object },
  pageSize: { type: Number },
  allowAnonymous: { type: Boolean },
  _page: { state: !0 },
  _search: { state: !0 },
  _sortKey: { state: !0 },
  _sortDir: { state: !0 },
  _filter: { state: !0 }
});
customElements.define("qa-section", Fi);
class We extends Z {
  constructor() {
    super(), this.open = !1, this.setAttribute("hidden", "");
  }
  connectedCallback() {
    var t;
    (t = super.connectedCallback) == null || t.call(this), this.shadowRoot.adoptedStyleSheets = [Pe.target];
  }
  // ткрыть модалку
  openModal() {
    this.open = !0, this.removeAttribute("hidden");
  }
  // закрыть модалку
  closeModal() {
    this.open = !1, this.setAttribute("hidden", ""), this.dispatchEvent(new CustomEvent("modal-close"));
  }
  _onOverlay(t) {
    t.target === this && this.closeModal();
  }
  render() {
    return $`
      <div @click=${this._onOverlay}>
        <slot></slot>
      </div>
    `;
  }
}
A(We, "properties", {
  open: { type: Boolean, reflect: !0 }
});
customElements.define("modal-base", We);
class ji extends Z {
  constructor() {
    super();
    // Обработчики событий
    A(this, "_onInput", (r) => {
      this._add(r.target.files), r.target.value = "";
    });
    A(this, "_onDrag", (r) => {
      r.preventDefault(), this._hover = r.type === "dragover";
    });
    A(this, "_onDrop", (r) => {
      r.preventDefault(), this._hover = !1, this._add(r.dataTransfer.files);
    });
    this.accept = "", this.multiple = !1, this.maxFiles = 1 / 0, this._files = [], this._hover = !1;
  }
  get files() {
    return this._files;
  }
  // Уведомляем о смене списка
  _notify() {
    this.dispatchEvent(new CustomEvent("files-change", {
      detail: [...this._files],
      bubbles: !0,
      composed: !0
    }));
  }
  // Добавляем часть из переданных файлов, с учётом ограничения
  _add(r) {
    const s = Array.from(r), i = this.multiple ? Math.max(0, this.maxFiles - this._files.length) : 1;
    if (i <= 0) return;
    const n = s.slice(0, i);
    this._files = this.multiple ? [...this._files, ...n] : n, this._notify();
  }
  // Удаляем выбранный
  _remove(r) {
    URL.revokeObjectURL(this._files[r]._url), this._files = this._files.filter((s, i) => i !== r), this._notify();
  }
  clear() {
    this._files.forEach((r) => r._url && URL.revokeObjectURL(r._url)), this._files = [], this._notify();
  }
  render() {
    const r = this._hover ? l`border-sky-600` : l`border-gray-300 hover:border-sky-600`;
    return $`
      <div class=${l`space-y-4`}>

        <!-- зона выбора / дропа -->
        <label
          @dragover=${this._onDrag}
          @dragleave=${this._onDrag}
          @drop=${this._onDrop}
          class="${l`block cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition`} ${r}"
        >
          <div class=${l`w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center`}>
            <svg width="1.5em" height="1.5em" class=${l`text-gray-500`}>
              <use href="#ri-upload-2-line"></use>
            </svg>
          </div>
          <p class=${l`text-sm text-gray-500`}>
            Перетащите сюда или <span class=${l`text-sky-600 underline`}>выберите файл</span>
          </p>
          ${this.accept ? $`
            <p class=${l`text-xs text-gray-400 mt-1`}>
              ${this.accept} ${this.multiple ? `(макс. ${this.maxFiles})` : ""}
            </p>` : ""}
          <input
            type="file"
            id="file-input"
            ?multiple=${this.multiple}
            accept=${this.accept}
            class=${l`hidden`}
            @change=${this._onInput}
          >
        </label>

        <!-- превью выбранных файлов -->
        ${this._files.length ? $`
          <div class=${l`flex flex-wrap gap-2`}>
            ${this._files.map((s, i) => {
      s._url || (s._url = URL.createObjectURL(s));
      const o = s.type.startsWith("image/") ? $`<img src=${s._url} class=${l`w-16 h-16 object-cover rounded`} />` : $`
                  <div class=${l`w-16 h-16 rounded bg-gray-200 flex items-center justify-center text-xs`}>
                    ${s.name.split(".").pop().toUpperCase()}
                  </div>`;
      return $`
                <div class=${l`relative group`}>
                  ${o}
                  <button
                    @click=${() => this._remove(i)}
                    class=${l`
                      absolute -top-2 -right-2 hidden group-hover:flex
                      w-5 h-5 rounded-full bg-black bg-opacity-60 text-white text-xs
                      items-center justify-center`}
                  >&times;</button>
                </div>`;
    })}
          </div>` : ""}
      </div>
    `;
  }
}
A(ji, "properties", {
  accept: { type: String },
  multiple: { type: Boolean },
  maxFiles: { type: Number, attribute: "max-files" },
  _files: { state: !0 },
  _hover: { state: !0 }
});
customElements.define("file-upload", ji);
class Ni extends We {
  openModal() {
    super.openModal();
    const t = this.renderRoot.querySelector("file-upload");
    t && t.clear();
  }
  constructor() {
    super(), this.rating = 0, this.hoverRating = 0, this._reviewText = "", this.files = [];
  }
  _setRating(t) {
    this.rating = t;
  }
  _setHover(t) {
    this.hoverRating = t;
  }
  _clearHover() {
    this.hoverRating = 0;
  }
  _onTextInput(t) {
    this._reviewText = t.target.value;
  }
  _send() {
    const t = this._reviewText.trim();
    !t || !this.rating || (this.dispatchEvent(new CustomEvent("submit-review", {
      detail: { rating: this.rating, text: t, files: this.files },
      bubbles: !0,
      composed: !0
    })), this._reviewText = "", this.rating = 0, this.closeModal());
  }
  render() {
    const t = this._reviewText.trim() && this.rating > 0;
    return $`
      <div class="${l`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}">
        <div class="${l`bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden`}">
          <header class="${l`flex justify-between items-center p-4 border-b border-gray-200`}">
            <h3 class="${l`font-medium`}">Оставить отзыв</h3>
            <button @click=${this.closeModal}
                    class="${l`text-gray-500 hover:text-gray-700 focus:outline-none`}">
              <svg width="1em" height="1em"><use href="#ri-close-line"/></svg>
            </button>
          </header>

          <section class="${l`p-6 space-y-6`}">
            <!-- Рейтинг -->
            <div>
              <label class="${l`block text-sm font-medium mb-2`}">Ваша оценка</label>
              <div class="${l`flex space-x-1`}">
                ${[1, 2, 3, 4, 5].map((r) => $`
                  <svg
                    @click=${() => this._setRating(r)}
                    @mouseenter=${() => this._setHover(r)}
                    @mouseleave=${() => this._clearHover()}
                    class=${l`
                      text-2xl cursor-pointer fill-current
                      ${(this.hoverRating || this.rating) >= r ? "text-yellow-400" : "text-gray-300"}
                    `}
                    width="1em" height="1em"
                  >
                    <use href="#ri-star-fill"></use>
                  </svg>`)}
              </div>
            </div>

            <!-- Текст -->
            <div>
              <label class="${l`block text-sm font-medium mb-2`}">Ваш отзыв</label>
              <textarea
                .value=${this._reviewText}
                @input=${this._onTextInput}
                placeholder="Напишите ваш отзыв…"
                class="${l`mb-2 w-full border border-gray-300 rounded-xl p-3 h-32 focus:ring-2 focus:ring-sky-600 focus:outline-none`}">
              </textarea>
            </div>

            <!-- Файлы -->
            <file-upload
              accept="image/*"
              multiple
              max-files="5"
              @files-change=${(r) => this.files = r.detail}
            ></file-upload>

            <footer class="${l`flex justify-end space-x-3`}">
              <button @click=${this.closeModal}
                      class="${l`px-4 py-2 text-sm border bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-xl focus:outline-none`}">
                Отмена
              </button>
              <button
                @click=${this._send}
                ?disabled=${!t}
                class="${l`px-4 py-2 text-sm rounded-xl focus:outline-none`} ${t ? "bg-sky-600 text-white hover:bg-opacity-90" : "bg-gray-200 text-gray-400 cursor-not-allowed"}">
                Отправить
              </button>
            </footer>
          </section>
        </div>
      </div>
    `;
  }
}
A(Ni, "properties", {
  rating: { type: Number, state: !0 },
  hoverRating: { type: Number, state: !0 },
  _reviewText: { type: String, state: !0 },
  files: { type: Array }
});
customElements.define("add-review-modal", Ni);
class Pi extends We {
  constructor() {
    super(), this._questionText = "", this.files = [];
  }
  _onInput(t) {
    this._questionText = t.target.value;
  }
  _send() {
    const t = this._questionText.trim();
    t && (this.dispatchEvent(new CustomEvent("submit-question", {
      detail: { text: t, files: this.files },
      bubbles: !0,
      composed: !0
    })), this._questionText = "", this.closeModal());
  }
  render() {
    const t = !this._questionText.trim();
    return $`
      <div class="${l`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}">
        <div class="${l`bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden`}">
          <header class="${l`flex justify-between items-center p-4 border-b border-gray-200`}">
            <h3 class="${l`font-medium`}">Задать вопрос</h3>
            <button 
              @click=${this.closeModal} 
              class="${l`text-gray-500 focus:outline-none`}">
              <svg width="1em" height="1em"><use href="#ri-close-line"/></svg>
            </button>
          </header>

          <section class="${l`p-6 space-y-6`}">
            <textarea
              .value=${this._questionText}
              @input=${this._onInput}
              class="${l`w-full border border-gray-300 rounded-xl p-3 h-32 focus:ring-2 focus:ring-sky-600 focus:outline-none`}"
              placeholder="Напишите ваш вопрос…">
            </textarea>

            <footer class="${l`flex justify-end space-x-3`}">
              <button 
                @click=${this.closeModal}
                class="${l`px-4 py-2 text-sm border bg-gray-100 hover:bg-gray-200 hover:bg-opacity-80 border-gray-300 rounded-xl focus:outline-none`}">
                Отмена
              </button>
              <button 
                @click=${this._send}
                ?disabled=${t}
                class="${l`px-4 py-2 text-sm rounded-xl focus:outline-none`} ${t ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-sky-600 text-white hover:bg-opacity-90"}">
                Отправить
              </button>
            </footer>
          </section>
        </div>
      </div>
    `;
  }
}
A(Pi, "properties", {
  _questionText: { state: !0 },
  files: { type: Array }
});
customElements.define("add-question-modal", Pi);
class xr extends We {
  constructor() {
    super(), this.media = [], this.index = 0, this._touchX = 0, this._onKeyDown = this._onKeyDown.bind(this);
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("keydown", this._onKeyDown);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("keydown", this._onKeyDown);
  }
  setMedia(t, r = 0) {
    this.media = t, this.index = r, this.openModal();
  }
  _prev() {
    this.index > 0 && this.index--;
  }
  _next() {
    this.index < this.media.length - 1 && this.index++;
  }
  _onTouchStart(t) {
    this._touchX = t.touches[0].clientX;
  }
  _onTouchEnd(t) {
    const r = t.changedTouches[0].clientX - this._touchX;
    r > 40 ? this._prev() : r < -40 && this._next();
  }
  _onKeyDown(t) {
    this.opened && (t.key === "Escape" && this.closeModal(), t.key === "ArrowLeft" && this._prev(), t.key === "ArrowRight" && this._next());
  }
  render() {
    return this.media.length ? $`
    <div class=${l`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm`}>
      <div class=${l`relative flex flex-col items-center w-full h-full max-w-full max-h-full p-4 sm:p-8`} 
        @touchstart=${this._onTouchStart} 
        @touchend=${this._onTouchEnd}>
        <button 
          @click=${this.closeModal} 
          class=${l`absolute top-3 right-3 sm:top-5 sm:right-5 p-3 rounded-full bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 focus:outline-none`} aria-label="Close">
          <svg width="1.5em" height="1.5em" class=${l`text-white`}><use href="#ri-close-line"/></svg>
        </button>
        <button 
          @click=${this._prev} 
          ?hidden=${this.index === 0} 
          class=${l`absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 p-4 sm:p-3 rounded-full bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 focus:outline-none`} aria-label="Previous">
          <svg width="2em" height="2em" class=${l`text-white`}><use href="#ri-arrow-left-s-line"/></svg>
        </button>
        <div class=${l`flex-grow flex items-center justify-center w-full`}>
          <img loading="lazy" src=${this.media[this.index]} class=${l`object-contain w-full max-w-full h-auto max-h-[70vh] sm:max-h-[85vh] md:max-h-[90vh] rounded-lg shadow-lg transition-transform duration-200`} />
        </div>
        <button 
          @click=${this._next} 
          ?hidden=${this.index === this.media.length - 1} 
          class=${l`absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 p-4 sm:p-3 rounded-full bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 focus:outline-none`} aria-label="Next">
          <svg width="2em" height="2em" class=${l`text-white`}><use href="#ri-arrow-right-s-line"/></svg>
        </button>
        <div class=${l`mt-4 text-sm sm:text-base text-white bg-black bg-opacity-60 px-4 py-1 rounded-full`}>
          ${this.index + 1} / ${this.media.length}
        </div>
      </div>
    </div>
  ` : "";
  }
}
A(xr, "properties", {
  media: { type: Array },
  index: { type: Number },
  _touchX: { type: Number }
}), A(xr, "styles", Cs`
    .fade-enter {
      opacity: 0;
      transition: opacity 200ms ease-in;
    }
    .fade-enter-active {
      opacity: 1;
    }
    .fade-exit {
      opacity: 1;
      transition: opacity 200ms ease-out;
    }
    .fade-exit-active {
      opacity: 0;
    }
  `);
customElements.define("media-view-modal", xr);
class Ii extends We {
  constructor() {
    super(), this.target = {}, this._selectedReason = "", this._extraText = "";
  }
  _onReasonChange(t) {
    this._selectedReason = t.target.value;
  }
  _onExtraInput(t) {
    this._extraText = t.target.value;
  }
  _send() {
    if (!this._selectedReason) return;
    const { type: t, reviewId: r, commentId: s, questionId: i, answerId: n } = this.target;
    this.dispatchEvent(new CustomEvent("submit-report", {
      detail: {
        type: t,
        reviewId: r,
        commentId: s,
        questionId: i,
        answerId: n,
        reason: this._selectedReason,
        text: this._extraText.trim()
      },
      bubbles: !0,
      composed: !0
    })), this._selectedReason = "", this._extraText = "", this.closeModal();
  }
  render() {
    const t = [
      { v: "spam", l: "Спам/реклама" },
      { v: "offensive", l: "Оскорбления" },
      { v: "false", l: "Ложная информация" },
      { v: "other", l: "Другое" }
    ], r = !!this._selectedReason;
    return $`
      <div class="${l`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}">
        <div class="${l`bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden`}">
          <header class="${l`flex justify-between items-center p-4 border-b`}">
            <h3 class="${l`font-medium`}">Пожаловаться</h3>
            <button @click=${this.closeModal}
                    class="${l`text-gray-500 hover:text-gray-700 focus:outline-none`}">
              <svg width="1em" height="1em"><use href="#ri-close-line"/></svg>
            </button>
          </header>

          <section class="${l`p-6 space-y-4`}">
            <p class="${l`text-sm`}">Укажите причину:</p>
            ${t.map((s) => $`
              <label class="${l`flex items-center space-x-2`}">
                <input
                  type="radio"
                  name="reason"
                  .value=${s.v}
                  .checked=${this._selectedReason === s.v}
                  @change=${this._onReasonChange}
                  class="${l`text-sky-600 focus:ring-sky-600`}"/>
                <span class="${l`text-sm`}">${s.l}</span>
              </label>
            `)}

            <textarea
              .value=${this._extraText}
              @input=${this._onExtraInput}
              rows="4"
              placeholder="Комментарий (необязательно)…"
              class="${l`mb-2 w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none`}">
            </textarea>

            <footer class="${l`flex justify-end space-x-3`}">
              <button @click=${this.closeModal}
                      class="${l`px-4 py-2 text-sm border bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-xl focus:outline-none`}">
                Отмена
              </button>
              <button @click=${this._send}
                      ?disabled=${!r}
                      class="${l`px-4 py-2 text-sm rounded-xl focus:outline-none`} ${r ? "bg-sky-600 hover:bg-opacity-90 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}">
                Отправить
              </button>
            </footer>
          </section>
        </div>
      </div>
    `;
  }
}
A(Ii, "properties", {
  target: { type: Object },
  _selectedReason: { state: !0 },
  _extraText: { state: !0 }
});
customElements.define("report-modal", Ii);
const Lt = "http://localhost:3000", T = N.create({
  baseURL: "http://localhost:3000",
  withCredentials: !0
});
T.interceptors.response.use(
  (e) => e,
  async (e) => {
    const { response: t, config: r } = e;
    if ((t == null ? void 0 : t.status) === 401 && !r._retry) {
      r._retry = !0;
      try {
        return await T.post("/api/auth/refresh"), T(r);
      } catch {
        return console.error("Ошибка обновления токена", e), Promise.reject(e);
      }
    }
    return Promise.reject(e);
  }
);
const ht = (e) => e && !e.startsWith("http") ? Lt + e : e, ft = (e) => {
  var i, n;
  if (!e) return "Аноним";
  const t = ((i = e.first_name) == null ? void 0 : i.trim()) ?? "", r = ((n = e.last_name) == null ? void 0 : n.trim()) ?? "";
  return `${t} ${r}`.trim() || e.name || "Аноним";
}, vs = (e) => {
  const t = e.author ? {
    id: e.author.id,
    fullname: ft(e.author),
    avatar: ht(e.author.avatar_url)
  } : { fullname: "Аноним", avatar: ie }, r = Array.isArray(e.media) ? e.media.map((s) => s.url).filter(Boolean).map((s) => s.startsWith("http") ? s : Lt + s) : [];
  return {
    /* базовые поля из API */
    id: e.id,
    rating: e.rating,
    text: e.text,
    sentiment: e.sentiment,
    emotion: e.emotion,
    likes: e.likes ?? 0,
    dislikes: e.dislikes ?? 0,
    myReaction: e.myReaction ?? null,
    commentsCount: e.comments_count ?? 0,
    /* то, чего нет в «сырых» данных, но нужно фронту */
    author: t,
    date: new Date(e.created_at).toLocaleDateString(
      "ru-RU",
      { day: "numeric", month: "long", year: "numeric" }
    ),
    media: r,
    replies: [],
    _loadedComments: !1,
    showReplies: !1
  };
}, xs = (e) => {
  const t = e.author ? {
    id: e.author.id,
    fullname: ft(e.author),
    avatar: ht(e.author.avatar_url)
  } : { fullname: "Аноним", avatar: ie };
  return {
    id: e.id,
    text: e.text,
    likes: e.likes ?? 0,
    dislikes: e.dislikes ?? 0,
    myReaction: e.myReaction ?? null,
    answersCount: e.answers_count ?? 0,
    author: t,
    date: new Date(e.created_at).toLocaleDateString(
      "ru-RU",
      { day: "numeric", month: "long", year: "numeric" }
    ),
    answers: [],
    _loadedAnswers: !1,
    showAnswers: !1
  };
}, ir = (e, t) => {
  const r = e.author ? {
    id: e.author.id,
    fullname: ft(e.author),
    avatar: ht(e.author.avatar_url)
  } : { fullname: "Аноним", avatar: ie };
  return {
    ...e,
    author: r,
    date: new Date(e.created_at).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }),
    likes: e.likes ?? 0,
    dislikes: e.dislikes ?? 0,
    myReaction: t.isAuthenticated ? e.myReaction : null
  };
}, nr = (e, t) => {
  const r = e.author ? {
    id: e.author.id,
    fullname: ft(e.author),
    avatar: ht(e.author.avatar_url)
  } : { fullname: "Аноним", avatar: ie };
  return {
    ...e,
    author: r,
    date: new Date(e.created_at).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }),
    likes: e.likes ?? 0,
    dislikes: e.dislikes ?? 0,
    myReaction: t.isAuthenticated ? e.myReaction : null
  };
};
class Vi extends Fe {
  constructor() {
    super();
    A(this, "_openReport", (r) => {
      const { detail: s } = r, i = {
        type: s.type || r.type.replace("-report", ""),
        // 'review'|'comment'|'question'|'answer'
        reviewId: s.reviewId,
        commentId: s.commentId,
        questionId: s.questionId,
        answerId: s.answerId
      }, n = this.shadowRoot.getElementById("report-modal");
      n.target = i, n.openModal();
    });
    A(this, "_onLoginMessage", async (r) => {
      if (r.data !== "LOGIN_SUCCESS") return;
      const s = this.reviews.reduce((n, o) => (n[o.id] = {
        show: o.showReplies,
        loaded: o._loadedComments,
        replies: o.replies
      }, n), {}), i = this.questions.reduce((n, o) => (n[o.id] = {
        show: o.showAnswers,
        loaded: o._loadedAnswers,
        answers: o.answers
      }, n), {});
      await Promise.all([
        this._loadConfig(),
        this._loadReviews(),
        this._loadQuestions()
      ]), this.reviews = this.reviews.map((n) => {
        const o = s[n.id] || {};
        return {
          ...n,
          showReplies: o.show || !1,
          _loadedComments: !1,
          replies: []
        };
      }), this.reviews.filter((n) => n.showReplies).forEach((n) => this._onCommentToggle({ detail: { reviewId: n.id } })), this.questions = this.questions.map((n) => {
        const o = i[n.id] || {};
        return {
          ...n,
          showAnswers: o.show || !1,
          _loadedAnswers: !1,
          answers: []
        };
      }), this.questions.filter((n) => n.showAnswers).forEach((n) => this._onAnswerToggle({ detail: { questionId: n.id } }));
    });
    A(this, "_viewMedia", ({ detail: r }) => {
      var a;
      let { media: s, index: i, id: n } = r;
      if (s || (s = ((a = (this.currentTab === "reviews" ? this.reviews : this.questions).find((d) => d.id === n)) == null ? void 0 : a.media) || []), !s.length) return;
      const o = this.shadowRoot.getElementById("media-view-modal");
      o && Array.isArray(s) && s.length && (o.setMedia(s, i), o.openModal());
    });
    this.currentTab = "reviews", this.currentUser = {
      isAuthenticated: !1
    }, this.configError = !1, this.reviews = [], this.reviewsStats = null, this.questions = [], this.qaStats = null, this._loginWindow = null, this.allowAnonymous = !1, this.addEventListener("login", this._triggerLogin), this.addEventListener("logout", this._onLogout), this.addEventListener("submit-review", this._onSubmitReview), this.addEventListener("submit-question", this._onSubmitQuestion), this.addEventListener("view-media", this._viewMedia), this.addEventListener("review-like", this._onReviewLike), this.addEventListener("review-dislike", this._onReviewDislike), this.addEventListener("comment-toggle", this._onCommentToggle), this.addEventListener("send-comment", this._onSendComment), this.addEventListener("comment-like", this._onCommentLike), this.addEventListener("comment-dislike", this._onCommentDislike), this.addEventListener("question-like", this._onQuestionLike), this.addEventListener("question-dislike", this._onQuestionDislike), this.addEventListener("answer-toggle", this._onAnswerToggle), this.addEventListener("send-answer", this._onSendAnswer), this.addEventListener("answer-like", this._onAnswerLike), this.addEventListener("answer-dislike", this._onAnswerDislike), this.addEventListener("submit-report", this._onSubmitReport);
  }
  async firstUpdated() {
    const r = document.createElement("template");
    if (r.innerHTML = Ts, this.renderRoot.prepend(r.content.cloneNode(!0)), this.renderRoot.adoptedStyleSheets !== void 0)
      this.shadowRoot.adoptedStyleSheets = [Pe.target];
    else {
      const s = document.createElement("style");
      s.textContent = Pe.target.toString(), this.renderRoot.prepend(s);
    }
    await this._loadConfig(), this._es = new EventSource(
      `${Lt}/api/widgets/${this.widgetId}/config/stream`
    ), this._es.addEventListener("config", (s) => {
      const i = JSON.parse(s.data);
      this.allowAnonymous = !!i.allowAnonymous, this.requestUpdate();
    }), await this._loadReviews(), await this._loadQuestions();
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("message", this._onLoginMessage);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._es && this._es.close(), window.removeEventListener("message", this._onLoginMessage);
  }
  render() {
    return this.configError ? $`
        <style>
          #reviews-widget { font-family: 'Montserrat', sans-serif; }
          @keyframes pulse-shadow {
            0% {
              box-shadow: 0 0 8px rgba(239, 68, 68, 0.2);
              border-color: #ef4444;
            }
            50% {
              box-shadow: 0 0 16px rgba(239, 68, 68, 0.4);
              border-color: #b91c1c;
            }
            100% {
              box-shadow: 0 0 8px rgba(239, 68, 68, 0.2);
              border-color: #ef4444;
            }
          }

          #reviews-widget div {
            border: 2px solid #ef4444;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.2);
            animation: pulse-shadow 2.5s ease-in-out infinite;
          }
        </style>
        <div id="reviews-widget" class=${l`max-w-7xl mx-auto p-6`}>
          <div
            class=${l`bg-white rounded-3xl p-8 h-64 flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-6`}
          >
            <svg
              class=${l`text-red-500 fill-current w-16 h-16`}
              viewBox="0 0 24 24"
            >
              <use href="#bx-error-alt" />
            </svg>
            <p class=${l`text-red-600 text-xl md:text-2xl font-semibold leading-relaxed`}>
              Виджет не сконфигурирован для этого сайта.
            </p>
          </div>
        </div>
      ` : $`
      <style>
        #reviews-widget, #modals { font-family: 'Montserrat', sans-serif; }
      </style>
      <div id="reviews-widget" class=${l`max-w-7xl mx-auto p-4`}>
        <div class=${l`bg-white rounded-2xl shadow-lg`}>

          <!-- Верхняя панель -->
          <div class=${l`border-b border-gray-200`}>
            <div class=${l`flex items-center justify-between px-6 py-4`}>
              <tab-nav
                .active=${this.currentTab}
                @tab-change=${(r) => this.currentTab = r.detail.tab}>
              </tab-nav>
              <user-menu .user=${this.currentUser} .allowAnonymous=${this.allowAnonymous}></user-menu>
            </div>
          </div>

          <!-- Контент -->
          <div class=${l`flex flex-col md:flex-row`}>

            <!-- Левая колонка: статистика + кнопка -->
            <aside class=${l`p-6 w-full md:w-1/4 border-r border-gray-200`}>
              ${this.currentTab === "reviews" ? $`<stats-panel type="reviews" .data=${this.reviewsStats}></stats-panel>` : $`<stats-panel type="qa"      .data=${this.qaStats}></stats-panel>`}
              <button @click=${this._showAddModal}
                      ?disabled=${!(this.currentUser.isAuthenticated || this.allowAnonymous)}
                      class=${l`w-full py-3 px-4 rounded-xl font-medium focus:outline-none transition-colors duration-200
                        ${this.currentUser.isAuthenticated || this.allowAnonymous ? "bg-sky-600 text-white hover:bg-opacity-90" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}>
                ${this.currentTab === "reviews" ? "Оставить отзыв" : "Задать вопрос"}
              </button>
            </aside>

            <!-- Правая колонка: секции -->
            <section class=${l`p-6 w-full md:w-3/4`}>
              ${this.currentTab === "reviews" ? $`
                  <reviews-section
                    .reviews=${this.reviews}
                    .currentUser=${this.currentUser}
                    .allowAnonymous=${this.allowAnonymous}
                    @view-media=${this._viewMedia}
                    @review-report=${this._openReport}
                    @comment-report=${this._openReport}>
                  </reviews-section>` : $`
                  <qa-section
                    .questions=${this.questions}
                    .currentUser=${this.currentUser}
                    .allowAnonymous=${this.allowAnonymous}
                    @view-media=${this._viewMedia}
                    @question-report=${this._openReport}
                    @answer-report=${this._openReport}>
                  </qa-section>`}
            </section>

          </div>
        </div>
      </div>

      <!-- Модалки -->
        <div id="modals">
        <add-review-modal   id="add-review-modal" .allowAnonymous=${this.allowAnonymous}></add-review-modal>
        <add-question-modal id="add-question-modal" .allowAnonymous=${this.allowAnonymous}></add-question-modal>
        <media-view-modal   id="media-view-modal"></media-view-modal>
        <report-modal       id="report-modal"></report-modal>
      </div>
    `;
  }
  // ───────────────── Reviews ─────────────────
  async _loadReviews() {
    try {
      const { data: r } = await T.get(
        `/api/widgets/${this.widgetId}/reviews`,
        { withCredentials: !0 }
      );
      this.reviews = r.reviews.map(vs), this.reviewsStats = r.stats;
    } catch (r) {
      console.error("Ошибка загрузки отзывов", r);
    }
  }
  async _onSubmitReview({ detail: r }) {
    const s = {
      id: Date.now(),
      author: this.currentUser.isAuthenticated ? { fullname: this.currentUser.fullname, avatar: this.currentUser.avatar } : { fullname: "Аноним", avatar: ie },
      date: (/* @__PURE__ */ new Date()).toLocaleDateString(
        "ru-RU",
        { day: "numeric", month: "long", year: "numeric" }
      ),
      rating: r.rating,
      text: r.text,
      sentiment: null,
      emotion: null,
      media: [],
      likes: 0,
      dislikes: 0,
      myReaction: null,
      commentsCount: 0,
      replies: [],
      _loadedComments: !1,
      showReplies: !1
    };
    this.reviews = [s, ...this.reviews];
    const i = new FormData();
    i.append("rating", r.rating), i.append("text", r.text), r.files.forEach((a) => i.append("files", a));
    let n;
    try {
      n = (await T.post(
        `/api/widgets/${this.widgetId}/reviews`,
        i,
        { withCredentials: !0 }
      )).data;
    } catch (a) {
      console.error("Не удалось отправить отзыв", a), this.reviews = this.reviews.filter((c) => c.id !== s.id), alert("Не удалось отправить отзыв");
      return;
    }
    const o = vs(n);
    this.reviews = this.reviews.map(
      (a) => a.id === s.id ? o : a
    ), await this._loadReviews();
  }
  async _onReviewLike({ detail: { reviewId: r } }) {
    var o;
    const s = [...this.reviews], n = s.find((a) => a.id === r).myReaction === "like";
    this.reviews = s.map((a) => a.id !== r ? a : {
      ...a,
      likes: n ? a.likes - 1 : a.likes + 1,
      dislikes: n ? a.dislikes : a.myReaction === "dislike" ? a.dislikes - 1 : a.dislikes,
      myReaction: n ? null : "like"
    });
    try {
      n ? await T.delete(
        `/api/widgets/${this.widgetId}/reviews/${r}/like`
      ) : await T.post(
        `/api/widgets/${this.widgetId}/reviews/${r}/like`
      );
    } catch (a) {
      ((o = a.response) == null ? void 0 : o.status) !== 404 && (console.error("Ошибка лайка отзыва, откатываем", a), this.reviews = s);
    }
  }
  async _onReviewDislike({ detail: { reviewId: r } }) {
    var o;
    const s = [...this.reviews], n = s.find((a) => a.id === r).myReaction === "dislike";
    this.reviews = s.map((a) => a.id !== r ? a : {
      ...a,
      dislikes: n ? a.dislikes - 1 : a.dislikes + 1,
      likes: n ? a.likes : a.myReaction === "like" ? a.likes - 1 : a.likes,
      myReaction: n ? null : "dislike"
    });
    try {
      n ? await T.delete(
        `/api/widgets/${this.widgetId}/reviews/${r}/dislike`
      ) : await T.post(
        `/api/widgets/${this.widgetId}/reviews/${r}/dislike`
      );
    } catch (a) {
      ((o = a.response) == null ? void 0 : o.status) !== 404 && (console.error("Ошибка дизлайка отзыва, откатываем", a), this.reviews = s);
    }
  }
  // ───────────────── Comments ─────────────────
  async _onCommentToggle({ detail: { reviewId: r } }) {
    await this._toggleSection({
      id: r,
      listKey: "reviews",
      loadedFlagKey: "_loadedComments",
      showFlagKey: "showReplies",
      loadFn: async (s) => {
        const i = await T.get(`/api/widgets/${this.widgetId}/reviews/${s}/comments`, { withCredentials: !0 });
        return Array.isArray(i.data.comments) ? i.data.comments.map((n) => ir(n, this.currentUser)) : [];
      }
    });
  }
  async _onSendComment({ detail: { reviewId: r, text: s } }) {
    const i = {
      id: `tmp-${Date.now()}`,
      // временный id
      created_at: Date.now(),
      text: s,
      likes: 0,
      dislikes: 0,
      myReaction: null,
      author: this.currentUser.isAuthenticated ? { fullname: this.currentUser.fullname, avatar: this.currentUser.avatar || J } : null
    };
    this.reviews = this.reviews.map((a) => a.id === r ? {
      ...a,
      replies: [...a.replies, ir(i, this.currentUser)],
      commentsCount: (a.commentsCount || 0) + 1
    } : a);
    let n;
    try {
      n = (await T.post(
        `/api/widgets/${this.widgetId}/reviews/${r}/comments`,
        { text: s },
        { withCredentials: !0 }
      )).data;
    } catch (a) {
      console.error("Не удалось добавить комментарий", a), this.reviews = this.reviews.map((c) => c.id === r ? {
        ...c,
        replies: c.replies.filter((d) => !d.id.toString().startsWith("tmp-")),
        commentsCount: c.commentsCount - 1
      } : c), alert("Не удалось добавить комментарий");
      return;
    }
    const o = ir(n, this.currentUser);
    this.reviews = this.reviews.map((a) => a.id === r ? {
      ...a,
      replies: a.replies.map((c) => c.id === i.id ? o : c)
    } : a);
  }
  async _onCommentLike({ detail: { reviewId: r, commentId: s } }) {
    var a;
    const i = [...this.reviews], o = i.find((c) => c.id === r).replies.find((c) => c.id === s).myReaction === "like";
    this.reviews = i.map((c) => c.id !== r ? c : {
      ...c,
      replies: c.replies.map((d) => d.id !== s ? d : {
        ...d,
        likes: o ? d.likes - 1 : d.likes + 1,
        dislikes: o ? d.dislikes : d.myReaction === "dislike" ? d.dislikes - 1 : d.dislikes,
        myReaction: o ? null : "like"
      })
    });
    try {
      o ? await T.delete(
        `/api/widgets/${this.widgetId}/reviews/${r}/comments/${s}/like`
      ) : await T.post(
        `/api/widgets/${this.widgetId}/reviews/${r}/comments/${s}/like`
      );
    } catch (c) {
      ((a = c.response) == null ? void 0 : a.status) !== 404 && (console.error("Ошибка лайка, откатываем", c), this.reviews = i);
    }
  }
  async _onCommentDislike({ detail: { reviewId: r, commentId: s } }) {
    var a;
    const i = [...this.reviews], o = i.find((c) => c.id === r).replies.find((c) => c.id === s).myReaction === "dislike";
    this.reviews = i.map((c) => c.id !== r ? c : {
      ...c,
      replies: c.replies.map((d) => d.id !== s ? d : {
        ...d,
        dislikes: o ? d.dislikes - 1 : d.dislikes + 1,
        likes: o ? d.likes : d.myReaction === "like" ? d.likes - 1 : d.likes,
        myReaction: o ? null : "dislike"
      })
    });
    try {
      o ? await T.delete(
        `/api/widgets/${this.widgetId}/reviews/${r}/comments/${s}/dislike`
      ) : await T.post(
        `/api/widgets/${this.widgetId}/reviews/${r}/comments/${s}/dislike`
      );
    } catch (c) {
      ((a = c.response) == null ? void 0 : a.status) !== 404 && (console.error("Ошибка лайка, откатываем", c), this.reviews = i);
    }
  }
  // ───────────────── Questions ─────────────────
  async _loadQuestions() {
    try {
      const { data: r } = await T.get(
        `/api/widgets/${this.widgetId}/questions`,
        { withCredentials: !0 }
      );
      this.questions = r.questions.map(xs), this.qaStats = r.stats;
    } catch (r) {
      console.error("Ошибка загрузки вопросов", r);
    }
  }
  async _onSubmitQuestion({ detail: r }) {
    const s = {
      id: Date.now(),
      author: this.currentUser.isAuthenticated ? { fullname: this.currentUser.fullname, avatar: this.currentUser.avatar } : { fullname: "Аноним", avatar: ie },
      date: (/* @__PURE__ */ new Date()).toLocaleDateString(
        "ru-RU",
        { day: "numeric", month: "long", year: "numeric" }
      ),
      text: r.text,
      likes: 0,
      dislikes: 0,
      myReaction: null,
      answersCount: 0,
      answers: [],
      _loadedAnswers: !1,
      showAnswers: !1
    };
    this.questions = [s, ...this.questions];
    let i;
    try {
      i = (await T.post(
        `/api/widgets/${this.widgetId}/questions`,
        { text: r.text },
        { withCredentials: !0 }
      )).data;
    } catch (o) {
      console.error("Не удалось задать вопрос", o), this.questions = this.questions.filter((a) => a.id !== s.id), alert("Не удалось задать вопрос");
      return;
    }
    const n = xs(i);
    this.questions = this.questions.map(
      (o) => o.id === s.id ? n : o
    ), await this._loadQuestions();
  }
  async _onQuestionLike({ detail: { questionId: r } }) {
    var o;
    const s = [...this.questions], n = s.find((a) => a.id === r).myReaction === "like";
    this.questions = s.map((a) => a.id !== r ? a : {
      ...a,
      likes: n ? a.likes - 1 : a.likes + 1,
      dislikes: n ? a.dislikes : a.myReaction === "dislike" ? a.dislikes - 1 : a.dislikes,
      myReaction: n ? null : "like"
    });
    try {
      n ? await T.delete(
        `/api/widgets/${this.widgetId}/questions/${r}/like`
      ) : await T.post(
        `/api/widgets/${this.widgetId}/questions/${r}/like`
      );
    } catch (a) {
      ((o = a.response) == null ? void 0 : o.status) !== 404 && (console.error("Ошибка лайка вопроса, откатываем", a), this.questions = s);
    }
  }
  async _onQuestionDislike({ detail: { questionId: r } }) {
    var o;
    const s = [...this.questions], n = s.find((a) => a.id === r).myReaction === "dislike";
    this.questions = s.map((a) => a.id !== r ? a : {
      ...a,
      dislikes: n ? a.dislikes - 1 : a.dislikes + 1,
      likes: n ? a.likes : a.myReaction === "like" ? a.likes - 1 : a.likes,
      myReaction: n ? null : "dislike"
    });
    try {
      n ? await T.delete(
        `/api/widgets/${this.widgetId}/questions/${r}/dislike`
      ) : await T.post(
        `/api/widgets/${this.widgetId}/questions/${r}/dislike`
      );
    } catch (a) {
      ((o = a.response) == null ? void 0 : o.status) !== 404 && (console.error("Ошибка дизлайка вопроса, откатываем", a), this.questions = s);
    }
  }
  async _onAnswerToggle({ detail: { questionId: r } }) {
    await this._toggleSection({
      id: r,
      listKey: "questions",
      loadedFlagKey: "_loadedAnswers",
      showFlagKey: "showAnswers",
      loadFn: async (s) => {
        const i = await T.get(`/api/widgets/${this.widgetId}/questions/${s}/answers`, { withCredentials: !0 });
        return Array.isArray(i.data.answers) ? i.data.answers.map((n) => nr(n, this.currentUser)) : [];
      }
    });
  }
  async _onSendAnswer({ detail: { questionId: r, text: s } }) {
    const i = {
      id: `tmp-${Date.now()}`,
      created_at: Date.now(),
      text: s,
      likes: 0,
      dislikes: 0,
      myReaction: null,
      author: this.currentUser.isAuthenticated ? { fullname: this.currentUser.fullname, avatar: this.currentUser.avatar || J } : null
    };
    this.questions = this.questions.map((a) => a.id === r ? {
      ...a,
      answers: [...a.answers, nr(i, this.currentUser)],
      answersCount: (a.answersCount || 0) + 1,
      _loadedAnswers: !0,
      showAnswers: !0
    } : a);
    let n;
    try {
      n = (await T.post(
        `/api/widgets/${this.widgetId}/questions/${r}/answers`,
        { text: s },
        { withCredentials: !0 }
      )).data.answer;
    } catch (a) {
      console.error("Не удалось добавить ответ", a), this.questions = this.questions.map((c) => c.id === r ? {
        ...c,
        answers: c.answers.filter((d) => !d.id.toString().startsWith("tmp-")),
        answersCount: c.answersCount - 1
      } : c), alert("Не удалось добавить ответ");
      return;
    }
    const o = nr(n, this.currentUser);
    if (this.questions = this.questions.map((a) => a.id === r ? {
      ...a,
      answers: a.answers.map((c) => c.id === i.id ? o : c)
    } : a), this.qaStats && this.qaStats.answeredCount < this.qaStats.totalQuestions) {
      const a = this.qaStats.answeredCount + 1, c = this.qaStats.totalQuestions;
      this.qaStats = {
        ...this.qaStats,
        answeredCount: a,
        unansweredCount: c - a,
        answeredPercent: Math.round(a / c * 100),
        unansweredPercent: 100 - Math.round(a / c * 100)
      };
    }
  }
  async _onAnswerLike({ detail: { questionId: r, answerId: s } }) {
    var a;
    const i = [...this.questions], o = i.find((c) => c.id === r).answers.find((c) => c.id === s).myReaction === "like";
    this.questions = i.map((c) => c.id !== r ? c : {
      ...c,
      answers: c.answers.map((d) => d.id !== s ? d : {
        ...d,
        likes: o ? d.likes - 1 : d.likes + 1,
        dislikes: o ? d.dislikes : d.myReaction === "dislike" ? d.dislikes - 1 : d.dislikes,
        myReaction: o ? null : "like"
      })
    });
    try {
      o ? await T.delete(
        `/api/widgets/${this.widgetId}/questions/${r}/answers/${s}/like`
      ) : await T.post(
        `/api/widgets/${this.widgetId}/questions/${r}/answers/${s}/like`
      );
    } catch (c) {
      ((a = c.response) == null ? void 0 : a.status) !== 404 && (console.error("Ошибка лайка ответа, откатываем", c), this.questions = i);
    }
  }
  async _onAnswerDislike({ detail: { questionId: r, answerId: s } }) {
    var a;
    const i = [...this.questions], o = i.find((c) => c.id === r).answers.find((c) => c.id === s).myReaction === "dislike";
    this.questions = i.map((c) => c.id !== r ? c : {
      ...c,
      answers: c.answers.map((d) => d.id !== s ? d : {
        ...d,
        dislikes: o ? d.dislikes - 1 : d.dislikes + 1,
        likes: o ? d.likes : d.myReaction === "like" ? d.likes - 1 : d.likes,
        myReaction: o ? null : "dislike"
      })
    });
    try {
      o ? await T.delete(
        `/api/widgets/${this.widgetId}/questions/${r}/answers/${s}/dislike`
      ) : await T.post(
        `/api/widgets/${this.widgetId}/questions/${r}/answers/${s}/dislike`
      );
    } catch (c) {
      ((a = c.response) == null ? void 0 : a.status) !== 404 && (console.error("Ошибка дизлайка ответа, откатываем", c), this.questions = i);
    }
  }
  // ───────────────── Reports ─────────────────
  async _onSubmitReport(r) {
    const { type: s, reviewId: i, commentId: n, questionId: o, answerId: a, reason: c, text: d } = r.detail;
    try {
      switch (s) {
        case "review":
          await T.post(`/api/widgets/${this.widgetId}/reviews/${i}/report`, { reason: c, text: d }), alert("Жалоба на отзыв отправлена");
          break;
        case "comment":
          await T.post(
            `/api/widgets/${this.widgetId}/reviews/${i}/comments/${n}/report`,
            { reason: c, text: d }
          ), alert("Жалоба на комментарий отправлена");
          break;
        case "question":
          await T.post(`/api/widgets/${this.widgetId}/questions/${o}/report`, { reason: c, text: d }), alert("Жалоба на вопрос отправлена");
          break;
        case "answer":
          await T.post(
            `/api/widgets/${this.widgetId}/questions/${o}/answers/${a}/report`,
            { reason: c, text: d }
          ), alert("Жалоба на ответ отправлена");
          break;
      }
    } catch (u) {
      console.error("Ошибка отправки жалобы", u), alert("Не удалось отправить жалобу");
    }
  }
  // ───────────────── Helpers ─────────────────
  _showAddModal() {
    const r = this.currentTab === "reviews" ? "add-review-modal" : "add-question-modal";
    this.shadowRoot.getElementById(r).openModal();
  }
  _ensureAuth() {
    return this.currentUser.isAuthenticated ? !0 : (this._triggerLogin(), !1);
  }
  _triggerLogin() {
    const r = encodeURIComponent(location.href), s = encodeURIComponent(window.location.origin), i = `${Lt}/login?redirect=${r}&origin=${s}`;
    this._loginWindow = window.open(i, "reviews_login", "width=500,height=600");
  }
  async _onLogout() {
    const r = this.reviews.reduce((i, n) => (i[n.id] = {
      show: n.showReplies,
      loaded: n._loadedComments,
      replies: n.replies
    }, i), {}), s = this.questions.reduce((i, n) => (i[n.id] = {
      show: n.showAnswers,
      loaded: n._loadedAnswers,
      answers: n.answers
    }, i), {});
    try {
      await T.post("/api/auth/logout");
    } catch (i) {
      console.warn("Logout failed on server", i);
    }
    localStorage.removeItem("accessToken"), this.currentUser = { isAuthenticated: !1 }, await Promise.all([
      this._loadConfig(),
      this._loadReviews(),
      this._loadQuestions()
    ]), this.reviews = this.reviews.map((i) => {
      const n = r[i.id] || {};
      return {
        ...i,
        showReplies: n.show || !1,
        _loadedComments: !1,
        replies: []
      };
    }), this.reviews.filter((i) => i.showReplies).forEach((i) => this._onCommentToggle({ detail: { reviewId: i.id } })), this.questions = this.questions.map((i) => {
      const n = s[i.id] || {};
      return {
        ...i,
        showAnswers: n.show || !1,
        _loadedAnswers: !1,
        answers: []
      };
    }), this.questions.filter((i) => i.showAnswers).forEach((i) => this._onAnswerToggle({ detail: { questionId: i.id } }));
  }
  async _loadConfig() {
    var r;
    try {
      const { data: s } = await T.get(
        `/api/widgets/${this.widgetId}/config`
      );
      this.config = s.config, this.allowAnonymous = !!s.config.allowAnonymous, this.currentUser = {
        isAuthenticated: s.isAuthenticated,
        avatar: ht((r = s.user) == null ? void 0 : r.avatar_url),
        ...s.user,
        fullname: ft(s.user)
      }, this.configError = !1;
    } catch (s) {
      console.error("config fetch error", s), this.configError = !0;
    }
  }
  async _toggleSection({ id: r, listKey: s, loadedFlagKey: i, showFlagKey: n, loadFn: o }) {
    const a = [...this[s]], c = a.findIndex((g) => g.id === r);
    if (c < 0) return;
    const d = a[c], u = !d[i] && d[s === "reviews" ? "replies" : "answers"].length === 0;
    let h = { ...d };
    if (u)
      try {
        const g = await o(r);
        h = {
          ...h,
          [i]: !0,
          [s === "reviews" ? "replies" : "answers"]: g,
          [n]: !0
          // сразу открываем после загрузки
        };
      } catch (g) {
        console.error("Ошибка загрузки", g);
        return;
      }
    else
      h = {
        ...h,
        [n]: !h[n]
      };
    a[c] = h, this[s] = a;
  }
}
A(Vi, "properties", {
  widgetId: { type: String, attribute: "widget-id" },
  currentTab: { type: String },
  currentUser: { type: Object, hasChanged: () => !0 },
  configError: { type: Boolean, state: !0 },
  reviews: { type: Array },
  reviewsStats: { type: Object },
  questions: { type: Array },
  qaStats: { type: Object },
  allowAnonymous: { type: Boolean }
});
customElements.define("reviews-widget", Vi);
export {
  Vi as ReviewsWidget
};
