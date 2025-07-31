// frontend/src/components/EmailItem.jsx
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import PriorityControl from './PriorityControl';
import UrgencyControl from './UrgencyControl';

export default function EmailItem({ email }) {
  const [showPriority, setShowPriority] = useState(false);
  const [showUrgency, setShowUrgency] = useState(false);
  const ctx = useContext(AppContext);
  if (!ctx) {
    console.error('EmailItem must be rendered inside <AppProvider>');
    return null;
  }
  const { setUrgencyCutoff, saveRules, dynamicRules } = ctx;

  // Handlers
  const onPriorityClick = () => setShowPriority(!showPriority);
  const onUrgencyClick  = () => setShowUrgency(!showUrgency);

  const applyRule = (newRule) => {
    const updated = [...dynamicRules.filter(r => r.criterion !== newRule.criterion), newRule];
    saveRules(updated);
  };

  const provider = email.service === 'gmail' ? 'Gmail' : 'Outlook';

  return (
    <li className="email-item">
      <div className="icons">
        <span onClick={onUrgencyClick} className="icon stopwatch">⏱️</span>
        <span onClick={onPriorityClick} className="icon exclaim">❗</span>
      </div>
      <div className="content" onClick={() => window.open(email.webLink, '_blank')}>
        <h4>{email.subject}</h4>
        <p>{email.snippet || email.body?.substring(0, 100)}</p>
      </div>

      { showPriority && (
        <PriorityControl
          provider={provider}
          email={email}
          onChange={rule => applyRule(rule)}
        />
      )}
      { showUrgency && (
        <UrgencyControl
          current={email.urgencyScore}
          onChange={val => setUrgencyCutoff(val)}
        />
      )}
    </li>
  );
}