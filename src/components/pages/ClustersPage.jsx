import ChartCard from '../ChartCard';
import { ChartCluster2D, ChartClusterProfiles } from '../charts/Charts';

export default function ClustersPage() {
  return (
    <section className="page clusters">
      <div className="model-inner">
        <div className="page-head">
          <div className="page-kicker">/05 · Unsupervised structure</div>
          <h2 className="page-title">Cluster geometry</h2>
          <p className="page-sub">K-Means (k=2) and Bisecting K-Means (k=6) recover the seven subcategories from the feature space. PCA projections show how cleanly the classes separate.</p>
        </div>
        <ChartCard kicker="PCA · 2 components" title="2-D cluster projection" caption="Wallets projected to the top 2 principal components, coloured by assigned cluster.">
          <ChartCluster2D />
        </ChartCard>
        <ChartCard kicker="Cluster signatures" title="Per-cluster feature profiles" caption="Mean feature values per cluster — the behavioural fingerprint that defines each subcategory.">
          <ChartClusterProfiles />
        </ChartCard>
      </div>
    </section>
  );
}
