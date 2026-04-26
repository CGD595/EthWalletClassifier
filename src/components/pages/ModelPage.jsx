import ChartCard from '../ChartCard';
import { ChartFeatureImportance, ChartConfusion, ChartModelPerf } from '../charts/Charts';

export default function ModelPage() {
  const metrics = [
    { label: 'Accuracy',  value: '99.30%'        },
    { label: 'AUC-ROC',   value: '0.9997'        },
    { label: 'F1 Score',  value: '0.9930'        },
    { label: 'Algorithm', value: 'Random Forest' },
  ];
  return (
    <section className="page model">
      <div className="model-inner">
        <div className="page-head">
          <div className="page-kicker">/03 · Under the hood</div>
          <h2 className="page-title">About the model</h2>
          <p className="page-sub">A Random Forest classifier trained on 206 million labelled wallets, evaluated on a 51M-wallet hold-out set. Five engineered features carry roughly 81% of total importance.</p>
        </div>
        <div className="model-grid">
          <div className="metrics-card">
            <div className="card-head">Performance</div>
            <div className="metrics-list">
              {metrics.map(m => (
                <div className="metric-row" key={m.label}>
                  <span className="metric-label">{m.label}</span>
                  <span className="metric-value">{m.value}</span>
                </div>
              ))}
            </div>
            <div className="metrics-foot">
              <div className="foot-row"><span>Training set</span><span>206,481,392 wallets</span></div>
              <div className="foot-row"><span>Hold-out set</span><span>51,620,348 wallets</span></div>
              <div className="foot-row"><span>Trees</span><span>500 · max depth 24</span></div>
              <div className="foot-row"><span>Compute</span><span>112 cores · 800GB RAM</span></div>
            </div>
          </div>
          <ChartCard kicker="Top 5 of 14" title="Feature importance" caption="Together these five features account for ≈81% of the model's predictive power.">
            <ChartFeatureImportance />
          </ChartCard>
        </div>
        <div className="model-row-2">
          <ChartCard kicker="Hold-out evaluation" title="Confusion matrix" caption="51.6M-wallet hold-out set. Diagonal cells are correct predictions; off-diagonal are errors.">
            <ChartConfusion />
          </ChartCard>
          <ChartCard kicker="ROC & PR curves" title="Model performance" caption="AUC-ROC of 0.9997 and F1 of 0.9930 on hold-out — near-ceiling separation between the two classes.">
            <ChartModelPerf />
          </ChartCard>
        </div>
      </div>
    </section>
  );
}
