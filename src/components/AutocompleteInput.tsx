import { useId, useMemo, useState } from 'react';
import { normalizeText, SPANISH_ALIASES } from '../data/aliases';
import { canonicalName } from '../lib/dex';

interface AutocompleteInputProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
}

export function AutocompleteInput({
  label,
  value,
  options,
  onChange,
  placeholder,
  invalid = false,
}: AutocompleteInputProps) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const normalizedValue = normalizeText(value);

  const suggestions = useMemo(() => {
    if (!normalizedValue) return [];

    const startsWith: string[] = [];
    const includes: string[] = [];

    for (const option of options) {
      const normalizedOption = normalizeText(option);
      if (normalizedOption.startsWith(normalizedValue)) startsWith.push(option);
      else if (normalizedOption.includes(normalizedValue)) includes.push(option);
      if (startsWith.length >= 12) break;
    }

    const aliasMatches = Object.entries(SPANISH_ALIASES)
      .filter(([alias]) => alias.startsWith(normalizedValue) || alias.includes(normalizedValue))
      .map(([, canonical]) => canonical)
      .filter((canonical) => options.some((option) => normalizeText(option) === normalizeText(canonical)));

    return [...new Set([...aliasMatches, ...startsWith, ...includes])].slice(0, 12);
  }, [normalizedValue, options]);

  const commit = (nextValue: string) => {
    onChange(canonicalName(nextValue, options));
    setOpen(false);
  };

  return (
    <div className="autocomplete">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        className={invalid ? 'invalid' : undefined}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => {
            commit(value);
          }, 120);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commit(suggestions[0] ?? value);
          }
          if (event.key === 'Escape') setOpen(false);
        }}
      />
      {open && suggestions.length > 0 && (
        <div className="suggestions" role="listbox">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              role="option"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => commit(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
