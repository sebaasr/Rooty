interface IconProps {
  name: string
  size?: number
  color?: string
  strokeWidth?: number
}

export function Icon({ name, size = 16, color = "currentColor", strokeWidth = 1.75 }: IconProps) {
  const s: React.CSSProperties = { width: size, height: size, display: "inline-block", flexShrink: 0 }
  const p = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }

  const icons: Record<string, React.ReactNode> = {
    search:          <svg style={s} viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" {...p}/><line x1="16.5" y1="16.5" x2="22" y2="22" {...p}/></svg>,
    calendar:        <svg style={s} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" {...p}/><line x1="16" y1="2" x2="16" y2="6" {...p}/><line x1="8" y1="2" x2="8" y2="6" {...p}/><line x1="3" y1="10" x2="21" y2="10" {...p}/></svg>,
    user:            <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" {...p}/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" {...p}/></svg>,
    users:           <svg style={s} viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5" {...p}/><path d="M2 20c0-3.5 3.1-6 7-6s7 2.5 7 6" {...p}/><circle cx="17" cy="8" r="3" {...p}/><path d="M22 20c0-3-2.5-5-5-5" {...p}/></svg>,
    home:            <svg style={s} viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" {...p}/><path d="M9 21V12h6v9" {...p}/></svg>,
    chart:           <svg style={s} viewBox="0 0 24 24"><rect x="3" y="12" width="4" height="9" rx="1" {...p}/><rect x="10" y="7" width="4" height="14" rx="1" {...p}/><rect x="17" y="3" width="4" height="18" rx="1" {...p}/></svg>,
    check:           <svg style={s} viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" {...p}/></svg>,
    "check-circle":  <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...p}/><path d="M8 12l3 3 5-5" {...p}/></svg>,
    mail:            <svg style={s} viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" {...p}/><polyline points="2,4 12,13 22,4" {...p}/></svg>,
    shield:          <svg style={s} viewBox="0 0 24 24"><path d="M12 2l7 3.5v5.5c0 5-3.5 8.5-7 10.5C8.5 19.5 5 16 5 11V5.5L12 2z" {...p}/></svg>,
    "graduation-cap":<svg style={s} viewBox="0 0 24 24"><path d="M22 10L12 5 2 10l10 5 10-5z" {...p}/><path d="M6 12v5c0 2.21 2.69 4 6 4s6-1.79 6-4v-5" {...p}/><line x1="22" y1="10" x2="22" y2="15" {...p}/></svg>,
    pencil:          <svg style={s} viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" {...p}/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" {...p}/></svg>,
    "chevron-left":  <svg style={s} viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6" {...p}/></svg>,
    warning:         <svg style={s} viewBox="0 0 24 24"><path d="M10.3 3.6L2 20h20L13.7 3.6a2 2 0 00-3.4 0z" {...p}/><line x1="12" y1="10" x2="12" y2="14" {...p}/><circle cx="12" cy="17" r="0.5" fill={color} stroke={color}/></svg>,
    info:            <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...p}/><line x1="12" y1="11" x2="12" y2="16" {...p}/><circle cx="12" cy="8" r="0.5" fill={color} stroke={color}/></svg>,
    star:            <svg style={s} viewBox="0 0 24 24"><polygon points="12,2 15.1,8.3 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 8.9,8.3" {...p}/></svg>,
    "star-filled":   <svg style={s} viewBox="0 0 24 24"><polygon points="12,2 15.1,8.3 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 8.9,8.3" fill={color} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/></svg>,
    folder:          <svg style={s} viewBox="0 0 24 24"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" {...p}/></svg>,
    clock:           <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...p}/><polyline points="12,7 12,12 15,15" {...p}/></svg>,
    "arrow-right":   <svg style={s} viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12" {...p}/><polyline points="15,6 21,12 15,18" {...p}/></svg>,
    "log-out":       <svg style={s} viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" {...p}/><polyline points="16,17 21,12 16,7" {...p}/><line x1="21" y1="12" x2="9" y2="12" {...p}/></svg>,
    settings:        <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" {...p}/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" {...p}/></svg>,
    export:          <svg style={s} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" {...p}/><polyline points="17,8 12,3 7,8" {...p}/><line x1="12" y1="3" x2="12" y2="15" {...p}/></svg>,
    pin:             <svg style={s} viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" {...p}/><circle cx="12" cy="9" r="2.5" {...p}/></svg>,
    monitor:         <svg style={s} viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" {...p}/><line x1="8" y1="21" x2="16" y2="21" {...p}/><line x1="12" y1="17" x2="12" y2="21" {...p}/></svg>,
    dollar:          <svg style={s} viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" {...p}/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" {...p}/></svg>,
    play:            <svg style={s} viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" {...p}/></svg>,
    stop:            <svg style={s} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" {...p}/></svg>,
    x:               <svg style={s} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" {...p}/><line x1="6" y1="6" x2="18" y2="18" {...p}/></svg>,
    "book-open":     <svg style={s} viewBox="0 0 24 24"><path d="M2 3h9a1 1 0 011 1v16a1 1 0 00-1-1H2z" {...p}/><path d="M22 3h-9a1 1 0 00-1 1v16a1 1 0 011-1h9z" {...p}/></svg>,
    plus:            <svg style={s} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" {...p}/><line x1="5" y1="12" x2="19" y2="12" {...p}/></svg>,
    "trending-up":   <svg style={s} viewBox="0 0 24 24"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18" {...p}/><polyline points="17,6 23,6 23,12" {...p}/></svg>,
    "trending-down": <svg style={s} viewBox="0 0 24 24"><polyline points="23,18 13.5,8.5 8.5,13.5 1,6" {...p}/><polyline points="17,18 23,18 23,12" {...p}/></svg>,
    "chevron-right": <svg style={s} viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6" {...p}/></svg>,
    video:           <svg style={s} viewBox="0 0 24 24"><polygon points="23,7 16,12 23,17" {...p}/><rect x="1" y="5" width="15" height="14" rx="2" {...p}/></svg>,
    briefcase:       <svg style={s} viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" {...p}/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" {...p}/><line x1="12" y1="12" x2="12" y2="12" stroke={color} strokeWidth={3} strokeLinecap="round"/><line x1="2" y1="12" x2="22" y2="12" {...p}/></svg>,
    lock:            <svg style={s} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" {...p}/><path d="M7 11V7a5 5 0 0110 0v4" {...p}/></svg>,
    sliders:         <svg style={s} viewBox="0 0 24 24"><line x1="4" y1="21" x2="4" y2="14" {...p}/><line x1="4" y1="10" x2="4" y2="3" {...p}/><line x1="12" y1="21" x2="12" y2="12" {...p}/><line x1="12" y1="8" x2="12" y2="3" {...p}/><line x1="20" y1="21" x2="20" y2="16" {...p}/><line x1="20" y1="12" x2="20" y2="3" {...p}/><line x1="1" y1="14" x2="7" y2="14" {...p}/><line x1="9" y1="8" x2="15" y2="8" {...p}/><line x1="17" y1="16" x2="23" y2="16" {...p}/></svg>,
    chat:            <svg style={s} viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" {...p}/></svg>,
  }

  return <>{icons[name] ?? <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...p}/></svg>}</>
}
