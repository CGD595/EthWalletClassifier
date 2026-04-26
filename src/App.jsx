import { useState } from 'react';
import Nav           from './components/Nav';
import Footer        from './components/Footer';
import HeroPage      from './components/pages/HeroPage';
import ClassifierPage from './components/pages/ClassifierPage';
import ModelPage     from './components/pages/ModelPage';
import DataPage      from './components/pages/DataPage';
import ClustersPage  from './components/pages/ClustersPage';
import GuidePage     from './components/pages/GuidePage';

export default function App() {
  const [page, setPage] = useState('hero');
  return (
    <div className="app">
      <Nav page={page} setPage={setPage} />
      <main className="main">
        {page === 'hero'       && <HeroPage      setPage={setPage} />}
        {page === 'classifier' && <ClassifierPage />}
        {page === 'model'      && <ModelPage     />}
        {page === 'data'       && <DataPage      />}
        {page === 'clusters'   && <ClustersPage  />}
        {page === 'guide'      && <GuidePage     />}
      </main>
      <Footer />
    </div>
  );
}
