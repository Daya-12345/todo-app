function Footer() {
  return (
    <footer className="footer" id="footer">
      <p className="footer-text">
        Todo App &copy; {new Date().getFullYear()} &mdash; Built with React &amp; Express.js
      </p>
    </footer>
  );
}

export default Footer;