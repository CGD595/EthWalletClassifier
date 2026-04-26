import { useEffect, useState } from 'react';
import EthGlyph from '../EthGlyph';
import ChartCard from '../ChartCard';
import { ChartWalletActivity, ChartActivityOverTime } from '../charts/Charts';
import { API } from '../../api';

function GridBg() {
  return (
    <div aria-hidden="true" style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',backgroundSize:'48px 48px',maskImage:'radial-gradient(ellipse at 50% 30%,black 40%,transparent 85%)',WebkitMaskImage:'radial-gradient(ellipse at 50% 30%,black 40%,transparent 85%)',pointerEvents:'none'}} />
  );
}

export default function HeroPage({ setPage }) {
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    fetch(`${API}/stats`, { signal: AbortSignal.timeout(6000) })
      .then(r => r.json()).then(setLiveStats).catch(() => {});
  }, []);

  const fmtStat = n => {
    if (!n) return '257M';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    return n.toLocaleString();
  };

  const stats = [
    { value: '3.1B',                                    label: 'Transactions' },
    { value: '839GB',                                   label: 'Data'         },
    { value: liveStats ? fmtStat(liveStats.total_wallets) : '257M', label: 'Wallets' },
    { value: '99.3%',                                   label: 'Accuracy'     },
  ];

  return (
    <section className="page hero">
      <GridBg />
      <div className="hero-inner">
        <div className="hero-eyebrow">
          <span className="status-dot" /> Big Data · Behavioural Classification · 2026
        </div>
        <div className="hero-title-row">
          <div className="hero-glyph"><EthGlyph size={92} /></div>
          <div>
            <h1 className="hero-title">Ethereum Wallet<br />Classifier</h1>
            <p className="hero-subtitle">
              Behavioural classification of investors using big data.
              Trained on 206M wallets and 3.1B on-chain transactions.
            </p>
          </div>
        </div>

        <div className="hero-cta-row">
          <button className="btn-primary" onClick={() => setPage('classifier')}>
            Classify a wallet <span className="arrow">→</span>
          </button>
          <button className="btn-ghost" onClick={() => setPage('model')}>
            How the model works
          </button>
        </div>

        <div className="stat-row">
          {stats.map((s, i) => (
            <div className="stat-cell" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              {i < stats.length - 1 && <div className="stat-divider" />}
            </div>
          ))}
        </div>

        <div className="hero-graphs">
          <ChartCard kicker="EDA · 01" title="Wallet activity distribution" caption="Distribution of transaction counts across the 257M-wallet population (log scale).">
            <ChartWalletActivity />
          </ChartCard>
          <ChartCard kicker="EDA · 02" title="Network activity over time" caption="Daily transaction volume from genesis to present, used to anchor activity-span features.">
            <ChartActivityOverTime />
          </ChartCard>
        </div>

        <div className="hero-classes">
          <div className="class-chip class-smart">
            <span className="dot" /> Smart Money
            <span className="chip-meta">Bots · Whales · DeFi · Holders</span>
          </div>
          <div className="class-chip class-inexp">
            <span className="dot" /> Inexperienced Money
            <span className="chip-meta">Failed traders · Casual · Dormant</span>
          </div>
        </div>
      </div>
    </section>
  );
}
