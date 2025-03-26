import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>
        GitHub Explorer
      </Link>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#222',
    padding: '10px 20px',
    color: '#fff',
    textAlign: 'left' as const,
  },
  logo: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
  },
};

export default Header;
