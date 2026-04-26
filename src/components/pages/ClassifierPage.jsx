import { useState, useEffect } from 'react';
import ChartCard from '../ChartCard';
import { ChartSubcategory } from '../charts/Charts';
import { API, DEMO_WALLETS, apiToResult, fmt, fmtFull, isValidAddr } from '../../api';

function Spinner() {
  return (
    <span className="spinner" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25"/>
        <path d="M12 3 a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>
    </span>
  );
}

function LoadingPanel({ addr }) {
  const steps = ['Fetching on-chain history','Computing 14 behavioural features','Running Random Forest inference','Resolving subcategory'];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 380);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="loading-panel">
      <div className="loading-head">
        <Spinner />
        <span className="loading-title">Inference in progress</span>
        <span className="loading-addr">{addr.slice(0,10)}…{addr.slice(-8)}</span>
      </div>
      <ul className="loading-steps">
        {steps.map((s, i) => (
          <li key={s} className={i <= step ? 'done' : i === step + 1 ? 'next' : ''}>
            <span className="step-marker">{i < step ? '✓' : i === step ? '·' : ' '}</span>{s}
          </li>
        ))}
      </ul>
      <div className="loading-bar"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
    </div>
  );
}

function EmptyState({ msg, sub }) {
  return (
    <div className="empty-state">
      <div className="empty-grid">{[...Array(36)].map((_, i) => <span key={i} />)}</div>
      <div className="empty-msg">
        <div className="empty-title">{msg || 'Awaiting address'}</div>
        <div className="empty-sub">{sub || 'Results, behavioural features, and the model\'s reasoning appear here.'}</div>
      </div>
    </div>
  );
}

function ResultCard({ result, addr }) {
  const isSmart = result.klass === 'smart';
  const stats = [
    { label: 'Transaction count',  value: fmtFull(result.txCount),                accent: true },
    { label: 'Success rate',       value: result.successRate.toFixed(2) + '%'                  },
    { label: 'Fail rate',          value: result.failRate.toFixed(2) + '%'                     },
    { label: 'Total ETH sent',     value: fmt(result.ethSent) + (result.ethSent !== 'N/A' ? ' ETH' : '') },
    { label: 'Activity span',      value: result.span + ' days'                                },
    { label: 'Active days',        value: fmtFull(result.activeDays)                           },
    { label: 'Unique contracts',   value: fmtFull(result.uniqueReceivers)                      },
    { label: 'Contract call rate', value: result.contractRate.toFixed(1) + '%'                 },
    { label: 'ERC20 rate',         value: result.erc20Rate.toFixed(1) + '%'                    },
  ];
  return (
    <div className={'result-card ' + (isSmart ? 'result-smart' : 'result-inexp')}>
      <div className="result-top">
        <div>
          <div className="result-addr-label">Address</div>
          <div className="result-addr">{addr}</div>
        </div>
        <div className="result-badge-block">
          <div className={'result-badge ' + (isSmart ? 'badge-smart' : 'badge-inexp')}>
            <span className="badge-dot" />
            {isSmart ? 'SMART MONEY' : 'INEXPERIENCED MONEY'}
          </div>
          <div className="result-sub">
            <span className="sub-label">Subcategory</span>
            <span className="sub-tag">{result.sub}</span>
          </div>
        </div>
      </div>
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className={'stat-tile ' + (s.accent ? 'tile-accent' : '')}>
            <div className="tile-label">{s.label}</div>
            <div className="tile-value">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="explain">
        <div className="explain-head"><span className="explain-tag">Why this classification</span></div>
        <p className="explain-body">{result.why}</p>
      </div>
      <div className="result-context">
        <ChartCard kicker="Population" title="Subcategory distribution" caption="Where this wallet sits among the 257M classified wallets.">
          <ChartSubcategory />
        </ChartCard>
      </div>
    </div>
  );
}

export default function ClassifierPage() {
  const [addr, setAddr]           = useState('');
  const [state, setState]         = useState('idle');
  const [result, setResult]       = useState(null);
  const [resultAddr, setResultAddr] = useState('');
  const [errMsg, setErrMsg]       = useState('');

  const submit = async () => {
    const v = addr.trim().toLowerCase();
    if (!isValidAddr(v)) { setState('error'); return; }

    if (DEMO_WALLETS[v]) {
      setState('loading');
      setTimeout(() => { setResult(DEMO_WALLETS[v]); setResultAddr(v); setState('done'); }, 1600);
      return;
    }

    setState('loading'); setResult(null);
    try {
      const res = await fetch(`${API}/classify/${v}`, { signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const data = await res.json();
      if (!data.found) { setResultAddr(v); setState('notfound'); return; }
      setResult(apiToResult(data)); setResultAddr(v); setState('done');
    } catch (err) {
      setErrMsg(err.name === 'TimeoutError'
        ? 'Request timed out. The server may still be loading. Try again shortly.'
        : `Cannot reach API at ${API}. Make sure the Flask server is running.`);
      setState('apierr');
    }
  };

  const useDemo = a => { setAddr(a); setState('idle'); };

  return (
    <section className="page classifier">
      <div className="classifier-inner">
        <div className="page-head">
          <div className="page-kicker">/02 · Live inference</div>
          <h2 className="page-title">Classify a wallet</h2>
          <p className="page-sub">Paste any Ethereum address. The Random Forest classifier returns a label, subcategory, and the behavioural features driving the decision.</p>
        </div>

        <div className="input-card">
          <div className="input-card-head">
            <label className="input-label">Wallet address</label>
            <span className="input-hint">42 chars · 0x + 40 hex</span>
          </div>
          <div className="input-row">
            <span className="input-prefix" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 12.5L12 17L20 12.5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M4 14L12 22L20 14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </span>
            <input className="addr-input" placeholder="0xea674fdde714fd979de3edf0f56aa9716b898ec8"
              value={addr} onChange={e => { setAddr(e.target.value.trim()); if (state==='error'||state==='apierr') setState('idle'); }}
              onKeyDown={e => e.key === 'Enter' && submit()} spellCheck={false} />
            <button className="btn-classify" onClick={submit} disabled={state==='loading'}>
              {state === 'loading' ? <><Spinner /> Analysing</> : <>Classify <span className="arrow">→</span></>}
            </button>
          </div>
          {state === 'error'  && <div className="input-error">Not a valid Ethereum address. Expected 0x followed by 40 hex characters.</div>}
          {state === 'apierr' && <div className="input-error">{errMsg}</div>}
          <div className="demo-row">
            <span className="demo-label">Demo wallets</span>
            <div className="demo-pills">
              {[['0xea674fdde714fd979de3edf0f56aa9716b898ec8','smart','Bot / Exchange'],
                ['0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5','smart','DeFi Power User'],
                ['0x28c6c06298d514db089934071355292781e0c28', 'smart','Whale'],
                ['0x9a2c83a39d4e1d7cc3d1b39e4f8c2b1d5e6a7b8c','inexp','One-timer'],
              ].map(([a, cls, lbl]) => (
                <button key={a} className="demo-pill" onClick={() => useDemo(a)}>
                  <span className="pill-dot" style={{ background: cls==='smart' ? 'var(--smart)' : 'var(--inexp)' }} />{lbl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {state === 'loading'  && <LoadingPanel addr={addr} />}
        {state === 'done'     && result && <ResultCard result={result} addr={resultAddr} />}
        {state === 'notfound' && <EmptyState msg="Wallet not found" sub={`${resultAddr} — not in the 257M-wallet dataset. It may be a new wallet with no transaction history.`} />}
        {(state === 'idle' || state === 'error' || state === 'apierr') && !result && <EmptyState />}
      </div>
    </section>
  );
}
