import { Code2 } from 'lucide-react';

import './Footer.css';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <p className="site-footer__brand">Passion Lens</p>
          <p className="site-footer__copyright">
            © {new Date().getFullYear()} Alexandra. All rights reserved.
          </p>
        </div>

        <a
          className="site-footer__github"
          href="https://github.com/aLe3ouLa"
          target="_blank"
          rel="noreferrer"
          aria-label="Alexandra on GitHub (opens in a new tab)"
        >
          <Code2 aria-hidden="true" size={19} />
          <span>GitHub</span>
        </a>
      </div>
    </footer>
  );
};
