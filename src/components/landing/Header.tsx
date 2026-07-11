import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          className="site-header__brand"
          to="/"
          aria-label="Passion Lens home"
        >
          <span className="site-header__mark" aria-hidden="true">
            ✦
          </span>
          Passion Lens
        </Link>

        <nav aria-label="Primary navigation">
          <Link className="site-header__action" to="/create-memory">
            Create a memory
            <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
