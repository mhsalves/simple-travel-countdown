import { CountdownConfig, getBackgroundStyle } from './config';
import { getTimeLeft, useNow } from './timeLeft';

const TITLE_PLACEHOLDER = 'Your trip title';

interface CountdownProps {
  config: CountdownConfig;
}

function Countdown({ config }: CountdownProps) {
  const now = useNow();
  const target = new Date(config.finishDate);
  const hasDate = !Number.isNaN(target.getTime());
  const timeLeft = getTimeLeft(hasDate ? target : new Date(now), now);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  let status = '';
  if (!hasDate) {
    status = 'Choose a finish date';
  } else if (timeLeft.finished) {
    status = 'The countdown has finished';
  }

  return (
    <div className="countdown" style={getBackgroundStyle(config.background)}>
      <h2 className="countdown__title" style={{ color: config.titleColor }}>
        {config.title.trim() || TITLE_PLACEHOLDER}
      </h2>
      <div className="countdown__units" style={{ color: config.counterColor }} role="timer" aria-live="off">
        {units.map(({ label, value }) => (
          <div key={label} className="countdown__unit">
            <span className="countdown__value">{String(value).padStart(2, '0')}</span>
            <span className="countdown__label">{label}</span>
          </div>
        ))}
      </div>
      {status && (
        <p className="countdown__status" style={{ color: config.counterColor }}>
          {status}
        </p>
      )}
    </div>
  );
}

export default Countdown;
