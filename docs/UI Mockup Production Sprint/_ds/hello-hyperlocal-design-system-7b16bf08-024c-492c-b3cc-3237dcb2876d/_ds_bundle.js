/* @ds-bundle: {"format":4,"namespace":"HelloHyperlocalDesignSystem_7b16bf","components":[{"name":"FacilityCard","sourcePath":"components/cards/FacilityCard.jsx"},{"name":"HeroCard","sourcePath":"components/cards/HeroCard.jsx"},{"name":"LedgerCard","sourcePath":"components/cards/LedgerCard.jsx"},{"name":"ListRow","sourcePath":"components/cards/ListRow.jsx"},{"name":"StatChip","sourcePath":"components/cards/StatChip.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"StatusBadge","sourcePath":"components/core/StatusBadge.jsx"},{"name":"BottomNav","sourcePath":"components/navigation/BottomNav.jsx"},{"name":"CreateButton","sourcePath":"components/navigation/CreateButton.jsx"},{"name":"PillTabs","sourcePath":"components/navigation/PillTabs.jsx"}],"sourceHashes":{"components/cards/FacilityCard.jsx":"698985c29e94","components/cards/HeroCard.jsx":"5730e4df2d00","components/cards/LedgerCard.jsx":"bb673d2dce16","components/cards/ListRow.jsx":"065119eecbab","components/cards/StatChip.jsx":"8bf6a3095fd2","components/core/Avatar.jsx":"1ea4b49f9d30","components/core/Button.jsx":"31c23bb0d207","components/core/IconButton.jsx":"25fcc26ec9ff","components/core/StatusBadge.jsx":"24c385862e49","components/navigation/BottomNav.jsx":"f6e53dfda429","components/navigation/CreateButton.jsx":"707cc298bef2","components/navigation/PillTabs.jsx":"57ead1c66a0b","ui_kits/app/App.jsx":"7716a2ed2666","ui_kits/app/Community.jsx":"5db1adad9a42","ui_kits/app/Facilities.jsx":"62bdb24bd2f9","ui_kits/app/Home.jsx":"bcf336204036","ui_kits/app/Icon.jsx":"ee1e0899aa55","ui_kits/app/Payments.jsx":"e87abc884041"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.HelloHyperlocalDesignSystem_7b16bf = window.HelloHyperlocalDesignSystem_7b16bf || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/cards/FacilityCard.jsx
try { (() => {
/**
 * FacilityCard — listing/facility grid card with live imagery
 * (background-size: cover) and a name + price row (brand-board §05).
 */
function FacilityCard({
  image,
  name,
  price
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden',
      border: '1px solid var(--color-onyx-line-soft)',
      background: '#FFFFFF'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '90px',
      backgroundColor: 'var(--color-spruce)',
      backgroundImage: image ? `url(${image})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 12px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '12px',
      fontWeight: 700,
      margin: 0
    }
  }, name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '11px',
      color: 'var(--color-hunter)',
      fontWeight: 600,
      margin: 0
    }
  }, price)));
}
Object.assign(__ds_scope, { FacilityCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/FacilityCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/HeroCard.jsx
try { (() => {
/**
 * HeroCard — dark announcement card. Dark Spruce fill, grass eyebrow,
 * white title and body, white pill CTA (brand-board §05).
 */
function HeroCard({
  eyebrow,
  title,
  body,
  ctaLabel,
  onCtaClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-spruce)',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      color: '#FFFFFF'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '11px',
      color: 'var(--color-grass)',
      fontWeight: 700,
      marginBottom: '6px'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '16px',
      fontWeight: 800,
      margin: '0 0 10px',
      color: '#FFFFFF'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '13px',
      color: 'rgba(255,255,255,0.78)',
      lineHeight: 1.55,
      margin: '0 0 16px'
    }
  }, body), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onCtaClick,
    style: {
      background: '#FFFFFF',
      color: 'var(--color-spruce)',
      fontSize: '12px',
      fontWeight: 700,
      padding: '10px 18px',
      borderRadius: 'var(--radius-full)',
      border: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer'
    }
  }, ctaLabel, " \u2192"));
}
Object.assign(__ds_scope, { HeroCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/HeroCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/LedgerCard.jsx
try { (() => {
/**
 * LedgerCard — dark fee/ledger breakdown panel. Same Dark Spruce fill
 * as HeroCard, reused verbatim for business-side billing. Grass pill
 * CTA pinned to the bottom (brand-board §05).
 */
function LedgerCard({
  label,
  total,
  lineItems = [],
  ctaLabel,
  onCtaClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-spruce)',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      color: '#FFFFFF'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '11px',
      color: 'rgba(255,255,255,0.65)',
      marginBottom: '6px'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '28px',
      fontWeight: 800,
      marginBottom: '16px',
      color: '#FFFFFF'
    }
  }, total), lineItems.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: 'rgba(255,255,255,0.82)',
      padding: '8px 0',
      borderBottom: i < lineItems.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", null, item.label), /*#__PURE__*/React.createElement("span", null, item.value))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onCtaClick,
    style: {
      marginTop: '16px',
      width: '100%',
      background: 'var(--color-grass)',
      color: 'var(--color-spruce)',
      fontSize: '13px',
      fontWeight: 800,
      textAlign: 'center',
      padding: '13px',
      borderRadius: 'var(--radius-full)',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, ctaLabel));
}
Object.assign(__ds_scope, { LedgerCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/LedgerCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/ListRow.jsx
try { (() => {
/**
 * ListRow — initials avatar, two-line meta stack, right-aligned status
 * pill (brand-board §05). Used in visitor lists, community feeds,
 * business directories. (Avatar/status markup inlined — cross-directory
 * component imports aren't supported by the bundler.)
 */
function ListRow({
  initials,
  name,
  meta,
  status = 'live',
  statusLabel,
  isLast = false
}) {
  const statusTones = {
    live: {
      background: 'var(--status-live-bg)',
      color: 'var(--status-live-text)'
    },
    pending: {
      background: 'var(--status-pending-bg)',
      color: 'var(--status-pending-text)'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '14px',
      padding: '14px 0',
      borderBottom: isLast ? 'none' : '1px solid var(--color-onyx-line-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      background: 'var(--color-hunter)',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontSize: '12px',
      fontWeight: 700,
      flexShrink: 0
    }
  }, initials), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '13px',
      fontWeight: 700,
      margin: 0
    }
  }, name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '11px',
      color: 'var(--color-muted)',
      margin: 0
    }
  }, meta))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '10px',
      fontWeight: 700,
      padding: '5px 10px',
      borderRadius: 'var(--radius-full)',
      whiteSpace: 'nowrap',
      ...statusTones[status]
    }
  }, statusLabel));
}
Object.assign(__ds_scope, { ListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ListRow.jsx", error: String((e && e.message) || e) }); }

// components/cards/StatChip.jsx
try { (() => {
/**
 * StatChip — grass-filled metric chip with a dark circular arrow
 * affordance. Always appears as a full-bleed pair at the top of the
 * home screen (brand-board §05).
 */
function StatChip({
  value,
  label,
  onArrowClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--color-grass)',
      borderRadius: 'var(--radius-sm)',
      padding: '16px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '18px',
      fontWeight: 800,
      color: 'var(--color-spruce)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '12px',
      fontWeight: 600,
      color: 'var(--color-spruce)',
      opacity: 0.85
    }
  }, label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onArrowClick,
    "aria-label": `View ${label}`,
    style: {
      position: 'absolute',
      right: '14px',
      top: '14px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: 'var(--color-spruce)',
      color: 'var(--color-grass)',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      cursor: 'pointer'
    }
  }, "\u2192"));
}
Object.assign(__ds_scope, { StatChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/StatChip.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
/**
 * Avatar — initials circle used in list rows (visitor lists, community
 * members, facility contacts). Hunter Green fill per brand-board §05.
 */
function Avatar({
  initials,
  size = 38
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'var(--color-hunter)',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontSize: size * 0.32,
      fontWeight: 700,
      flexShrink: 0
    }
  }, initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
/**
 * Button — pill-shaped CTA used across hero cards, ledgers, and forms.
 * Variants map 1:1 onto the brand's two sanctioned CTA fills: solid
 * Dark Spruce (on light canvases) and solid white (on Dark Spruce
 * cards) or grass (highest-emphasis action, e.g. ledger "Pay").
 */
function Button({
  children,
  variant = 'spruce',
  size = 'md',
  icon,
  disabled = false,
  onClick,
  type = 'button'
}) {
  const sizes = {
    sm: {
      padding: '8px 14px',
      fontSize: '12px'
    },
    md: {
      padding: '13px 20px',
      fontSize: '13px'
    },
    lg: {
      padding: '15px 24px',
      fontSize: '14px'
    }
  };
  const variants = {
    spruce: {
      background: 'var(--color-spruce)',
      color: '#FFFFFF'
    },
    grass: {
      background: 'var(--color-grass)',
      color: 'var(--color-spruce)'
    },
    white: {
      background: '#FFFFFF',
      color: 'var(--color-spruce)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-spruce)',
      boxShadow: 'inset 0 0 0 1.5px var(--color-onyx-line)'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    onClick: onClick,
    disabled: disabled,
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      border: 'none',
      borderRadius: 'var(--radius-full)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'opacity 0.15s ease, transform 0.1s ease',
      ...sizes[size],
      ...variants[variant]
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'flex'
    }
  }, icon) : null, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
/**
 * IconButton — circular icon affordance used for the stat-chip arrow
 * and other small tap targets. Solid Dark Spruce fill with grass
 * glyph, per the stat-chip pattern in brand-board §05.
 */
function IconButton({
  icon,
  size = 24,
  tone = 'spruce',
  onClick,
  ariaLabel
}) {
  const tones = {
    spruce: {
      background: 'var(--color-spruce)',
      color: 'var(--color-grass)'
    },
    onDark: {
      background: 'rgba(255,255,255,0.14)',
      color: '#FFFFFF'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": ariaLabel,
    onClick: onClick,
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      flexShrink: 0,
      ...tones[tone]
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      width: size * 0.5,
      height: size * 0.5
    }
  }, icon));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusBadge.jsx
try { (() => {
/**
 * StatusBadge — small pill used at the end of list rows. Grass tint
 * signals live/approved; amber tint signals pending. Never any other
 * color — these two states are the full inventory per brand-board §05.
 */
function StatusBadge({
  status = 'live',
  children
}) {
  const tones = {
    live: {
      background: 'var(--status-live-bg)',
      color: 'var(--status-live-text)'
    },
    pending: {
      background: 'var(--status-pending-bg)',
      color: 'var(--status-pending-text)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '10px',
      fontWeight: 700,
      padding: '5px 10px',
      borderRadius: 'var(--radius-full)',
      whiteSpace: 'nowrap',
      ...tones[status]
    }
  }, children);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomNav.jsx
try { (() => {
/**
 * BottomNav — floating bottom navigation bar. Dark Spruce fill,
 * inactive icons in translucent white, active icon gets a grass ring
 * (never a filled background) — brand-board §05.
 */
function BottomNav({
  items,
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      background: 'var(--color-spruce)',
      borderRadius: 'var(--radius-full)',
      padding: '10px',
      width: 'max-content',
      margin: '0 auto',
      boxShadow: 'var(--shadow-float)'
    }
  }, items.map(item => {
    const isActive = item.key === active;
    return /*#__PURE__*/React.createElement("button", {
      key: item.key,
      type: "button",
      "aria-label": item.label,
      onClick: () => onChange && onChange(item.key),
      style: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: isActive ? 'var(--color-grass-soft)' : 'transparent',
        color: isActive ? 'var(--color-grass)' : 'rgba(255,255,255,0.55)',
        boxShadow: isActive ? 'inset 0 0 0 1.5px var(--color-grass)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        width: '18px',
        height: '18px'
      }
    }, item.icon));
  }));
}
Object.assign(__ds_scope, { BottomNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/CreateButton.jsx
try { (() => {
/**
 * CreateButton — full-width "create post" pattern. Dark Spruce fill,
 * grass "+", sentence-case label. Copy is always an inviting verb
 * phrase, never a form-y imperative like "Submit Content".
 */
function CreateButton({
  label = 'Share something great',
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      width: '100%',
      background: 'var(--color-spruce)',
      color: '#FFFFFF',
      fontFamily: 'var(--font-sans)',
      fontSize: '13px',
      fontWeight: 700,
      padding: '14px',
      borderRadius: 'var(--radius-full)',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-grass)',
      fontWeight: 800
    }
  }, "+"), label);
}
Object.assign(__ds_scope, { CreateButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/CreateButton.jsx", error: String((e && e.message) || e) }); }

// components/navigation/PillTabs.jsx
try { (() => {
/**
 * PillTabs — segmented pill tab control. Spruce-tinted track, active
 * pill solid Dark Spruce with grass label text (brand-board §05).
 */
function PillTabs({
  tabs,
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: '8px',
      background: 'var(--color-spruce-soft)',
      padding: '6px',
      borderRadius: 'var(--radius-full)',
      width: 'max-content'
    }
  }, tabs.map(tab => {
    const isActive = tab === active;
    return /*#__PURE__*/React.createElement("button", {
      key: tab,
      type: "button",
      onClick: () => onChange && onChange(tab),
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: '12px',
        fontWeight: 700,
        padding: '9px 18px',
        borderRadius: 'var(--radius-full)',
        border: 'none',
        cursor: 'pointer',
        background: isActive ? 'var(--color-spruce)' : 'transparent',
        color: isActive ? 'var(--color-grass)' : 'var(--color-hunter)'
      }
    }, tab);
  }));
}
Object.assign(__ds_scope, { PillTabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/PillTabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/App.jsx
try { (() => {
function App() {
  const DS = window.HelloHyperlocalDesignSystem_7b16bf;
  const {
    BottomNav
  } = DS;
  const [screen, setScreen] = React.useState('home');
  const screens = {
    home: /*#__PURE__*/React.createElement(window.Home, {
      onNavigate: setScreen
    }),
    facilities: /*#__PURE__*/React.createElement(window.Facilities, null),
    community: /*#__PURE__*/React.createElement(window.Community, null),
    payments: /*#__PURE__*/React.createElement(window.Payments, null)
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "phone"
  }, /*#__PURE__*/React.createElement("div", {
    className: "statusbar"
  }), /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, screens[screen]), /*#__PURE__*/React.createElement("div", {
    className: "navwrap"
  }, /*#__PURE__*/React.createElement(BottomNav, {
    active: screen,
    onChange: setScreen,
    items: [{
      key: 'home',
      label: 'Home',
      icon: /*#__PURE__*/React.createElement(window.Icon, {
        name: "Home"
      })
    }, {
      key: 'facilities',
      label: 'Facilities',
      icon: /*#__PURE__*/React.createElement(window.Icon, {
        name: "Store"
      })
    }, {
      key: 'community',
      label: 'Community',
      icon: /*#__PURE__*/React.createElement(window.Icon, {
        name: "Users"
      })
    }, {
      key: 'payments',
      label: 'Payments',
      icon: /*#__PURE__*/React.createElement(window.Icon, {
        name: "Wallet"
      })
    }, {
      key: 'profile',
      label: 'Profile',
      icon: /*#__PURE__*/React.createElement(window.Icon, {
        name: "User"
      })
    }]
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Community.jsx
try { (() => {
function Community() {
  const DS = window.HelloHyperlocalDesignSystem_7b16bf;
  const {
    ListRow,
    CreateButton
  } = DS;
  const [posted, setPosted] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--color-onyx)',
      padding: '18px 0 14px'
    }
  }, "Community"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(CreateButton, {
    onClick: () => setPosted(true)
  })), posted && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-grass-soft)',
      color: 'var(--color-spruce)',
      fontSize: 12,
      fontWeight: 700,
      padding: '10px 14px',
      borderRadius: 12,
      marginBottom: 16
    }
  }, "Posted! Your neighbours will see it in the feed."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1px solid var(--color-onyx-line-soft)',
      borderRadius: 16,
      padding: '4px 16px'
    }
  }, /*#__PURE__*/React.createElement(ListRow, {
    initials: "TW",
    name: "The Whippet Coffee",
    meta: "New special posted \xB7 12m ago",
    status: "live",
    statusLabel: "Live"
  }), /*#__PURE__*/React.createElement(ListRow, {
    initials: "LN",
    name: "Linden Village Market",
    meta: "RSVP requested \xB7 1h ago",
    status: "pending",
    statusLabel: "Pending"
  }), /*#__PURE__*/React.createElement(ListRow, {
    initials: "KF",
    name: "Kids' street fun day",
    meta: "14 neighbours going \xB7 5h ago",
    status: "live",
    statusLabel: "Live"
  }), /*#__PURE__*/React.createElement(ListRow, {
    initials: "DW",
    name: "Dog walking meetup",
    meta: "Pending approval \xB7 1d ago",
    status: "pending",
    statusLabel: "Pending",
    isLast: true
  })));
}
window.Community = Community;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Community.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Facilities.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Facilities() {
  const DS = window.HelloHyperlocalDesignSystem_7b16bf;
  const {
    FacilityCard,
    ListRow,
    PillTabs
  } = DS;
  const [tab, setTab] = React.useState('Grid');
  const facilities = [{
    image: '../../assets/photography/whippet-linden.jpg',
    name: 'The Whippet',
    price: 'Free entry'
  }, {
    image: '../../assets/photography/linden-market.jpg',
    name: 'Linden Market',
    price: 'R30 per stall'
  }, {
    image: '../../assets/photography/goddess-cafe-linden.jpg',
    name: 'Goddess Cafe Linden',
    price: 'Free entry'
  }, {
    image: '../../assets/photography/breakfast.jpg',
    name: 'Weekend Breakfast Spec',
    price: 'R85'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--color-onyx)',
      padding: '18px 0 14px'
    }
  }, "Facilities"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(PillTabs, {
    tabs: ['Grid', 'List'],
    active: tab,
    onChange: setTab
  })), tab === 'Grid' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, facilities.map(f => /*#__PURE__*/React.createElement(FacilityCard, _extends({
    key: f.name
  }, f)))) : /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1px solid var(--color-onyx-line-soft)',
      borderRadius: 16,
      padding: '4px 16px'
    }
  }, /*#__PURE__*/React.createElement(ListRow, {
    initials: "TW",
    name: "The Whippet Coffee",
    meta: "New special posted \xB7 12m ago",
    status: "live",
    statusLabel: "Live"
  }), /*#__PURE__*/React.createElement(ListRow, {
    initials: "LN",
    name: "Linden Village Market",
    meta: "RSVP requested \xB7 1h ago",
    status: "pending",
    statusLabel: "Pending"
  }), /*#__PURE__*/React.createElement(ListRow, {
    initials: "GC",
    name: "Goddess Cafe Linden",
    meta: "Menu updated \xB7 3h ago",
    status: "live",
    statusLabel: "Live",
    isLast: true
  })));
}
window.Facilities = Facilities;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Facilities.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Home.jsx
try { (() => {
function Home({
  onNavigate
}) {
  const DS = window.HelloHyperlocalDesignSystem_7b16bf;
  const {
    StatChip,
    HeroCard,
    PillTabs,
    FacilityCard
  } = DS;
  const [tab, setTab] = React.useState('Local news');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 0 6px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--color-onyx)',
      whiteSpace: 'nowrap'
    }
  }, "Hello, Sam."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'var(--color-hunter)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 13
    }
  }, "S")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--color-hunter)',
      marginBottom: 14
    }
  }, "Linden \xB7 Block 4"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(StatChip, {
    value: "R240",
    label: "Love Local savings"
  }), /*#__PURE__*/React.createElement(StatChip, {
    value: "03",
    label: "Open RSVPs"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(HeroCard, {
    eyebrow: "Around the neighbourhood",
    title: "Load-shedding schedule update",
    body: "Stage 2 tonight from 8pm\u201310:30pm. Linden falls under block 4.",
    ctaLabel: "Read more"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(PillTabs, {
    tabs: ['Local news', 'Events', 'Marketplace'],
    active: tab,
    onChange: setTab
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--color-onyx)',
      lineHeight: 1.6,
      marginBottom: 20
    }
  }, tab === 'Local news' && 'Looking for someone who can teach piano to my 8-year-old. Preferably within the community.', tab === 'Events' && 'Linden Village Market — this Saturday, 8am–1pm on 4th Avenue.', tab === 'Marketplace' && 'Weekend Breakfast Special at Goddess Cafe — R85, all morning.'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: 'var(--color-spruce)'
    }
  }, "Nearby facilities"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('facilities'),
    style: {
      border: 'none',
      background: 'none',
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--color-hunter)',
      cursor: 'pointer'
    }
  }, "See all")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(FacilityCard, {
    image: "../../assets/photography/whippet-linden.jpg",
    name: "The Whippet",
    price: "Free entry"
  }), /*#__PURE__*/React.createElement(FacilityCard, {
    image: "../../assets/photography/linden-market.jpg",
    name: "Linden Market",
    price: "R30 per stall"
  })));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Icon.jsx
try { (() => {
function Icon({
  name,
  size = 18
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lucide) return;
    const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    ref.current.innerHTML = '';
    const el = document.createElement('i');
    el.setAttribute('data-lucide', kebab);
    ref.current.appendChild(el);
    window.lucide.createIcons({
      attrs: {
        width: size,
        height: size,
        stroke: 'currentColor'
      }
    });
  }, [name, size]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'flex'
    }
  });
}
window.Icon = Icon;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Icon.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Payments.jsx
try { (() => {
function Payments() {
  const DS = window.HelloHyperlocalDesignSystem_7b16bf;
  const {
    LedgerCard
  } = DS;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--color-onyx)',
      padding: '18px 0 14px'
    }
  }, "Payments"), /*#__PURE__*/React.createElement(LedgerCard, {
    label: "Total due this month",
    total: "R380",
    lineItems: [{
      label: 'Featured listing',
      value: 'R250'
    }, {
      label: 'Marketplace boost',
      value: 'R130'
    }],
    ctaLabel: "Pay R380"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--color-muted)',
      marginTop: 14,
      lineHeight: 1.6
    }
  }, "Business-side billing reuses the same Dark Spruce ledger panel as resident fee breakdowns."));
}
window.Payments = Payments;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Payments.jsx", error: String((e && e.message) || e) }); }

__ds_ns.FacilityCard = __ds_scope.FacilityCard;

__ds_ns.HeroCard = __ds_scope.HeroCard;

__ds_ns.LedgerCard = __ds_scope.LedgerCard;

__ds_ns.ListRow = __ds_scope.ListRow;

__ds_ns.StatChip = __ds_scope.StatChip;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.BottomNav = __ds_scope.BottomNav;

__ds_ns.CreateButton = __ds_scope.CreateButton;

__ds_ns.PillTabs = __ds_scope.PillTabs;

})();
