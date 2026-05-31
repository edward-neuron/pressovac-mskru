import { useEffect, useState } from 'react';

interface HoneypotProps {
  value: string;
  onChange: (v: string) => void;
}

/**
 * Honeypot field — invisible to humans, attractive to bots.
 * Hidden via position: absolute (NOT display:none / type=hidden),
 * so naive bots happily fill it in.
 */
const Honeypot = ({ value, onChange }: HoneypotProps) => (
  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
    <label>
      Website
      <input
        type="text"
        name="website"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        tabIndex={-1}
      />
    </label>
  </div>
);

export default Honeypot;

/**
 * Convenience hook: returns [honeypot, setHoneypot, formOpenedAt].
 * Use isBotSubmission(honeypot, formOpenedAt) to gate handleSubmit.
 */
export const useAntiBot = () => {
  const [honeypot, setHoneypot] = useState('');
  const [formOpenedAt] = useState(() => Date.now());
  // touch effect so the linter doesn't complain in some setups
  useEffect(() => {}, []);
  return { honeypot, setHoneypot, formOpenedAt };
};

export const isBotSubmission = (honeypot: string, formOpenedAt: number): boolean => {
  if (honeypot && honeypot.length > 0) {
    console.log('Bot detected via honeypot');
    return true;
  }
  if (Date.now() - formOpenedAt < 3000) {
    console.log('Bot detected via speed');
    return true;
  }
  return false;
};