export function renderDashboard(): string {
  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Signal — PM Feedback Intelligence</title>
<style>
  :root {
    --bg:#0d0f17; --surface:#13161f; --card:#1a1e2e; --border:#252a3d;
    --orange:#f6821f; --orange-dim:#7a3e0a;
    --text:#e2e4ec; --muted:#6b7280;
    --neg:#ef4444; --neu:#f59e0b; --pos:#22c55e;
    --neg-bg:rgba(239,68,68,.12); --neu-bg:rgba(245,158,11,.12); --pos-bg:rgba(34,197,94,.12);
    --discord:#5865f2; --github:#8b949e; --twitter:#1da1f2; --support:#f6821f; --forum:#a78bfa;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;}

  /* ── Screens ── */
  .screen{position:fixed;inset:0;display:none;flex-direction:column;overflow:hidden;}
  .screen.active{display:flex;}

  /* ════ WELCOME ════ */
  #welcome{align-items:center;justify-content:flex-start;overflow-y:auto;background:var(--bg);}
  .orb{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;animation:orbfloat 24s ease-in-out infinite;}
  .orb-1{width:560px;height:560px;background:radial-gradient(circle,rgba(246,130,31,.35),transparent);top:-180px;left:-120px;opacity:.18;animation-duration:28s;}
  .orb-2{width:480px;height:480px;background:radial-gradient(circle,rgba(88,101,242,.4),transparent);bottom:-80px;right:-80px;opacity:.16;animation-delay:-10s;animation-duration:32s;}
  .orb-3{width:360px;height:360px;background:radial-gradient(circle,rgba(34,197,94,.3),transparent);top:45%;left:45%;opacity:.1;animation-delay:-5s;animation-duration:20s;}
  @keyframes orbfloat{0%,100%{transform:translate(0,0) scale(1);}25%{transform:translate(28px,-22px) scale(1.04);}50%{transform:translate(-18px,28px) scale(.96);}75%{transform:translate(18px,18px) scale(1.02);}}

  .welcome-inner{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;padding:56px 24px 72px;width:100%;max-width:1060px;margin:0 auto;}

  .welcome-logo{display:flex;align-items:center;gap:14px;margin-bottom:14px;}
  .welcome-logo svg{width:44px;height:44px;}
  .welcome-logo-text{font-size:34px;font-weight:800;letter-spacing:-1.2px;color:var(--text);}
  .welcome-tagline{font-size:15px;color:var(--muted);margin-bottom:6px;letter-spacing:.2px;}
  .welcome-sub{font-size:12px;color:var(--muted);opacity:.65;margin-bottom:56px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;}
  .welcome-sub .dot{width:4px;height:4px;border-radius:50%;background:var(--orange);display:inline-block;}

  .portal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;width:100%;}

  .portal-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:30px 26px;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;position:relative;overflow:hidden;display:flex;flex-direction:column;}
  .portal-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0;background:var(--c-accent);}
  .portal-card:hover{transform:translateY(-7px);border-color:var(--c-accent);box-shadow:0 24px 64px rgba(0,0,0,.45),0 0 0 1px var(--c-accent-dim);}
  .pc-red{--c-accent:#ef4444;--c-accent-dim:rgba(239,68,68,.22);--c-accent-bg:rgba(239,68,68,.07);}
  .pc-blue{--c-accent:#3b82f6;--c-accent-dim:rgba(59,130,246,.22);--c-accent-bg:rgba(59,130,246,.07);}
  .pc-green{--c-accent:#22c55e;--c-accent-dim:rgba(34,197,94,.22);--c-accent-bg:rgba(34,197,94,.07);}

  .portal-icon{width:50px;height:50px;border-radius:12px;background:var(--c-accent-bg);border:1px solid var(--c-accent-dim);display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:18px;flex-shrink:0;}
  .portal-num{font-size:10px;font-weight:700;color:var(--c-accent);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:7px;}
  .portal-title{font-size:20px;font-weight:800;color:var(--text);margin-bottom:8px;letter-spacing:-.3px;}
  .portal-desc{font-size:13px;color:var(--muted);line-height:1.65;flex:1;margin-bottom:20px;}
  .portal-stat{font-size:11px;color:var(--c-accent);font-weight:600;background:var(--c-accent-bg);border:1px solid var(--c-accent-dim);padding:4px 10px;border-radius:6px;display:inline-block;margin-bottom:18px;min-height:22px;}
  .portal-enter{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--c-accent-bg);border:1px solid var(--c-accent-dim);border-radius:8px;font-size:13px;font-weight:600;color:var(--c-accent);}
  .portal-card:hover .portal-enter{background:var(--c-accent-dim);}
  .portal-arrow{transition:transform .2s;}
  .portal-card:hover .portal-arrow{transform:translateX(5px);}

  .welcome-footer{margin-top:44px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;}
  .welcome-footer-lbl{font-size:11px;color:var(--muted);}
  .cf-pill{font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;border:1px solid var(--orange-dim);color:var(--orange);background:rgba(246,130,31,.06);}

  /* ── Loading progress bar ── */
  #progress-bar{position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--orange),#f59e0b);width:0%;transition:width .4s ease;z-index:9999;pointer-events:none;}
  #progress-bar.done{opacity:0;transition:width .4s ease,opacity .5s ease .2s;}

  /* ── Portal stat shimmer ── */
  @keyframes shimmer{0%{opacity:.4;}50%{opacity:1;}100%{opacity:.4;}}
  .portal-stat.loading{animation:shimmer 1.4s ease-in-out infinite;color:var(--muted);border-color:var(--border);background:var(--border);}

  /* ════ VIEW NAV (shared) ════ */
  .view-nav{height:48px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 20px;gap:14px;flex-shrink:0;z-index:10;}
  .vnav-back{display:flex;align-items:center;gap:6px;background:none;border:none;color:var(--muted);cursor:pointer;font-size:12px;font-weight:500;padding:4px 8px;border-radius:6px;transition:all .15s;white-space:nowrap;}
  .vnav-back:hover{background:var(--card);color:var(--text);}
  .vnav-sep{width:1px;height:20px;background:var(--border);}
  .vnav-title{font-size:13px;font-weight:600;color:var(--text);}
  .vnav-right{margin-left:auto;display:flex;gap:8px;align-items:center;}
  .nav-metrics{display:flex;gap:18px;}
  .metric{display:flex;flex-direction:column;align-items:flex-end;}
  .metric-val{font-size:15px;font-weight:700;line-height:1;}
  .metric-lbl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-top:2px;}
  .metric-val.neg{color:var(--neg);}
  .metric-val.pos{color:var(--pos);}
  .metric-val.ora{color:var(--orange);}

  /* ════ INSIGHTS VIEW ════ */
  .hero{flex-shrink:0;background:linear-gradient(135deg,rgba(246,130,31,.08) 0%,rgba(88,101,242,.06) 100%);border-bottom:1px solid var(--border);padding:10px 20px;display:flex;align-items:center;gap:24px;}
  .hero-left{flex:1;}
  .hero-title{font-size:13px;font-weight:700;color:var(--text);margin-bottom:3px;}
  .hero-sub{font-size:11px;color:var(--muted);line-height:1.5;}
  .hero-flow{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
  .hero-flow-src{font-size:10px;color:var(--muted);}
  .hero-arrow{color:var(--border);font-size:12px;}
  .cf-badge{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;padding:3px 8px;border-radius:4px;border:1px solid var(--border);color:var(--muted);white-space:nowrap;}
  .cf-badge.active{border-color:var(--orange-dim);color:var(--orange);background:rgba(246,130,31,.06);}
  .layout{display:grid;grid-template-columns:190px 1fr 272px;flex:1;overflow:hidden;}
  aside{background:var(--surface);border-right:1px solid var(--border);padding:14px 10px;display:flex;flex-direction:column;gap:18px;overflow-y:auto;}
  .filter-group h4{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px;padding:0 8px;}
  .filter-btn{display:flex;align-items:center;justify-content:space-between;width:100%;padding:5px 10px;border-radius:6px;background:none;border:none;color:var(--muted);cursor:pointer;font-size:12px;transition:all .15s;}
  .filter-btn:hover{background:var(--card);color:var(--text);}
  .filter-btn.active{background:var(--card);color:var(--text);}
  .filter-btn .dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
  .filter-btn .count{font-size:11px;color:var(--muted);background:var(--border);padding:1px 6px;border-radius:10px;min-width:20px;text-align:center;}
  .dot-discord{background:var(--discord);}.dot-github{background:var(--github);}.dot-twitter{background:var(--twitter);}
  .dot-support{background:var(--support);}.dot-forum{background:var(--forum);}
  .dot-all{background:linear-gradient(135deg,var(--orange),var(--discord));}
  .divider{height:1px;background:var(--border);}
  .feed-area{display:flex;flex-direction:column;overflow:hidden;}
  .feed-tabs{display:flex;gap:2px;padding:10px 14px 0;border-bottom:1px solid var(--border);background:var(--surface);flex-shrink:0;}
  .tab-btn{padding:6px 14px 8px;background:none;border:none;border-bottom:2px solid transparent;color:var(--muted);cursor:pointer;font-size:12px;font-weight:500;transition:all .15s;margin-bottom:-1px;}
  .tab-btn:hover{color:var(--text);}
  .tab-btn.active{color:var(--text);border-bottom-color:var(--orange);}
  .tab-btn.tab-loves.active{color:var(--pos);border-bottom-color:var(--pos);}
  .tab-btn.tab-issues.active{color:var(--neg);border-bottom-color:var(--neg);}
  main{overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;}
  .loves-header{background:rgba(34,197,94,.07);border:1px solid rgba(34,197,94,.2);border-radius:10px;padding:12px 14px;margin-bottom:4px;}
  .loves-header h3{font-size:12px;color:var(--pos);margin-bottom:4px;}
  .loves-header p{font-size:12px;color:var(--muted);line-height:1.5;}
  .card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:13px 15px;transition:border-color .15s,transform .1s;cursor:pointer;}
  .card:hover{border-color:var(--orange-dim);transform:translateY(-1px);}
  .card.card-love{border-left:3px solid var(--pos);}
  .card-header{display:flex;align-items:center;gap:7px;margin-bottom:7px;}
  .source-badge{font-size:10px;font-weight:600;padding:2px 7px;border-radius:4px;text-transform:uppercase;letter-spacing:.4px;}
  .src-discord{background:rgba(88,101,242,.2);color:var(--discord);}
  .src-github{background:rgba(139,148,158,.15);color:var(--github);}
  .src-twitter{background:rgba(29,161,242,.15);color:var(--twitter);}
  .src-support{background:rgba(246,130,31,.15);color:var(--support);}
  .src-forum{background:rgba(167,139,250,.15);color:var(--forum);}
  .author{font-size:11px;color:var(--muted);}
  .ts{font-size:11px;color:var(--muted);margin-left:auto;}
  .card-text{line-height:1.55;color:var(--text);margin-bottom:9px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;font-size:13px;}
  .card-footer{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
  .sentiment-badge{font-size:10px;font-weight:600;padding:2px 7px;border-radius:4px;text-transform:uppercase;letter-spacing:.3px;}
  .sent-negative{background:var(--neg-bg);color:var(--neg);}
  .sent-neutral{background:var(--neu-bg);color:var(--neu);}
  .sent-positive{background:var(--pos-bg);color:var(--pos);}
  .urgency{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--muted);}
  .urgency-bar{width:36px;height:3px;border-radius:2px;background:var(--border);overflow:hidden;}
  .urgency-fill{height:100%;border-radius:2px;}
  .theme-tag{font-size:10px;padding:2px 6px;border-radius:4px;background:var(--border);color:var(--muted);}
  .empty{color:var(--muted);text-align:center;padding:60px 20px;font-size:13px;}
  .digest-panel{background:var(--surface);border-left:1px solid var(--border);padding:14px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;}
  .panel-title{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.7px;font-weight:600;}
  .digest-meta{font-size:11px;color:var(--muted);}
  .digest-narrative{font-size:12px;line-height:1.6;color:var(--text);}
  .themes-grid{display:flex;flex-direction:column;gap:5px;}
  .theme-row{display:flex;align-items:center;gap:8px;}
  .theme-name{font-size:11px;flex:1;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .theme-bar-bg{flex:0 0 60px;height:3px;border-radius:2px;background:var(--border);overflow:hidden;}
  .theme-bar-fill{height:100%;border-radius:2px;background:var(--orange);}
  .theme-count{font-size:10px;color:var(--muted);min-width:14px;text-align:right;}
  .sentiment-row{display:flex;gap:7px;}
  .sent-stat{flex:1;background:var(--card);border:1px solid var(--border);border-radius:7px;padding:9px 6px;text-align:center;}
  .sent-stat-val{font-size:18px;font-weight:700;}
  .sent-stat-lbl{font-size:10px;color:var(--muted);text-transform:uppercase;}
  .generate-btn{width:100%;padding:9px;background:var(--orange);color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;transition:opacity .15s;display:flex;align-items:center;justify-content:center;gap:7px;}
  .generate-btn:hover{opacity:.9;}
  .generate-btn:disabled{opacity:.5;cursor:default;}
  .status-msg{font-size:11px;color:var(--muted);text-align:center;min-height:16px;}

  /* ════ TRIAGE VIEW ════ */
  .triage-team-bar{padding:14px 24px;border-bottom:1px solid var(--border);background:var(--surface);flex-shrink:0;display:flex;gap:12px;align-items:center;overflow-x:auto;}
  .triage-team-lbl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;white-space:nowrap;margin-right:4px;}
  .tm-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px;min-width:160px;}
  .tm-avatar{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:12px;flex-shrink:0;}
  .tm-info{flex:1;min-width:0;}
  .tm-name{font-size:12px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .tm-role{font-size:10px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .tm-badge{font-size:18px;font-weight:800;color:var(--orange);min-width:22px;text-align:right;}
  .tm-badge.zero{color:var(--border);font-size:14px;}
  .triage-list{flex:1;overflow-y:auto;padding:20px 24px;display:flex;flex-direction:column;gap:10px;}
  .triage-empty{color:var(--muted);text-align:center;padding:80px 20px;}
  .triage-empty .big-icon{font-size:40px;margin-bottom:14px;}
  .triage-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 16px;transition:border-color .2s;}
  .triage-card.t-sent{border-color:var(--pos);opacity:.8;}
  .triage-card-hdr{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
  .triage-card-text{font-size:13px;color:var(--text);line-height:1.5;margin-bottom:10px;}
  .triage-card-footer{display:flex;align-items:center;gap:10px;}
  .triage-select{background:var(--surface);border:1px solid var(--border);border-radius:6px;color:var(--text);padding:6px 10px;font-size:12px;cursor:pointer;max-width:200px;}
  .triage-select:focus{outline:none;border-color:var(--orange);}
  .triage-reason{font-size:11px;color:var(--muted);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .triage-sent-lbl{font-size:12px;color:var(--pos);font-weight:600;}
  .triage-footer{padding:14px 24px;border-top:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
  .triage-footer-note{font-size:12px;color:var(--muted);}
  .btn-gen{padding:8px 18px;background:var(--orange);color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;}
  .btn-gen:disabled{opacity:.5;cursor:default;}
  .btn-send{padding:8px 18px;background:var(--pos);color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;display:none;}
  .btn-send.vis{display:block;}
  .btn-send:disabled{opacity:.5;cursor:default;}

  /* ════ VOICE VIEW ════ */
  .voice-body{flex:1;overflow-y:auto;}
  .voice-hero{background:linear-gradient(135deg,rgba(34,197,94,.07) 0%,rgba(16,185,129,.04) 50%,rgba(59,130,246,.04) 100%);border-bottom:1px solid var(--border);padding:32px 36px 28px;display:flex;align-items:flex-start;gap:36px;}
  .voice-hero-text{flex:1;}
  .voice-eyebrow{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--pos);margin-bottom:8px;}
  .voice-title{font-size:28px;font-weight:800;letter-spacing:-.6px;color:var(--text);margin-bottom:10px;line-height:1.2;}
  .voice-sub{font-size:13px;color:var(--muted);line-height:1.65;max-width:480px;}
  .voice-stats{display:flex;gap:14px;flex-shrink:0;}
  .vstat{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:18px 22px;text-align:center;min-width:96px;}
  .vstat-val{font-size:30px;font-weight:800;color:var(--pos);line-height:1;}
  .vstat-lbl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.7px;margin-top:5px;}
  .voice-content{padding:28px 36px;display:flex;flex-direction:column;gap:40px;}
  .vsec-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:18px;display:flex;align-items:center;gap:8px;}
  .vsec-title::after{content:'';flex:1;height:1px;background:var(--border);}

  /* Donut */
  .score-row{display:flex;gap:36px;align-items:center;flex-wrap:wrap;}
  .donut-wrap{position:relative;width:148px;height:148px;flex-shrink:0;}
  .donut-wrap svg{width:148px;height:148px;}
  .donut-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
  .donut-pct{font-size:26px;font-weight:800;color:var(--pos);line-height:1;}
  .donut-lbl{font-size:10px;color:var(--muted);margin-top:2px;}
  .breakdown{flex:1;display:flex;flex-direction:column;gap:12px;min-width:200px;}
  .bd-row{display:flex;align-items:center;gap:10px;}
  .bd-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
  .bd-label{font-size:13px;color:var(--text);flex:1;}
  .bd-bar{flex:0 0 110px;height:4px;background:var(--border);border-radius:2px;overflow:hidden;}
  .bd-fill{height:100%;border-radius:2px;transition:width .8s ease;}
  .bd-count{font-size:12px;color:var(--muted);min-width:22px;text-align:right;}

  /* Theme bubbles */
  .bubble-grid{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
  .tbubble{padding:7px 14px;border-radius:24px;border:1px solid rgba(34,197,94,.25);background:rgba(34,197,94,.06);color:var(--pos);font-weight:600;display:inline-flex;align-items:center;gap:6px;transition:background .15s,transform .15s;cursor:default;}
  .tbubble:hover{background:rgba(34,197,94,.14);transform:scale(1.04);}
  .tb-cnt{font-size:10px;opacity:.65;}
  .tbubble.sz-lg{font-size:15px;padding:10px 18px;}
  .tbubble.sz-md{font-size:13px;}
  .tbubble.sz-sm{font-size:11px;opacity:.85;}

  /* Quote cards */
  .quotes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;}
  .quote-card{background:var(--card);border:1px solid rgba(34,197,94,.18);border-radius:12px;padding:20px;position:relative;overflow:hidden;transition:transform .15s,border-color .15s;cursor:pointer;}
  .quote-card:hover{transform:translateY(-3px);border-color:rgba(34,197,94,.4);}
  .qmark{font-size:52px;font-weight:800;color:rgba(34,197,94,.12);line-height:1;position:absolute;top:8px;right:14px;font-family:Georgia,serif;pointer-events:none;}
  .qtext{font-size:13px;line-height:1.65;color:var(--text);margin-bottom:16px;position:relative;}
  .qfooter{display:flex;align-items:center;gap:8px;}
  .qavatar{width:28px;height:28px;border-radius:50%;background:rgba(34,197,94,.18);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--pos);flex-shrink:0;}
  .qauthor{font-size:11px;font-weight:600;color:var(--text);}

  /* Want more */
  .want-grid{display:flex;flex-direction:column;gap:10px;}
  .want-card{background:var(--card);border:1px solid var(--border);border-left:3px solid rgba(245,158,11,.5);border-radius:8px;padding:13px 16px;display:flex;align-items:flex-start;gap:12px;}
  .want-icon{font-size:16px;flex-shrink:0;margin-top:1px;}
  .want-text{font-size:13px;color:var(--text);line-height:1.55;flex:1;}
  .want-meta{display:flex;align-items:center;gap:8px;margin-top:7px;flex-wrap:wrap;}

  /* ════ CHAT ════ */
  .chat-fab{position:fixed;bottom:22px;right:22px;width:50px;height:50px;border-radius:50%;background:var(--orange);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 18px rgba(246,130,31,.4);transition:transform .15s;z-index:100;}
  .chat-fab:hover{transform:scale(1.08);}
  .chat-fab svg{width:20px;height:20px;fill:#fff;}
  .chat-modal{position:fixed;bottom:82px;right:22px;width:370px;height:490px;background:var(--surface);border:1px solid var(--border);border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.5);display:none;flex-direction:column;z-index:100;overflow:hidden;}
  .chat-modal.open{display:flex;}
  .chat-header{padding:13px 16px;border-bottom:1px solid var(--border);}
  .chat-header-title{font-weight:600;font-size:14px;}
  .chat-header-sub{font-size:11px;color:var(--muted);margin-top:1px;}
  .chat-messages{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px;}
  .msg{max-width:90%;padding:9px 12px;border-radius:10px;line-height:1.5;font-size:12px;}
  .msg.user{background:var(--orange);color:#fff;align-self:flex-end;border-radius:10px 10px 2px 10px;}
  .msg.assistant{background:var(--card);color:var(--text);align-self:flex-start;border-radius:10px 10px 10px 2px;}
  .msg.assistant.streaming::after{content:'▋';animation:blink .7s step-end infinite;}
  @keyframes blink{50%{opacity:0;}}
  .chat-input-row{display:flex;gap:7px;padding:10px;border-top:1px solid var(--border);}
  .chat-input{flex:1;background:var(--card);border:1px solid var(--border);border-radius:7px;padding:8px 11px;color:var(--text);font-size:12px;outline:none;}
  .chat-input:focus{border-color:var(--orange);}
  .chat-send{background:var(--orange);border:none;border-radius:7px;width:34px;height:34px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .chat-send svg{width:14px;height:14px;fill:#fff;}
  .chat-send:disabled{opacity:.5;cursor:default;}

  /* ════ CARD MODAL ════ */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:200;display:none;align-items:center;justify-content:center;}
  .modal-overlay.open{display:flex;}
  .modal-box{background:var(--surface);border:1px solid var(--border);border-radius:14px;width:540px;max-height:80vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 30px 80px rgba(0,0,0,.6);}
  .modal-box-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border);}
  .modal-box-title{font-size:13px;font-weight:600;color:var(--muted);}
  .modal-close{background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px;line-height:1;padding:2px 6px;border-radius:4px;}
  .modal-close:hover{background:var(--card);color:var(--text);}
  .modal-body{padding:20px;overflow-y:auto;flex:1;}
  .preview-discord{background:#36393f;border-radius:8px;overflow:hidden;}
  .preview-discord-header{background:#2f3136;padding:8px 14px;font-size:11px;color:#8e9297;font-weight:600;}
  .preview-discord-msg{display:flex;gap:12px;padding:14px;}
  .preview-discord-avatar{width:36px;height:36px;border-radius:50%;background:#5865f2;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;flex-shrink:0;}
  .preview-discord-name{font-weight:600;color:#fff;font-size:13px;}
  .preview-discord-ts{font-size:10px;color:#72767d;margin-left:8px;}
  .preview-discord-text{color:#dcddde;font-size:13px;line-height:1.6;margin-top:4px;}
  .preview-reactions{padding:4px 14px 12px;display:flex;gap:6px;flex-wrap:wrap;}
  .preview-react{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:4px;padding:2px 8px;font-size:11px;color:#b9bbbe;}
  .preview-github{background:#fff;border-radius:8px;overflow:hidden;color:#24292f;font-family:-apple-system,sans-serif;}
  .preview-github-header{background:#f6f8fa;padding:10px 16px;border-bottom:1px solid #d0d7de;display:flex;align-items:center;gap:8px;}
  .preview-github-open{background:#2da44e;color:#fff;font-size:11px;font-weight:600;padding:3px 10px;border-radius:12px;}
  .preview-github-num{font-size:12px;color:#57606a;}
  .preview-github-body{padding:16px;}
  .preview-github-title{font-size:16px;font-weight:600;color:#24292f;margin-bottom:8px;}
  .preview-github-meta{font-size:11px;color:#57606a;margin-bottom:12px;}
  .preview-github-text{font-size:13px;line-height:1.6;color:#24292f;}
  .preview-github-labels{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px;}
  .preview-github-label{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;}
  .preview-twitter{background:#fff;border-radius:8px;overflow:hidden;color:#0f1419;font-family:-apple-system,sans-serif;}
  .preview-twitter-header{padding:14px 16px 0;display:flex;align-items:flex-start;gap:10px;}
  .preview-twitter-avatar{width:42px;height:42px;border-radius:50%;background:#1da1f2;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px;flex-shrink:0;}
  .preview-twitter-name{font-weight:700;font-size:14px;color:#0f1419;}
  .preview-twitter-handle{font-size:12px;color:#536471;}
  .preview-twitter-body{padding:10px 16px;font-size:15px;line-height:1.6;color:#0f1419;}
  .preview-twitter-stats{padding:10px 16px 14px;display:flex;gap:20px;border-top:1px solid #eff3f4;margin-top:6px;}
  .preview-twitter-stat{font-size:13px;color:#536471;display:flex;align-items:center;gap:5px;}
  .preview-support{background:var(--card);border-radius:8px;border:1px solid var(--border);overflow:hidden;}
  .preview-support-header{background:rgba(246,130,31,.1);border-bottom:1px solid rgba(246,130,31,.2);padding:10px 16px;display:flex;align-items:center;justify-content:space-between;}
  .preview-support-ticket{font-size:12px;font-weight:700;color:var(--orange);}
  .preview-support-priority{font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;}
  .preview-support-body{padding:16px;}
  .preview-support-subject{font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px;}
  .preview-support-meta{font-size:11px;color:var(--muted);margin-bottom:12px;}
  .preview-support-text{font-size:13px;line-height:1.6;color:var(--text);}
  .preview-forum{background:var(--card);border-radius:8px;border:1px solid var(--border);overflow:hidden;}
  .preview-forum-header{background:rgba(167,139,250,.08);border-bottom:1px solid rgba(167,139,250,.2);padding:8px 16px;font-size:11px;color:var(--forum);font-weight:600;}
  .preview-forum-body{padding:16px;}
  .preview-forum-poster{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
  .preview-forum-avatar{width:30px;height:30px;border-radius:50%;background:var(--forum);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;}
  .preview-forum-name{font-size:12px;font-weight:600;color:var(--text);}
  .preview-forum-ts{font-size:11px;color:var(--muted);}
  .preview-forum-text{font-size:13px;line-height:1.6;color:var(--text);}
  .preview-forum-footer{padding:10px 16px;border-top:1px solid var(--border);display:flex;gap:16px;}
  .preview-forum-stat{font-size:12px;color:var(--muted);}
  .modal-analysis{margin-top:16px;padding-top:16px;border-top:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-wrap:wrap;}

  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px;}
</style>
</head>
<body>

<!-- Global loading progress bar -->
<div id="progress-bar"></div>

<!-- ══════════════════ WELCOME ══════════════════ -->
<div id="welcome" class="screen active">
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>
  <div class="welcome-inner">

    <div class="welcome-logo">
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="22" fill="#f6821f" opacity=".14"/>
        <path d="M11 30C11 30 16 13 22 13C28 13 28 24 34 20" stroke="#f6821f" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <circle cx="34" cy="20" r="3.2" fill="#f6821f"/>
      </svg>
      <span class="welcome-logo-text">Signal</span>
    </div>
    <p class="welcome-tagline">PM Feedback Intelligence</p>
    <div class="welcome-sub">
      <span>Built entirely on Cloudflare</span>
      <span class="dot"></span>
      <span>Workers &nbsp;·&nbsp; Workers AI &nbsp;·&nbsp; D1 &nbsp;·&nbsp; Workflows &nbsp;·&nbsp; KV</span>
    </div>

    <div class="portal-grid">

      <div class="portal-card pc-red" data-view="triage">
        <div class="portal-icon">🎯</div>
        <div class="portal-num">01 &nbsp;/&nbsp; Triage</div>
        <div class="portal-title">Assign Issues</div>
        <div class="portal-desc">Surface high-urgency and negative feedback. AI matches each item to the right team member by expertise. Adjust, confirm, and send in one click.</div>
        <div class="portal-stat loading" id="ps-triage">Connecting…</div>
        <div class="portal-enter"><span>Open Triage</span><span class="portal-arrow">→</span></div>
      </div>

      <div class="portal-card pc-blue" data-view="insights">
        <div class="portal-icon">📊</div>
        <div class="portal-num">02 &nbsp;/&nbsp; Insights</div>
        <div class="portal-title">Feedback Insights</div>
        <div class="portal-desc">Explore all feedback filtered by source, sentiment, and urgency. View original posts. Chat with your data using AI. Run the full analysis pipeline.</div>
        <div class="portal-stat loading" id="ps-insights">Connecting…</div>
        <div class="portal-enter"><span>Open Insights</span><span class="portal-arrow">→</span></div>
      </div>

      <div class="portal-card pc-green" data-view="voice">
        <div class="portal-icon">💚</div>
        <div class="portal-num">03 &nbsp;/&nbsp; Voice</div>
        <div class="portal-title">Customer Voice</div>
        <div class="portal-desc">Discover what your users love and what they want more of. Understand the themes driving satisfaction — and the signals that show you where to invest next.</div>
        <div class="portal-stat loading" id="ps-voice">Connecting…</div>
        <div class="portal-enter"><span>Open Voice</span><span class="portal-arrow">→</span></div>
      </div>

    </div>

    <div class="welcome-footer">
      <span class="welcome-footer-lbl">Powered by</span>
      <span class="cf-pill">Workers</span>
      <span class="cf-pill">Workers AI</span>
      <span class="cf-pill">D1</span>
      <span class="cf-pill">Workflows</span>
      <span class="cf-pill">KV</span>
    </div>

  </div>
</div>

<!-- ══════════════════ TRIAGE VIEW ══════════════════ -->
<div id="view-triage" class="screen">
  <div class="view-nav">
    <button class="vnav-back" data-action="home">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      Signal
    </button>
    <div class="vnav-sep"></div>
    <div class="vnav-title">🎯 Triage</div>
    <div class="vnav-right">
      <button class="btn-gen" id="btn-triage-gen">Generate Assignments</button>
      <button class="btn-send" id="btn-triage-send">Send All Requests</button>
    </div>
  </div>

  <div class="triage-team-bar" id="triage-team-bar">
    <span class="triage-team-lbl">Team</span>
    <span style="color:var(--muted);font-size:12px">Click "Generate Assignments" to load workload</span>
  </div>

  <div class="triage-list" id="triage-list">
    <div class="triage-empty">
      <div class="big-icon">🎯</div>
      <div style="font-size:15px;font-weight:600;color:var(--text);margin-bottom:8px">No assignments yet</div>
      <div style="font-size:13px">Click <strong>Generate Assignments</strong> to surface critical issues<br>and match them to the right team members.</div>
    </div>
  </div>

  <div class="triage-footer">
    <span class="triage-footer-note" id="triage-footer-note">High-urgency &amp; negative feedback · AI-matched to team expertise</span>
  </div>
</div>

<!-- ══════════════════ INSIGHTS VIEW ══════════════════ -->
<div id="view-insights" class="screen">
  <div class="view-nav">
    <button class="vnav-back" data-action="home">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      Signal
    </button>
    <div class="vnav-sep"></div>
    <div class="vnav-title">📊 Feedback Insights</div>
    <div class="vnav-right">
      <div class="nav-metrics">
        <div class="metric"><span class="metric-val" id="m-total">—</span><span class="metric-lbl">Total</span></div>
        <div class="metric"><span class="metric-val neg" id="m-neg">—</span><span class="metric-lbl">Negative</span></div>
        <div class="metric"><span class="metric-val ora" id="m-urgency">—</span><span class="metric-lbl">Avg Urgency</span></div>
        <div class="metric"><span class="metric-val pos" id="m-top-theme">—</span><span class="metric-lbl">Top Theme</span></div>
      </div>
    </div>
  </div>

  <div class="hero">
    <div class="hero-left">
      <div class="hero-title">Signal — PM feedback intelligence, built entirely on Cloudflare</div>
      <div class="hero-sub">Aggregates feedback from Discord, GitHub, Twitter/X, Support tickets &amp; Community forums. AI analyzes sentiment, urgency &amp; themes in a durable Workflow pipeline.</div>
    </div>
    <div class="hero-flow">
      <span class="hero-flow-src">5 sources</span>
      <span class="hero-arrow">→</span>
      <span class="cf-badge active">Workers</span>
      <span class="hero-arrow">→</span>
      <span class="cf-badge active">Workers AI</span>
      <span class="hero-arrow">→</span>
      <span class="cf-badge active">D1</span>
      <span class="hero-arrow">→</span>
      <span class="cf-badge active">Workflows</span>
      <span class="hero-arrow">→</span>
      <span class="cf-badge active">KV</span>
    </div>
  </div>

  <div class="layout">
    <aside>
      <div class="filter-group">
        <h4>Source</h4>
        <button class="filter-btn active" data-filter="source" data-value="all">
          <span style="display:flex;align-items:center;gap:6px"><span class="dot dot-all"></span>All</span>
          <span class="count" id="cnt-all">0</span>
        </button>
        <button class="filter-btn" data-filter="source" data-value="discord">
          <span style="display:flex;align-items:center;gap:6px"><span class="dot dot-discord"></span>Discord</span>
          <span class="count" id="cnt-discord">0</span>
        </button>
        <button class="filter-btn" data-filter="source" data-value="github">
          <span style="display:flex;align-items:center;gap:6px"><span class="dot dot-github"></span>GitHub</span>
          <span class="count" id="cnt-github">0</span>
        </button>
        <button class="filter-btn" data-filter="source" data-value="twitter">
          <span style="display:flex;align-items:center;gap:6px"><span class="dot dot-twitter"></span>Twitter / X</span>
          <span class="count" id="cnt-twitter">0</span>
        </button>
        <button class="filter-btn" data-filter="source" data-value="support">
          <span style="display:flex;align-items:center;gap:6px"><span class="dot dot-support"></span>Support</span>
          <span class="count" id="cnt-support">0</span>
        </button>
        <button class="filter-btn" data-filter="source" data-value="forum">
          <span style="display:flex;align-items:center;gap:6px"><span class="dot dot-forum"></span>Forum</span>
          <span class="count" id="cnt-forum">0</span>
        </button>
      </div>
      <div class="divider"></div>
      <div class="filter-group">
        <h4>Sentiment</h4>
        <button class="filter-btn active" data-filter="sentiment" data-value="all"><span>All</span><span class="count" id="scnt-all">0</span></button>
        <button class="filter-btn" data-filter="sentiment" data-value="negative"><span style="color:var(--neg)">Negative</span><span class="count" id="scnt-negative">0</span></button>
        <button class="filter-btn" data-filter="sentiment" data-value="neutral"><span style="color:var(--neu)">Neutral</span><span class="count" id="scnt-neutral">0</span></button>
        <button class="filter-btn" data-filter="sentiment" data-value="positive"><span style="color:var(--pos)">Positive</span><span class="count" id="scnt-positive">0</span></button>
      </div>
      <div class="divider"></div>
      <div class="filter-group">
        <h4>Urgency</h4>
        <button class="filter-btn active" data-filter="urgency" data-value="all"><span>All</span></button>
        <button class="filter-btn" data-filter="urgency" data-value="high"><span style="color:var(--neg)">High (7–10)</span></button>
        <button class="filter-btn" data-filter="urgency" data-value="medium"><span style="color:var(--neu)">Medium (4–6)</span></button>
        <button class="filter-btn" data-filter="urgency" data-value="low"><span style="color:var(--pos)">Low (1–3)</span></button>
      </div>
    </aside>

    <div class="feed-area">
      <div class="feed-tabs">
        <button class="tab-btn active" data-tab="all">All</button>
        <button class="tab-btn tab-issues" data-tab="issues">🔴 Issues</button>
        <button class="tab-btn tab-loves" data-tab="loves">💚 Loves</button>
      </div>
      <main id="feed"><div class="empty">Loading feedback…</div></main>
    </div>

    <div class="digest-panel">
      <div>
        <p class="panel-title">AI Digest</p>
        <p class="digest-meta" id="digest-ts">Not yet generated</p>
      </div>
      <div id="digest-narrative" class="digest-narrative" style="display:none"></div>
      <div id="digest-sentiment" style="display:none">
        <p class="panel-title" style="margin-bottom:9px">Sentiment</p>
        <div class="sentiment-row">
          <div class="sent-stat"><div class="sent-stat-val neg" id="ds-neg">0</div><div class="sent-stat-lbl">Neg</div></div>
          <div class="sent-stat"><div class="sent-stat-val" style="color:var(--neu)" id="ds-neu">0</div><div class="sent-stat-lbl">Neu</div></div>
          <div class="sent-stat"><div class="sent-stat-val pos" id="ds-pos">0</div><div class="sent-stat-lbl">Pos</div></div>
        </div>
      </div>
      <div id="digest-themes" style="display:none">
        <p class="panel-title" style="margin-bottom:9px">Top Themes</p>
        <div class="themes-grid" id="themes-list"></div>
      </div>
      <div class="divider"></div>
      <button class="generate-btn" id="generate-btn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        Run Analysis Pipeline
      </button>
      <p class="status-msg" id="status-msg"></p>
    </div>
  </div>
</div>

<!-- ══════════════════ VOICE VIEW ══════════════════ -->
<div id="view-voice" class="screen">
  <div class="view-nav">
    <button class="vnav-back" data-action="home">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      Signal
    </button>
    <div class="vnav-sep"></div>
    <div class="vnav-title">💚 Customer Voice</div>
  </div>

  <div class="voice-body">
    <div class="voice-hero">
      <div class="voice-hero-text">
        <div class="voice-eyebrow">Customer Voice</div>
        <div class="voice-title">What they love.<br>What they want next.</div>
        <div class="voice-sub">Discover the signals hiding in your positive feedback — the themes users love, the features they're asking for, and the experiences worth doubling down on.</div>
      </div>
      <div class="voice-stats">
        <div class="vstat"><div class="vstat-val" id="v-pct">—</div><div class="vstat-lbl">Love Score</div></div>
        <div class="vstat"><div class="vstat-val" id="v-fans">—</div><div class="vstat-lbl">Fans</div></div>
        <div class="vstat"><div class="vstat-val" id="v-wants">—</div><div class="vstat-lbl">Requests</div></div>
      </div>
    </div>

    <div class="voice-content">

      <div>
        <div class="vsec-title">Satisfaction Overview</div>
        <div class="score-row">
          <div class="donut-wrap">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="46" fill="none" stroke="var(--border)" stroke-width="10"/>
              <circle cx="60" cy="60" r="46" fill="none" stroke="var(--pos)" stroke-width="10"
                stroke-dasharray="0 289.0" stroke-linecap="round"
                transform="rotate(-90 60 60)" id="v-donut"
                style="transition:stroke-dasharray .9s ease;"/>
            </svg>
            <div class="donut-center">
              <div class="donut-pct" id="v-donut-pct">—</div>
              <div class="donut-lbl">positive</div>
            </div>
          </div>
          <div class="breakdown">
            <div class="bd-row">
              <div class="bd-dot" style="background:var(--pos)"></div>
              <div class="bd-label">Positive</div>
              <div class="bd-bar"><div class="bd-fill" id="v-fill-pos" style="background:var(--pos);width:0%"></div></div>
              <div class="bd-count" id="v-cnt-pos">0</div>
            </div>
            <div class="bd-row">
              <div class="bd-dot" style="background:var(--neu)"></div>
              <div class="bd-label">Neutral</div>
              <div class="bd-bar"><div class="bd-fill" id="v-fill-neu" style="background:var(--neu);width:0%"></div></div>
              <div class="bd-count" id="v-cnt-neu">0</div>
            </div>
            <div class="bd-row">
              <div class="bd-dot" style="background:var(--neg)"></div>
              <div class="bd-label">Negative</div>
              <div class="bd-bar"><div class="bd-fill" id="v-fill-neg" style="background:var(--neg);width:0%"></div></div>
              <div class="bd-count" id="v-cnt-neg">0</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="vsec-title">What They Love — Top Themes</div>
        <div class="bubble-grid" id="v-themes"><span style="color:var(--muted);font-size:13px">Loading…</span></div>
      </div>

      <div>
        <div class="vsec-title">Featured Voices</div>
        <div class="quotes-grid" id="v-quotes"><span style="color:var(--muted);font-size:13px">Loading…</span></div>
      </div>

      <div>
        <div class="vsec-title">✨ They Want More Of…</div>
        <div class="want-grid" id="v-want"><span style="color:var(--muted);font-size:13px">Loading…</span></div>
      </div>

    </div>
  </div>
</div>

<!-- Chat FAB -->
<button class="chat-fab" id="chat-fab">
  <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
</button>

<!-- Chat Modal -->
<div class="chat-modal" id="chat-modal">
  <div class="chat-header">
    <div class="chat-header-title">Ask Signal</div>
    <div class="chat-header-sub">Query your feedback with AI</div>
  </div>
  <div class="chat-messages" id="chat-messages">
    <div class="msg assistant">Hi! Ask me anything about your feedback. Try: <em>"What are users most frustrated by?"</em> or <em>"What do users love?"</em></div>
  </div>
  <div class="chat-input-row">
    <input class="chat-input" id="chat-input" type="text" placeholder="Ask about your feedback…" autocomplete="off"/>
    <button class="chat-send" id="chat-send">
      <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
    </button>
  </div>
</div>

<!-- Card Detail Modal -->
<div class="modal-overlay" id="card-modal">
  <div class="modal-box">
    <div class="modal-box-header">
      <span class="modal-box-title" id="card-modal-title">Original Post</span>
      <button class="modal-close" id="card-modal-close">×</button>
    </div>
    <div class="modal-body">
      <div id="card-preview-content"></div>
      <div class="modal-analysis" id="card-analysis"></div>
    </div>
  </div>
</div>

<script>
(function () {
  /* ── State ── */
  var allFeedback = [];
  var activeSource = 'all', activeSentiment = 'all', activeUrgency = 'all', activeTab = 'all';
  var teamData = [], assignmentData = [], assignOverrides = {};
  var workflowId = null, pollTimer = null;
  var voiceRendered = false;

  /* ── Navigation ── */
  function showView(name) {
    document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('active'); });
    var target = document.getElementById('view-' + name);
    if (target) target.classList.add('active');
    if (name === 'voice' && !voiceRendered && allFeedback.length) { renderVoice(); voiceRendered = true; }
  }
  function goHome() {
    document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('active'); });
    document.getElementById('welcome').classList.add('active');
  }

  /* Portal card clicks */
  document.querySelectorAll('.portal-card[data-view]').forEach(function(card) {
    card.addEventListener('click', function() { showView(card.getAttribute('data-view')); });
  });
  /* Back button clicks */
  document.querySelectorAll('[data-action="home"]').forEach(function(btn) {
    btn.addEventListener('click', goHome);
  });

  /* ── Helpers ── */
  function timeAgo(iso) {
    var diff = Date.now() - new Date(iso).getTime();
    var m = Math.floor(diff / 60000);
    if (m < 60) return m + 'm ago';
    var h = Math.floor(m / 60);
    if (h < 24) return h + 'h ago';
    return Math.floor(h / 24) + 'd ago';
  }
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function urgencyColor(u) { return u >= 7 ? 'var(--neg)' : u >= 4 ? 'var(--neu)' : 'var(--pos)'; }

  /* ── Filtering ── */
  function applyFilters(items, src, sent, urg, tab) {
    var r = items;
    if (src !== 'all') r = r.filter(function(f){ return f.source === src; });
    if (urg === 'high')   r = r.filter(function(f){ return f.urgency >= 7; });
    else if (urg === 'medium') r = r.filter(function(f){ return f.urgency >= 4 && f.urgency <= 6; });
    else if (urg === 'low')    r = r.filter(function(f){ return f.urgency <= 3; });
    if (tab === 'issues') r = r.filter(function(f){ return f.sentiment === 'negative' || f.urgency >= 7; });
    else if (tab === 'loves') r = r.filter(function(f){ return f.sentiment === 'positive'; });
    else if (sent !== 'all') r = r.filter(function(f){ return f.sentiment === sent; });
    return r;
  }

  function updateCounts() {
    function set(id, v){ var e=document.getElementById(id); if(e) e.textContent=v; }
    set('cnt-all', applyFilters(allFeedback,'all',activeSentiment,activeUrgency,activeTab).length);
    ['discord','github','twitter','support','forum'].forEach(function(s){
      set('cnt-'+s, applyFilters(allFeedback,s,activeSentiment,activeUrgency,activeTab).length);
    });
    if (activeTab === 'all') {
      set('scnt-all',      applyFilters(allFeedback,activeSource,'all',     activeUrgency,'all').length);
      set('scnt-negative', applyFilters(allFeedback,activeSource,'negative',activeUrgency,'all').length);
      set('scnt-neutral',  applyFilters(allFeedback,activeSource,'neutral', activeUrgency,'all').length);
      set('scnt-positive', applyFilters(allFeedback,activeSource,'positive',activeUrgency,'all').length);
    } else {
      var ti = applyFilters(allFeedback,activeSource,'all',activeUrgency,activeTab);
      set('scnt-all',      ti.length);
      set('scnt-negative', ti.filter(function(f){ return f.sentiment==='negative'; }).length);
      set('scnt-neutral',  ti.filter(function(f){ return f.sentiment==='neutral';  }).length);
      set('scnt-positive', ti.filter(function(f){ return f.sentiment==='positive'; }).length);
    }
  }

  function updateMetrics() {
    if (!allFeedback.length) return;
    var neg = allFeedback.filter(function(f){ return f.sentiment==='negative'; }).length;
    var avgU = (allFeedback.reduce(function(a,f){ return a+(f.urgency||0); },0)/allFeedback.length).toFixed(1);
    var tc={};
    allFeedback.forEach(function(f){ try{ JSON.parse(f.themes||'[]').forEach(function(t){ tc[t]=(tc[t]||0)+1; }); }catch(e){} });
    var top=Object.entries(tc).sort(function(a,b){ return b[1]-a[1]; })[0];
    document.getElementById('m-total').textContent = allFeedback.length;
    document.getElementById('m-neg').textContent = Math.round(neg/allFeedback.length*100)+'%';
    document.getElementById('m-urgency').textContent = avgU;
    document.getElementById('m-top-theme').textContent = top?(top[0].length>12?top[0].slice(0,11)+'…':top[0]):'—';
  }

  function updateWelcomeStats() {
    var total = allFeedback.length;
    var critical = allFeedback.filter(function(f){ return f.sentiment==='negative'||f.urgency>=7; }).length;
    var positive = allFeedback.filter(function(f){ return f.sentiment==='positive'; }).length;
    function setstat(id, text) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('loading');
      el.textContent = text;
    }
    setstat('ps-triage',   critical  + ' critical items need attention');
    setstat('ps-insights', total     + ' feedback items across 5 sources');
    setstat('ps-voice',    positive  + " users love what you're building");
  }

  /* ── Feed ── */
  function renderFeed() {
    var feed = document.getElementById('feed');
    var items = applyFilters(allFeedback, activeSource, activeSentiment, activeUrgency, activeTab);
    updateCounts();
    var lovesHdr = '';
    if (activeTab === 'loves' && items.length) {
      var pt={};
      items.forEach(function(f){ try{ JSON.parse(f.themes||'[]').forEach(function(t){ pt[t]=(pt[t]||0)+1; }); }catch(e){} });
      var top=Object.entries(pt).sort(function(a,b){ return b[1]-a[1]; }).slice(0,4).map(function(e){ return e[0]; });
      lovesHdr='<div class="loves-header"><h3>💚 What users love</h3>'
        +'<p>Users express appreciation around: <strong>'+top.join(', ')+'</strong>. '
        +items.length+' positive feedback item'+(items.length!==1?'s':'')+' across all sources.</p></div>';
    }
    if (!items.length) { feed.innerHTML=lovesHdr+'<div class="empty">No feedback matches the current filters.</div>'; return; }
    feed.innerHTML=lovesHdr+items.map(function(f){
      var themes=[]; try{ themes=JSON.parse(f.themes||'[]'); }catch(e){}
      var upct=Math.round((f.urgency/10)*100);
      var lc=f.sentiment==='positive'?' card-love':'';
      return '<div class="card'+lc+'" data-id="'+f.id+'">'
        +'<div class="card-header"><span class="source-badge src-'+f.source+'">'+f.source+'</span>'
        +'<span class="author">'+esc(f.author)+'</span><span class="ts">'+timeAgo(f.created_at)+'</span></div>'
        +'<p class="card-text">'+esc(f.text)+'</p>'
        +'<div class="card-footer">'
        +'<span class="sentiment-badge sent-'+(f.sentiment||'neutral')+'">'+(f.sentiment||'—')+'</span>'
        +'<span class="urgency"><span>U:'+(f.urgency||'?')+'</span>'
        +'<span class="urgency-bar"><span class="urgency-fill" style="width:'+upct+'%;background:'+urgencyColor(f.urgency)+'"></span></span></span>'
        +themes.map(function(t){ return '<span class="theme-tag">'+esc(t)+'</span>'; }).join('')
        +'</div></div>';
    }).join('');
  }

  /* ── Load data ── */
  function setProgress(pct, done) {
    var bar = document.getElementById('progress-bar');
    if (!bar) return;
    bar.style.width = pct + '%';
    if (done) bar.classList.add('done');
  }

  function loadFeedback() {
    setProgress(20, false);
    fetch('/api/feedback')
      .then(function(r) { setProgress(60, false); return r.json(); })
      .then(function(data) {
        setProgress(100, true);
        allFeedback = data;
        updateMetrics();
        updateWelcomeStats();
        renderFeed();
        if (voiceRendered) renderVoice();
      })
      .catch(function() {
        setProgress(100, true);
        document.getElementById('feed').innerHTML = '<div class="empty">Failed to load feedback.</div>';
        ['ps-triage','ps-insights','ps-voice'].forEach(function(id) {
          var el = document.getElementById(id);
          if (el) { el.textContent = 'Could not connect'; el.classList.remove('loading'); }
        });
      });
  }

  function loadDigest() {
    fetch('/api/digest/latest').then(function(r){ return r.ok?r.json():null; }).then(function(d){
      if(!d) return;
      document.getElementById('digest-ts').textContent='Generated '+timeAgo(d.generatedAt);
      document.getElementById('digest-narrative').style.display='';
      document.getElementById('digest-narrative').textContent=d.narrative;
      document.getElementById('digest-sentiment').style.display='';
      document.getElementById('ds-neg').textContent=d.sentimentBreakdown.negative;
      document.getElementById('ds-neu').textContent=d.sentimentBreakdown.neutral;
      document.getElementById('ds-pos').textContent=d.sentimentBreakdown.positive;
      var max=d.topThemes[0]?d.topThemes[0].count:1;
      document.getElementById('themes-list').innerHTML=d.topThemes.map(function(t){
        return '<div class="theme-row"><span class="theme-name">'+esc(t.name)+'</span>'
          +'<div class="theme-bar-bg"><div class="theme-bar-fill" style="width:'+Math.round(t.count/max*100)+'%"></div></div>'
          +'<span class="theme-count">'+t.count+'</span></div>';
      }).join('');
      document.getElementById('digest-themes').style.display='';
    }).catch(function(){});
  }

  /* ── Filters ── */
  document.querySelectorAll('.filter-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var ft=btn.dataset.filter, val=btn.dataset.value;
      document.querySelectorAll('[data-filter="'+ft+'"]').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      if(ft==='source') activeSource=val;
      else if(ft==='sentiment') activeSentiment=val;
      else if(ft==='urgency') activeUrgency=val;
      renderFeed();
    });
  });

  /* ── Tabs ── */
  document.querySelectorAll('.tab-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      activeTab=btn.dataset.tab;
      if(activeTab!=='all'){
        document.querySelectorAll('[data-filter="sentiment"]').forEach(function(b){ b.classList.remove('active'); });
        document.querySelector('[data-filter="sentiment"][data-value="all"]').classList.add('active');
        activeSentiment='all';
      }
      renderFeed();
    });
  });

  /* ── Digest Pipeline ── */
  document.getElementById('generate-btn').addEventListener('click', function(){
    var btn=document.getElementById('generate-btn'), msg=document.getElementById('status-msg');
    btn.disabled=true; msg.textContent='Starting pipeline…';
    fetch('/api/digest/run',{method:'POST'}).then(function(r){ return r.json(); }).then(function(data){
      workflowId=data.instanceId; msg.textContent='Pipeline running…';
      pollTimer=setInterval(pollWorkflow,2500);
    }).catch(function(){ msg.textContent='Failed to start.'; btn.disabled=false; });
  });

  function pollWorkflow(){
    if(!workflowId) return;
    fetch('/api/digest/status/'+workflowId).then(function(r){ return r.json(); }).then(function(data){
      var msg=document.getElementById('status-msg'), btn=document.getElementById('generate-btn');
      if(data.status==='complete'){
        clearInterval(pollTimer); msg.textContent='Done! Loading digest…';
        loadFeedback(); loadDigest();
        setTimeout(function(){ msg.textContent=''; btn.disabled=false; workflowId=null; },1000);
      } else if(data.status==='errored'){
        clearInterval(pollTimer); msg.textContent='Pipeline error.'; btn.disabled=false;
      } else {
        var step=data.steps&&data.steps.length?data.steps[data.steps.length-1].name:'processing';
        msg.textContent='Step: '+step+'…';
      }
    }).catch(function(){});
  }

  /* ── Card Modal ── */
  document.getElementById('feed').addEventListener('click', function(e){
    var card=e.target.closest('.card'); if(!card) return;
    var f=allFeedback.find(function(x){ return x.id===parseInt(card.dataset.id); });
    if(f) openCardDetail(f);
  });
  document.getElementById('v-quotes').addEventListener('click', function(e){
    var card=e.target.closest('.quote-card'); if(!card) return;
    var f=allFeedback.find(function(x){ return x.id===parseInt(card.dataset.id); });
    if(f) openCardDetail(f);
  });
  document.getElementById('card-modal-close').addEventListener('click', function(){
    document.getElementById('card-modal').classList.remove('open');
  });
  document.getElementById('card-modal').addEventListener('click', function(e){
    if(e.target===this) this.classList.remove('open');
  });

  function openCardDetail(f){
    var themes=[]; try{ themes=JSON.parse(f.themes||'[]'); }catch(e){}
    document.getElementById('card-modal-title').textContent=f.source.charAt(0).toUpperCase()+f.source.slice(1)+' — Original Post';
    document.getElementById('card-preview-content').innerHTML=buildPreview(f,themes);
    document.getElementById('card-analysis').innerHTML=
      '<span class="sentiment-badge sent-'+(f.sentiment||'neutral')+'">'+(f.sentiment||'—')+'</span>'
      +'&nbsp;<span class="urgency" style="font-size:12px">Urgency <strong style="color:'+urgencyColor(f.urgency)+'">'+f.urgency+'/10</strong></span>'
      +'&nbsp;&nbsp;'+themes.map(function(t){ return '<span class="theme-tag">'+esc(t)+'</span>'; }).join(' ');
    document.getElementById('card-modal').classList.add('open');
  }

  function buildPreview(f,themes){
    var av=f.author?f.author[0].toUpperCase():'?';
    if(f.source==='discord'){
      return '<div class="preview-discord">'
        +'<div class="preview-discord-header"># product-feedback</div>'
        +'<div class="preview-discord-msg">'
        +'<div class="preview-discord-avatar">'+esc(av)+'</div>'
        +'<div style="flex:1"><span class="preview-discord-name">'+esc(f.author)+'</span>'
        +'<span class="preview-discord-ts">'+timeAgo(f.created_at)+'</span>'
        +'<div class="preview-discord-text">'+esc(f.text)+'</div></div>'
        +'</div>'
        +(themes.length?'<div class="preview-reactions">'+themes.map(function(t){ return '<span class="preview-react">🏷 '+esc(t)+'</span>'; }).join('')+'</div>':'')
        +'</div>';
    }
    if(f.source==='github'){
      var lc=['#0075ca','#e4e669','#d93f0b','#0052cc','#cfd3d7'];
      return '<div class="preview-github">'
        +'<div class="preview-github-header"><span class="preview-github-open">⬤ Open</span><span class="preview-github-num">Issue #'+(1000+f.id)+'</span></div>'
        +'<div class="preview-github-body">'
        +'<div class="preview-github-title">'+esc(f.text.split('.')[0].slice(0,60))+'</div>'
        +'<div class="preview-github-meta">'+esc(f.author)+' opened this issue · '+timeAgo(f.created_at)+'</div>'
        +'<div class="preview-github-text">'+esc(f.text)+'</div>'
        +'<div class="preview-github-labels">'+themes.map(function(t,i){ return '<span class="preview-github-label" style="background:'+lc[i%5]+'22;color:'+lc[i%5]+';border:1px solid '+lc[i%5]+'44">'+esc(t)+'</span>'; }).join('')+'</div>'
        +'</div></div>';
    }
    if(f.source==='twitter'){
      var lk=Math.floor(Math.random()*800+10), rt=Math.floor(lk*.25);
      return '<div class="preview-twitter">'
        +'<div class="preview-twitter-header"><div class="preview-twitter-avatar">'+esc(av)+'</div>'
        +'<div><div class="preview-twitter-name">'+esc(f.author.replace('@',''))+'</div>'
        +'<div class="preview-twitter-handle">'+esc(f.author)+'</div></div></div>'
        +'<div class="preview-twitter-body">'+esc(f.text)+'</div>'
        +'<div class="preview-twitter-stats"><span class="preview-twitter-stat">♥ '+lk+'</span>'
        +'<span class="preview-twitter-stat">↻ '+rt+'</span>'
        +'<span class="preview-twitter-stat">💬 '+Math.floor(lk*.05)+'</span>'
        +'<span class="preview-twitter-stat" style="margin-left:auto;font-size:11px">'+timeAgo(f.created_at)+'</span></div></div>';
    }
    if(f.source==='support'){
      var pr=f.urgency>=8?'P0':f.urgency>=6?'P1':'P2';
      var pc=f.urgency>=8?'var(--neg)':f.urgency>=6?'var(--neu)':'var(--pos)';
      return '<div class="preview-support">'
        +'<div class="preview-support-header">'
        +'<span class="preview-support-ticket">TICKET '+esc(f.author.toUpperCase())+'</span>'
        +'<span class="preview-support-priority" style="background:'+pc+'22;color:'+pc+'">'+pr+' · OPEN</span></div>'
        +'<div class="preview-support-body">'
        +'<div class="preview-support-subject">'+esc(f.text.split('.')[0].slice(0,60))+'</div>'
        +'<div class="preview-support-meta">Submitted '+timeAgo(f.created_at)+'</div>'
        +'<div class="preview-support-text">'+esc(f.text)+'</div>'
        +'</div></div>';
    }
    return '<div class="preview-forum">'
      +'<div class="preview-forum-header">💬 Community Forum · Cloudflare Developers</div>'
      +'<div class="preview-forum-body">'
      +'<div class="preview-forum-poster"><div class="preview-forum-avatar">'+esc(av)+'</div>'
      +'<div><div class="preview-forum-name">'+esc(f.author)+'</div>'
      +'<div class="preview-forum-ts">'+timeAgo(f.created_at)+'</div></div></div>'
      +'<div class="preview-forum-text">'+esc(f.text)+'</div>'
      +'</div>'
      +'<div class="preview-forum-footer"><span class="preview-forum-stat">👍 '+Math.floor(Math.random()*40+3)+'</span>'
      +'<span class="preview-forum-stat">💬 '+Math.floor(Math.random()*10+1)+' replies</span></div></div>';
  }

  /* ── Triage ── */
  document.getElementById('btn-triage-gen').addEventListener('click', function(){
    var btn=this; btn.disabled=true; btn.textContent='Loading…';
    fetch('/api/assign',{method:'POST'}).then(function(r){ return r.json(); }).then(function(data){
      teamData=data.team; assignmentData=data.assignments; assignOverrides={};
      renderTriagePanel();
      btn.textContent='Regenerate'; btn.disabled=false;
    }).catch(function(){ btn.textContent='Generate Assignments'; btn.disabled=false; });
  });

  function renderTriagePanel(){
    var counts={};
    teamData.forEach(function(m){ counts[m.id]=0; });
    assignmentData.forEach(function(a){ var e=assignOverrides[a.feedbackId]||a.assignedTo; counts[e]=(counts[e]||0)+1; });

    document.getElementById('triage-team-bar').innerHTML=
      '<span class="triage-team-lbl">Team Workload</span>'
      +teamData.map(function(m){
        var cnt=counts[m.id]||0;
        return '<div class="tm-card">'
          +'<div class="tm-avatar" style="background:'+m.color+'">'+esc(m.initials)+'</div>'
          +'<div class="tm-info"><div class="tm-name">'+esc(m.name)+'</div><div class="tm-role">'+esc(m.role)+'</div></div>'
          +'<div class="tm-badge'+(cnt===0?' zero':'')+'">'+cnt+'</div>'
          +'</div>';
      }).join('');

    document.getElementById('triage-list').innerHTML=assignmentData.map(function(a){
      var eff=assignOverrides[a.feedbackId]||a.assignedTo;
      var themes=(a.themes||[]).map(function(t){ return '<span class="theme-tag">'+esc(t)+'</span>'; }).join(' ');
      var upct=Math.round(((a.urgency||0)/10)*100);
      return '<div class="triage-card" id="tc-'+a.feedbackId+'">'
        +'<div class="triage-card-hdr">'
        +'<span class="source-badge src-'+a.source+'">'+a.source+'</span>'
        +'<span class="author">'+esc(a.author)+'</span>'
        +'<span class="urgency" style="margin-left:auto"><span style="font-size:11px">U:'+(a.urgency||'?')+'</span>'
        +'<span class="urgency-bar"><span class="urgency-fill" style="width:'+upct+'%;background:'+urgencyColor(a.urgency)+'"></span></span></span>'
        +'</div>'
        +'<div class="triage-card-text">'+esc(a.text)+'</div>'
        +'<div style="margin-bottom:10px">'+themes+'</div>'
        +'<div class="triage-card-footer">'
        +'<select class="triage-select" data-id="'+a.feedbackId+'">'
        +teamData.map(function(m){ return '<option value="'+esc(m.id)+'"'+(m.id===eff?' selected':'')+'>'+esc(m.name)+'</option>'; }).join('')
        +'</select>'
        +'<span class="triage-reason" id="tr-'+a.feedbackId+'">'+esc(a.reason)+'</span>'
        +'</div></div>';
    }).join('');

    document.querySelectorAll('.triage-select').forEach(function(sel){
      sel.addEventListener('change', function(){
        var id=parseInt(this.dataset.id);
        assignOverrides[id]=this.value;
        var member=teamData.find(function(m){ return m.id===sel.value; });
        var el=document.getElementById('tr-'+id);
        if(el&&member) el.textContent='Manually assigned to '+member.name;
        refreshTriageCounts();
      });
    });

    document.getElementById('triage-footer-note').textContent=assignmentData.length+' items across '+teamData.length+' team members';
    var sb=document.getElementById('btn-triage-send');
    sb.classList.add('vis');
    sb.onclick=sendTriageRequests;
  }

  function refreshTriageCounts(){
    var counts={};
    teamData.forEach(function(m){ counts[m.id]=0; });
    assignmentData.forEach(function(a){ var e=assignOverrides[a.feedbackId]||a.assignedTo; counts[e]=(counts[e]||0)+1; });
    document.querySelectorAll('#triage-team-bar .tm-card').forEach(function(card,i){
      var b=card.querySelector('.tm-badge');
      if(b&&teamData[i]){ var c=counts[teamData[i].id]||0; b.textContent=c; b.className='tm-badge'+(c===0?' zero':''); }
    });
  }

  function sendTriageRequests(){
    var btn=document.getElementById('btn-triage-send'); btn.disabled=true;
    var delay=0;
    document.querySelectorAll('.triage-card').forEach(function(card){
      setTimeout(function(){
        card.classList.add('t-sent');
        var footer=card.querySelector('.triage-card-footer');
        if(footer){
          var sel=footer.querySelector('.triage-select');
          var member=teamData.find(function(m){ return m.id===(sel?sel.value:''); });
          footer.innerHTML='<span class="triage-sent-lbl">✅ Request sent to '+esc(member?member.name:'team')+'</span>';
        }
      }, delay);
      delay+=180;
    });
    setTimeout(function(){
      var note=document.getElementById('triage-footer-note');
      note.textContent='✅ All '+assignmentData.length+' requests sent successfully!';
      note.style.color='var(--pos)';
    }, delay+200);
  }

  /* ── Voice of Customers ── */
  function renderVoice(){
    var pos=allFeedback.filter(function(f){ return f.sentiment==='positive'; });
    var neu=allFeedback.filter(function(f){ return f.sentiment==='neutral'; });
    var neg=allFeedback.filter(function(f){ return f.sentiment==='negative'; });
    var total=allFeedback.length||1;
    var pct=Math.round(pos.length/total*100);

    // Stats
    document.getElementById('v-pct').textContent=pct+'%';
    document.getElementById('v-fans').textContent=pos.length;

    // Donut (r=46, circumference=2*pi*46=289.0)
    var circ=289.0;
    var fill=pct/100*circ;
    document.getElementById('v-donut').setAttribute('stroke-dasharray',fill+' '+circ);
    document.getElementById('v-donut-pct').textContent=pct+'%';

    // Breakdown bars
    function setPct(id,val){ var e=document.getElementById(id); if(e) e.style.width=val+'%'; }
    function setTxt(id,val){ var e=document.getElementById(id); if(e) e.textContent=val; }
    setPct('v-fill-pos',Math.round(pos.length/total*100));
    setPct('v-fill-neu',Math.round(neu.length/total*100));
    setPct('v-fill-neg',Math.round(neg.length/total*100));
    setTxt('v-cnt-pos',pos.length); setTxt('v-cnt-neu',neu.length); setTxt('v-cnt-neg',neg.length);

    // Loved themes from positive items
    var tc={};
    pos.forEach(function(f){ try{ JSON.parse(f.themes||'[]').forEach(function(t){ tc[t]=(tc[t]||0)+1; }); }catch(e){} });
    var sorted=Object.entries(tc).sort(function(a,b){ return b[1]-a[1]; });
    document.getElementById('v-themes').innerHTML=sorted.length
      ? sorted.slice(0,12).map(function(e,i){
          var sz=i<3?'sz-lg':i<7?'sz-md':'sz-sm';
          return '<span class="tbubble '+sz+'">'+esc(e[0])+'<span class="tb-cnt">×'+e[1]+'</span></span>';
        }).join('')
      : '<span style="color:var(--muted);font-size:13px">No positive feedback yet.</span>';

    // Featured quotes
    document.getElementById('v-quotes').innerHTML=pos.slice(0,4).map(function(f){
      var av=f.author?f.author[0].toUpperCase():'?';
      return '<div class="quote-card" data-id="'+f.id+'">'
        +'<div class="qmark">"</div>'
        +'<div class="qtext">'+esc(f.text.length>150?f.text.slice(0,150)+'…':f.text)+'</div>'
        +'<div class="qfooter">'
        +'<div class="qavatar">'+esc(av)+'</div>'
        +'<span class="qauthor">'+esc(f.author)+'</span>'
        +'<span style="margin-left:auto"><span class="source-badge src-'+f.source+'">'+f.source+'</span></span>'
        +'</div></div>';
    }).join('');

    // "Want more" — desire keyword scan
    var kw=['wish','want','need','would love','please add','hope','could add','should add','would be great','feature request','waiting for','missing','request'];
    var wants=allFeedback.filter(function(f){
      var t=f.text.toLowerCase();
      return kw.some(function(k){ return t.includes(k); });
    }).slice(0,6);
    setTxt('v-wants', wants.length);
    document.getElementById('v-want').innerHTML=wants.length
      ? wants.map(function(f){
          var themes=[]; try{ themes=JSON.parse(f.themes||'[]'); }catch(e){}
          return '<div class="want-card">'
            +'<div class="want-icon">✨</div>'
            +'<div style="flex:1">'
            +'<div class="want-text">'+esc(f.text.length>170?f.text.slice(0,170)+'…':f.text)+'</div>'
            +'<div class="want-meta">'
            +'<span class="source-badge src-'+f.source+'">'+f.source+'</span>'
            +'<span class="author">'+esc(f.author)+'</span>'
            +themes.slice(0,2).map(function(t){ return '<span class="theme-tag">'+esc(t)+'</span>'; }).join('')
            +'</div></div></div>';
        }).join('')
      : '<p style="color:var(--muted);font-size:13px">No explicit feature requests found.</p>';
  }

  /* ── Chat ── */
  document.getElementById('chat-fab').addEventListener('click', function(){
    document.getElementById('chat-modal').classList.toggle('open');
  });
  document.getElementById('chat-send').addEventListener('click', sendChat);
  document.getElementById('chat-input').addEventListener('keydown', function(e){
    if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendChat(); }
  });

  function sendChat(){
    var input=document.getElementById('chat-input');
    var q=input.value.trim(); if(!q) return;
    input.value='';
    var msgs=document.getElementById('chat-messages');
    var send=document.getElementById('chat-send');
    msgs.insertAdjacentHTML('beforeend','<div class="msg user">'+esc(q)+'</div>');
    var bot=document.createElement('div');
    bot.className='msg assistant streaming'; msgs.appendChild(bot);
    msgs.scrollTop=msgs.scrollHeight;
    send.disabled=true; input.disabled=true;
    fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})})
      .then(function(res){
        var reader=res.body.getReader(), dec=new TextDecoder(), buf='';
        function pump(){
          return reader.read().then(function(r){
            if(r.done) return;
            buf+=dec.decode(r.value,{stream:true});
            var lines=buf.split('\\n'); buf=lines.pop();
            lines.forEach(function(line){
              if(!line.startsWith('data: ')) return;
              var raw=line.slice(6).trim();
              if(raw==='[DONE]') return;
              try{ bot.textContent+=JSON.parse(raw).response||''; msgs.scrollTop=msgs.scrollHeight; }catch(e){}
            });
            return pump();
          });
        }
        return pump();
      })
      .catch(function(){ bot.textContent='Sorry, something went wrong.'; })
      .finally(function(){ bot.classList.remove('streaming'); send.disabled=false; input.disabled=false; input.focus(); });
  }

  /* ── Init ── */
  loadFeedback();
  loadDigest();
})();
</script>
</body>
</html>`;
}
