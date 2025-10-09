import React from 'react';

type Props = {
  value: string;
  onChange: (lang: string) => void;
  id?: string;
};

export const LanguageSelector: React.FC<Props> = ({ value, onChange, id }) => {
  return (
    <label className="flex items-center gap-2" htmlFor={id ?? 'language-select'}>
      <span className="sr-only">Editor language</span>
      <select
        id={id ?? 'language-select'}
        aria-label="Editor language"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border px-2 py-1 text-sm"
      >
        <option value="en">English</option>
        <option value="zh-CN">中文（简体）</option>
        <option value="zh-TW">中文（繁體）</option>
      </select>
    </label>
  );
};

export default LanguageSelector;
