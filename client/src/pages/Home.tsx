import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Countdown from '../countdown/Countdown';
import CountdownForm from '../countdown/CountdownForm';
import { createDefaultConfig } from '../countdown/config';

function Home() {
  const [config, setConfig] = useState(createDefaultConfig);

  return (
    <div className="page">
      <Header />
      <main className="container home">
        <section className="home__form" aria-labelledby="form-title">
          <h1 id="form-title" className="section-title">
            Create your countdown
          </h1>
          <CountdownForm config={config} onChange={setConfig} />
        </section>
        <section className="home__preview" aria-labelledby="preview-title">
          <h2 id="preview-title" className="section-title">
            Preview
          </h2>
          <Countdown config={config} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
