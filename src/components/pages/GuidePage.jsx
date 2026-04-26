const SMART = [
  { name:'Bot / Exchange',    sig:'Millions of txs · ≈100% success', blurb:'Automated infrastructure: hot wallets, MEV bots, settlement engines.', stats:['10M+ txs','≥99.9% success','365d/yr active'] },
  { name:'Whale',             sig:'Very high ETH volume',            blurb:'Large balance custody, OTC desks, institutional treasury.',            stats:['100k+ ETH sent','84%+ ERC20 rate','Top 0.001%'] },
  { name:'DeFi Power User',   sig:'High contract-call rate',         blurb:'Repeated, deep interaction with on-chain protocols — DEXs, lending, staking, vaults.', stats:['≥80% contract calls','Sustained 1y+','Diverse receivers'] },
  { name:'Long-term Holder',  sig:'Active 1+ years',                 blurb:'Patient capital. Modest tx count, broad time-span, accumulate-and-hold.', stats:['365d+ span','Low fail rate','Few unique receivers'] },
];
const INEXP = [
  { name:'Failed Trader',     sig:'High fail rate',             blurb:'Repeated reverted transactions — slippage, gas, front-runs.',          stats:['≥15% fail rate','Bursty activity','Low net flow'] },
  { name:'One-timer / Casual',sig:'1–5 transactions total',     blurb:'Created for a single purchase, mint, or airdrop claim. The vast majority of wallets.', stats:['1–5 txs','1–7 active days','<0.5 ETH'] },
  { name:'Dormant Wallet',    sig:'Long gap, low activity',     blurb:'Active briefly then abandoned — lost keys, forgotten wallets, one-cycle speculators.', stats:['180d+ idle','<10 txs','0% contracts'] },
];

function Col({ cls, badge, meta, items, prefix }) {
  return (
    <div className={`guide-column col-${cls}`}>
      <div className="col-head">
        <div className={`col-badge badge-${cls}`}><span className="badge-dot" /> {badge}</div>
        <div className="col-meta">{meta}</div>
      </div>
      <div className="col-cards">
        {items.map((s, i) => (
          <div className="guide-card" key={s.name}>
            <div className="guide-card-head">
              <span className="guide-num">{prefix}{i + 1}</span>
              <span className="guide-name">{s.name}</span>
            </div>
            <div className="guide-sig">{s.sig}</div>
            <p className="guide-blurb">{s.blurb}</p>
            <div className="guide-stats">
              {s.stats.map(st => <span key={st} className="guide-pill">{st}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GuidePage() {
  return (
    <section className="page guide">
      <div className="guide-inner">
        <div className="page-head">
          <div className="page-kicker">/06 · Reference</div>
          <h2 className="page-title">Classification guide</h2>
          <p className="page-sub">Every wallet resolves to one of two top-level classes and one of seven subcategories, derived from clustering on top-importance features.</p>
        </div>
        <div className="guide-columns">
          <Col cls="smart" badge="SMART MONEY"        meta="≈ 1.2% of wallets · 4 subcategories" items={SMART} prefix="S" />
          <Col cls="inexp" badge="INEXPERIENCED MONEY" meta="≈ 98.8% of wallets · 3 subcategories" items={INEXP} prefix="I" />
        </div>
      </div>
    </section>
  );
}
