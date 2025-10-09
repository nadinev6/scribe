import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSelector from '../LanguageSelector';

describe('LanguageSelector', () => {
  it('renders and changes value', async () => {
    const user = userEvent.setup();
    let value = 'en';
    const handleChange = (lang: string) => {
      value = lang;
    };

    render(<LanguageSelector value={value} onChange={handleChange} />);

    const select = screen.getByLabelText(/editor language/i) as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.value).toBe('en');

    await user.selectOptions(select, 'zh-CN');
    expect(value).toBe('zh-CN');
  });
});
