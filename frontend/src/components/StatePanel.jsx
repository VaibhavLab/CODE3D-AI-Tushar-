import React from 'react';

const formatValue = value => typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);

export default function StatePanel({ currentStep, totalSteps, correctOutput, isAtEnd }) {
  if (!currentStep) return <div className="inspector-empty">Run an example to inspect its state.</div>;
  const { stepNumber, lineNumber, variables = {}, changedVariable, previousValue, condition, explanation } = currentStep;
  return (
    <div className="inspector">
      <header className="inspector-header"><h2>Program state</h2><span>{stepNumber} / {totalSteps}</span></header>
      <div className="inspector-body">
        <div className="inspector-position"><span>Line <strong>{lineNumber}</strong></span><span>{(currentStep.eventType || 'Ready').replaceAll('_', ' ').toLowerCase()}</span></div>
        <section><h3>Variables</h3>
          {Object.keys(variables).length ? <dl className="inspector-variables">
            {Object.entries(variables).map(([name, value]) => <div key={name} className={changedVariable === name ? 'is-changed' : ''}>
              <dt>{name}</dt><dd>
                {changedVariable === name && previousValue != null && <del>{formatValue(previousValue)}</del>}
                <span>{formatValue(value)}</span>
              </dd>
            </div>)}
          </dl> : <p>No variables in scope.</p>}
        </section>
        {condition && <section><h3>Condition <span className={condition.result ? 'condition-true' : 'condition-false'}>{condition.result ? 'True' : 'False'}</span></h3>
          <code>{condition.expression}</code><p>{condition.evaluation}</p>
        </section>}
        {explanation && <section><h3>This step</h3><p>{explanation}</p></section>}
        {isAtEnd && correctOutput && <section><h3>Simulation result</h3><code>{correctOutput}</code></section>}
      </div>
    </div>
  );
}
