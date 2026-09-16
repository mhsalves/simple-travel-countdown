import { ChangeEvent, FormEvent, useState } from 'react';
import { buildCountdownLink } from '../countdown/link';

const TITLE_MAX_LENGTH = 60;

type CopyStatus = 'idle' | 'copied' | 'failed';

function toDateTimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function Home() {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState('');
  const [link, setLink] = useState('');
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    setLink('');
  }

  function handleDateTimeChange(event: ChangeEvent<HTMLInputElement>) {
    setDateTime(event.target.value);
    setLink('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const target = new Date(dateTime);

    if (!trimmedTitle) {
      setError('Enter a title for your countdown.');
      return;
    }
    if (Number.isNaN(target.getTime())) {
      setError('Choose the date and time of your trip.');
      return;
    }
    if (target.getTime() <= Date.now()) {
      setError('Choose a date and time in the future.');
      return;
    }

    setError('');
    setCopyStatus('idle');
    setLink(buildCountdownLink({ title: trimmedTitle, date: target }));
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  }

  return (
    <main className="home">
      <header className="home__header">
        <h1>Travel Countdown</h1>
        <p>Create a link that counts down to your next trip and share it with anyone.</p>
      </header>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Trip to Lisbon"
            maxLength={TITLE_MAX_LENGTH}
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="date-time">Date and time</label>
          <input
            id="date-time"
            type="datetime-local"
            min={toDateTimeLocalValue(new Date())}
            value={dateTime}
            onChange={handleDateTimeChange}
          />
        </div>

        <p className="form-error" role="alert">
          {error}
        </p>

        <button type="submit" className="button button--primary">
          Create link
        </button>
      </form>

      {link && (
        <section className="card result" aria-labelledby="result-title">
          <h2 id="result-title">Your countdown link</h2>
          <div className="result__row">
            <input
              aria-label="Countdown link"
              type="text"
              readOnly
              value={link}
              onFocus={(event) => event.target.select()}
            />
            <button type="button" className="button" onClick={handleCopy}>
              {copyStatus === 'copied' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="result__status" aria-live="polite">
            {copyStatus === 'failed' && 'Could not copy automatically. Select the link and copy it manually.'}
          </p>
        </section>
      )}
    </main>
  );
}

export default Home;
