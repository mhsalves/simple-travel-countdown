import Brand from './Brand';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__content">
        <Brand size={24} />
        <p>
          Developed by Matheus Alves · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
