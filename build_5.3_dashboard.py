#!/usr/bin/env python3
"""Builds the Release QA Metrics Dashboard (HTML) from a JSON data file.

Usage:
    python build_5.3_dashboard.py [data.json] [output.html]

Defaults: 5.3-dashboard-data.json  ->  5.3-QA-Metrics-Dashboard.html

All counts, KPIs and percentages are computed from the data file, so you only
maintain the lists. Never put passwords or tokens in the data file.
"""
import html
import json
import sys
from collections import Counter
from pathlib import Path

CSS = r"""  :root {
    --navy: #1b2a4a; --navy2: #223761; --blue: #2563eb; --green: #16a34a; --amber: #d97706;
    --red: #dc2626; --gray: #6b7280; --bg: #f4f6fb; --card: #ffffff; --border: #e2e6ef;
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: #1f2430; line-height: 1.5; }
  header { background: linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%); color: #fff; padding: 32px 40px; }
  header h1 { margin: 0 0 6px; font-size: 26px; font-weight: 650; }
  header .sub { opacity: 0.85; font-size: 14px; }
  .tags { margin-top: 14px; display: flex; gap: 8px; flex-wrap: wrap; }
  .tag { background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.25); padding: 4px 12px; border-radius: 20px; font-size: 12.5px; }
  main { max-width: 1240px; margin: 0 auto; padding: 28px 40px 60px; }
  .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px,1fr)); gap: 14px; margin-bottom: 30px; }
  .kpi { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; }
  .kpi .num { font-size: 26px; font-weight: 700; color: var(--navy); }
  .kpi .label { font-size: 12.5px; color: var(--gray); margin-top: 2px; }
  .kpi.accent-green .num { color: var(--green); }
  .kpi.accent-red .num { color: var(--red); }
  .kpi.accent-amber .num { color: var(--amber); }
  section { margin-bottom: 38px; }
  section h2 { font-size: 17px; color: var(--navy); border-left: 4px solid var(--blue); padding-left: 10px; margin-bottom: 4px; }
  section .desc { color: var(--gray); font-size: 13px; margin: 4px 0 14px 14px; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  th { text-align: left; background: #eef1f8; color: #333; font-weight: 600; padding: 10px 12px; position: sticky; top: 0; }
  td { padding: 8px 12px; border-top: 1px solid var(--border); vertical-align: top; }
  tr:hover td { background: #fafbfe; }
  a { color: var(--blue); text-decoration: none; font-weight: 600; }
  a:hover { text-decoration: underline; }
  .scroll { max-height: 480px; overflow-y: auto; }
  .badge { display: inline-block; padding: 2px 9px; border-radius: 20px; font-size: 11.5px; font-weight: 600; }
  .st-done { background: #dcfce7; color: #166534; }
  .st-todo { background: #e5e7eb; color: #374151; }
  .st-progress { background: #dbeafe; color: #1e40af; }
  .st-deferred { background: #fef3c7; color: #92400e; }
  .pr-blocker { background: #fee2e2; color: #991b1b; }
  .pr-major { background: #fef3c7; color: #92400e; }
  .chip { display: inline-block; background: #eef1f8; color: #444; border-radius: 6px; padding: 1px 7px; font-size: 11px; margin: 1px 2px 1px 0; }
  .chip-me { background: #dbeafe; color: #1e40af; font-weight: 600; }
  .chip-warn { background: #fef3c7; color: #92400e; }
  .muted { color: var(--gray); }
  .split { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media (max-width: 900px) { .split { grid-template-columns: 1fr; } header, main { padding-left: 18px; padding-right: 18px; } }
  .metric-table td:first-child { font-weight: 600; color: #333; width: 42%; }
  .searchbar { margin: 0 0 10px; }
  .searchbar input { width: 100%; max-width: 320px; padding: 7px 10px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; }
  .filterbtns { display:flex; gap:6px; margin-bottom:10px; flex-wrap: wrap; }
  .filterbtns button { border: 1px solid var(--border); background:#fff; padding: 5px 12px; border-radius: 20px; font-size: 12.5px; cursor: pointer; color:#333; }
  .filterbtns button.active { background: var(--navy); color: #fff; border-color: var(--navy); }
  .note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 18px; font-size: 13px; color: #78530a; }
  .note ul { margin: 8px 0 0 18px; padding: 0; }
  code { background: #eef1f8; padding: 1px 5px; border-radius: 4px; font-size: 12px; }
  footer { text-align: center; color: var(--gray); font-size: 12px; padding: 20px 0 40px; }"""

JIRA = "https://invicara.atlassian.net/browse/"


def esc(s):
    return html.escape(str(s if s is not None else ""), quote=True)


def link(key):
    return f'<a href="{JIRA}{esc(key)}" target="_blank" rel="noopener">{esc(key)}</a>'


def status_badge(status):
    s = (status or "").strip()
    low = s.lower()
    if low in ("done", "closed", "resolved", "pass", "checked"):
        cls = "st-done"
    elif low == "deferred":
        cls = "st-deferred"
    elif low in ("to do", "open", "backlog", "qa to do", "not applicable", "n/a"):
        cls = "st-todo"
    else:
        cls = "st-progress"
    return f'<span class="badge {cls}">{esc(s)}</span>'


def priority_badge(priority):
    p = (priority or "").strip()
    low = p.lower()
    if low in ("blocker", "critical", "highest"):
        cls = "pr-blocker"
    elif low in ("major", "high"):
        cls = "pr-major"
    else:
        return esc(p)
    return f'<span class="badge {cls}">{esc(p)}</span>'


def is_done(status):
    return (status or "").strip().lower() in ("done", "closed", "resolved")


def assignee_cell(name, me):
    if name == me:
        return f'<span class="chip chip-me">{esc(name)}</span>'
    return f'<span class="muted">{esc(name)}</span>'


def empty_row(cols, msg="No data loaded yet."):
    return f'<tr><td colspan="{cols}" class="muted">{esc(msg)}</td></tr>'


def defect_rows(items):
    if not items:
        return empty_row(5)
    out = []
    for i, d in enumerate(items, 1):
        out.append(
            f"<tr><td>{i}</td><td>{link(d['key'])}</td><td>{esc(d['summary'])}</td>"
            f"<td>{priority_badge(d.get('priority'))}</td><td>{status_badge(d.get('status'))}</td></tr>"
        )
    return "\n".join(out)


def worked_rows(items, me, show_auto=False):
    cols = 7 if show_auto else 6
    if not items:
        return empty_row(cols)
    out = []
    for i, d in enumerate(items, 1):
        auto = f"<td>{esc(d.get('automation') or '—')}</td>" if show_auto else ""
        out.append(
            f"<tr><td>{i}</td><td>{link(d['key'])}</td><td>{esc(d['summary'])}</td>"
            f"<td>{esc(d.get('type') or '—')}</td><td>{assignee_cell(d.get('assignee'), me)}</td>"
            f"<td>{status_badge(d.get('status'))}</td>{auto}</tr>"
        )
    return "\n".join(out)


def notes_html(notes):
    if not notes:
        return ""
    has_tickets = any(n.get("tickets") for n in notes)
    rows = []
    for n in notes:
        keys = ", ".join(link(k) for k in n.get("tickets", []))
        rows.append(
            f"<tr><td>{esc(n['theme'])}</td><td>{esc(n['text'])}</td>" + (f"<td>{keys}</td>" if has_tickets else "") + "</tr>"
        )
    head = "<tr><th>Feature area</th><th>What is new</th>" + ("<th>Tickets</th>" if has_tickets else "") + "</tr>"
    return (
        '<section><h2>What is in release ' + "{REL}" + '</h2>'
        '<div class="desc">Features included in this release.</div>'
        '<div class="card"><table class="metric-table">' + head
        + "".join(rows) + '</table></div></section>'
    )


def sanity_html(sanity):
    if not sanity:
        return ""
    cols = sanity["columns"]
    head = "".join(f"<th>{esc(c)}</th>" for c in cols)
    body = ""
    for row in sanity["rows"]:
        cells = "".join(
            f"<td>{status_badge(c) if c.lower() in ('pass','fail','n/a','blocked','checked','not applicable') else esc(c)}</td>"
            for c in row["results"]
        )
        body += f"<tr><td>{esc(row['check'])}</td>{cells}<td>{esc(row.get('notes',''))}</td></tr>"
    return (
        '<section><h2>' + esc(sanity.get("title", "Backward compatibility sanity")) + '</h2>'
        '<div class="desc">' + esc(sanity.get("desc", "")) + '</div>'
        '<div class="card"><table class="metric-table"><tr><th>Check</th>' + head + '<th>Notes</th></tr>'
        + body + '</table></div></section>'
    )


def test_rows(items):
    if not items:
        return empty_row(5)
    out = []
    for i, t in enumerate(items, 1):
        tt = t.get("tests_ticket") or ""
        out.append(
            f"<tr><td>{i}</td><td>{link(t['key'])}</td><td>{esc(t['summary'])}</td>"
            f"<td>{link(tt) if tt else ''}</td><td>{status_badge(t.get('status'))}</td></tr>"
        )
    return "\n".join(out)


def pct(n, d):
    return f"{(100.0 * n / d):.1f}%" if d else "0.0%"


def main():
    base = Path(__file__).resolve().parent
    data_path = Path(sys.argv[1]) if len(sys.argv) > 1 else base / "5.3-dashboard-data.json"
    out_path = Path(sys.argv[2]) if len(sys.argv) > 2 else base / "5.3-QA-Metrics-Dashboard.html"
    d = json.loads(data_path.read_text(encoding="utf-8"))

    rel = d.get("release", "5.3")
    me = d.get("owner", "Karthik Ramu")
    plg_v = d.get("plg_version", f"Platform V{rel}")
    pa_v = d.get("pa_version", f"Reference App V{rel}")
    loaded = bool(d.get("data_loaded", False))
    tests_loaded = bool(d.get("tests_loaded", loaded))
    show_auto = any(x.get("automation") for x in d.get("plg_worked", []) + d.get("pa_worked", []))
    generated = d.get("generated", "")

    plg_def = d.get("plg_defects", [])
    pa_def = d.get("pa_defects", [])
    plg_work = d.get("plg_worked", [])
    pa_work = d.get("pa_worked", [])
    tests = d.get("tests", [])

    def cnt(items, pred):
        return sum(1 for x in items if pred(x))

    plg_blk = cnt(plg_def, lambda x: (x.get("priority") or "").lower() in ("blocker", "critical"))
    pa_blk = cnt(pa_def, lambda x: (x.get("priority") or "").lower() in ("blocker", "critical"))
    plg_closed = cnt(plg_def, lambda x: is_done(x.get("status")))
    pa_closed = cnt(pa_def, lambda x: is_done(x.get("status")))
    plg_def_deferred = cnt(plg_def, lambda x: (x.get("status") or "").lower() == "deferred")
    pa_def_deferred = cnt(pa_def, lambda x: (x.get("status") or "").lower() == "deferred")
    plg_work_done = cnt(plg_work, lambda x: is_done(x.get("status")))
    pa_work_done = cnt(pa_work, lambda x: is_done(x.get("status")))
    tests_total = len(tests)
    tests_done = cnt(tests, lambda x: is_done(x.get("status")))
    tests_pending = tests_total - tests_done
    pa_t = [x for x in tests if str(x.get("key", "")).startswith("PA-")]
    plg_t = [x for x in tests if not str(x.get("key", "")).startswith("PA-")]
    pa_t_done = cnt(pa_t, lambda x: is_done(x.get("status")))
    plg_t_done = cnt(plg_t, lambda x: is_done(x.get("status")))

    def mix(items):
        c = Counter((x.get("type") or "Other") for x in items)
        return ", ".join(f"{n} {t}" for t, n in c.most_common()) or "-"

    def v(n):
        return str(n) if loaded else "—"

    def vt(n):
        return str(n) if tests_loaded else "—"

    total_def = len(plg_def) + len(pa_def)
    total_closed = plg_closed + pa_closed
    worked_total = plg_work_done + pa_work_done
    teammates = sum(1 for x in plg_work if x.get("assignee") and x.get("assignee") != me)

    plg_bugs_total = d.get("plg_bugs_total")
    pa_bugs_total = d.get("pa_bugs_total")
    plg_def_desc = (
        f"{len(plg_def)} of {plg_bugs_total} PLG bugs on fixVersion \"{plg_v}\" have {me} as both reporter and assignee."
        if loaded and plg_bugs_total is not None
        else f"PLG bugs on fixVersion \"{plg_v}\" where {me} is both reporter and assignee."
    )
    pa_def_desc = (
        f"{len(pa_def)} of {pa_bugs_total} PA bugs on fixVersion \"{pa_v}\" have {me} as both reporter and assignee."
        if loaded and pa_bugs_total is not None
        else f"PA bugs on fixVersion \"{pa_v}\" where {me} is both reporter and assignee."
    )
    worked_filter = d.get("worked_filter", "filter = 26617 AND assignee in (<account ids>) AND statusCategory = Done")
    pa_worked_jql = d.get("pa_worked_jql", f'project = PA AND fixVersion = "{pa_v}" AND status = Done AND type IN (Story, Sub-task, Task)')

    banner = ""
    if not loaded:
        banner = (
            '<div class="note" style="margin-bottom:24px"><strong>Template — no Jira data loaded yet.</strong> '
            "Fill <code>5.3-dashboard-data.json</code> (or reconnect Jira and ask Claude to pull the data) and re-run "
            "<code>python build_5.3_dashboard.py</code>. All numbers on this page are computed from that file.</div>"
        )

    prov = d.get("provisional_notes", [])
    if prov:
        banner += (
            '<div class="note" style="margin-bottom:24px"><strong>Provisional figures:</strong><ul>'
            + "".join(f"<li>{esc(n)}</li>" for n in prov) + "</ul></div>"
        )
    notes_block = notes_html(d.get("release_notes", [])).replace("{REL}", esc(rel))
    sanity_block = sanity_html(d.get("sanity"))
    extra_notes = "".join(f"<li>{esc(n)}</li>" for n in d.get("extra_notes", []))
    kpi = lambda cls, num, label: f'<div class="kpi {cls}"><div class="num">{esc(num)}</div><div class="label">{esc(label)}</div></div>'

    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Release {esc(rel)} — QA Metrics Dashboard ({esc(me)})</title>
<style>
{CSS}
</style>
</head>
<body>

<header>
  <h1>Release {esc(rel)} — QA Metrics Dashboard</h1>
  <div class="sub">{esc(me)} · Reference Application &amp; Platform Graphics (iaf-viewer) · Generated {esc(generated) or "—"}</div>
  <div class="tags">
    <span class="tag">Jira: PA ({esc(pa_v)})</span>
    <span class="tag">Jira: PLG ({esc(plg_v)})</span>
    <span class="tag">Defects: reporter = assignee = {esc(me)}</span>
  </div>
</header>

<main>

{banner}

<section>
  <h2>At a glance</h2>
  <div class="kpis">
    {kpi("accent-red", v(total_def), "Defects raised by me")}
    {kpi("accent-green", v(total_closed), "Defects closed")}
    {kpi("", v(worked_total), "Worked tickets (Done)")}
    {kpi("", vt(tests_total), f"Xray test cases ({rel} only)")}
    {kpi("accent-green", pct(tests_done, tests_total) if tests_loaded else "—", "Test cases verified")}
    {kpi("accent-amber", vt(tests_pending), "Test cases pending")}
  </div>
</section>

{notes_block}

<section>
  <h2>Release metrics summary</h2>
  <div class="desc">Defects = raised (reporter) AND assigned to {esc(me)}. Worked tickets = Done tickets from the Jira filters listed under Data sources.</div>
  <div class="card">
    <table class="metric-table">
      <tr><th>Metric / Field</th><th>Reference App v{esc(rel)} (PA)</th><th>Platform Graphics v{esc(rel)} (PLG)</th></tr>
      <tr><td>Release Version</td><td>{esc(pa_v)}</td><td>{esc(plg_v)}</td></tr>
      <tr><td>Defects Raised by Me</td><td>{v(len(pa_def))}</td><td>{v(len(plg_def))}</td></tr>
      <tr><td>Blocker / Critical Defects</td><td>{v(pa_blk)}</td><td>{v(plg_blk)}</td></tr>
      <tr><td>Closed / Done Defects</td><td>{v(pa_closed)}</td><td>{v(plg_closed)}</td></tr>
      <tr><td>Deferred Defects</td><td>{v(pa_def_deferred)}</td><td>{v(plg_def_deferred)}</td></tr>
      <tr><td>Worked Tickets (Done)</td><td>{v(pa_work_done)}{f" ({esc(mix(pa_work))})" if loaded and pa_work else ""}</td><td>{v(plg_work_done)}{f" ({esc(mix(plg_work))})" if loaded and plg_work else ""}</td></tr>
      <tr><td>Total Test Cases (Xray, {esc(rel)} only)</td><td>{vt(len(pa_t))}</td><td>{vt(len(plg_t))}</td></tr>
      <tr><td>Test Cases Verified (Done)</td><td>{vt(pa_t_done)}</td><td>{vt(plg_t_done)}</td></tr>
      <tr><td>Test Cases Pending</td><td>{vt(len(pa_t) - pa_t_done)}</td><td>{vt(len(plg_t) - plg_t_done)}</td></tr>
    </table>
  </div>
</section>

<section>
  <h2>Defects raised by me — Platform Graphics / Viewer (PLG)</h2>
  <div class="desc">{esc(plg_def_desc)}</div>
  <div class="card scroll">
    <table>
      <tr><th>#</th><th>Key</th><th>Description</th><th>Priority</th><th>Status</th></tr>
      {defect_rows(plg_def)}
    </table>
  </div>
</section>

<section>
  <h2>Defects raised by me — Reference App (PA)</h2>
  <div class="desc">{esc(pa_def_desc)}</div>
  <div class="card scroll">
    <table>
      <tr><th>#</th><th>Key</th><th>Description</th><th>Priority</th><th>Status</th></tr>
      {defect_rows(pa_def)}
    </table>
  </div>
</section>

<section>
  <h2>Worked tickets — Platform Graphics (PLG)</h2>
  <div class="desc">{v(len(plg_work))} Done tickets from the saved filter (<code>{esc(worked_filter)}</code>){f" — {len(plg_work) - teammates} assigned to {esc(me)}, {teammates} to teammates on the same filter" if loaded and plg_work else ""}.</div>
  <div class="card scroll">
    <table>
      <tr><th>#</th><th>Key</th><th>Description</th><th>Type</th><th>Assignee</th><th>Status</th>{"<th>Automation</th>" if show_auto else ""}</tr>
      {worked_rows(plg_work, me, show_auto)}
    </table>
  </div>
</section>

<section>
  <h2>Worked tickets — Reference App (PA)</h2>
  <div class="desc">{v(len(pa_work))} Done tickets on fixVersion "{esc(pa_v)}" (<code>{esc(pa_worked_jql)}</code>).</div>
  <div class="card">
    <table>
      <tr><th>#</th><th>Key</th><th>Description</th><th>Type</th><th>Assignee</th><th>Status</th>{"<th>Automation</th>" if show_auto else ""}</tr>
      {worked_rows(pa_work, me, show_auto)}
    </table>
  </div>
</section>

<section>
  <h2>Test case coverage — worked tickets only</h2>
  <div class="desc">{vt(tests_total)} Xray Test cases linked to the worked tickets above (fixVersion "{esc(pa_v)}" / "{esc(plg_v)}"). Status Done reflects the tester's confirmation that the test case was completed.</div>
  <div class="card scroll">
    <table id="table-tests">
      <tr><th>#</th><th>Key</th><th>Description</th><th>Tests ticket</th><th>Status</th></tr>
      {test_rows(tests)}
    </table>
  </div>
</section>

{sanity_block}

<section>
  <h2>Data sources &amp; caveats</h2>
  <div class="note">
    <strong>Read this before reporting these numbers upward:</strong>
    <ul>
      <li>Defect counts require {esc(me)} to be <strong>both</strong> reporter and assignee — bugs assigned to {esc(me)} but reported by someone else are excluded from the defect count, though they still exist in the release.</li>
      <li>"Worked tickets" for PLG uses the saved filter <code>26617</code> as the base with the team assignee list and <code>statusCategory = Done</code>; do not rebuild it from fixVersion plus assignee. Rows assigned to teammates are shown in grey, not hidden. PA uses <code>status = Done AND type IN (Story, Sub-task, Task)</code> on the PA fix version.</li>
      <li>Test-case counts cover only Xray Tests linked to the worked tickets and tagged with the {esc(rel)} fix versions. a test's Done status is as confirmed by the tester; formal pass/fail results come from Test Execution issues.</li>
      <li>Fix version names differ by project: PLG "{esc(plg_v)}", PA "{esc(pa_v)}". Re-check the exact names in Jira before pulling data.</li>
      {extra_notes}
      <li>Figures pulled from Jira{f" on {esc(generated)}" if generated else ""}. Credentials intentionally excluded.</li>
    </ul>
  </div>
</section>

</main>

<footer>Release {esc(rel)} QA Metrics Dashboard · {esc(me)}</footer>

</body>
</html>
"""
    out_path.write_text(page, encoding="utf-8")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
