import { Link } from "react-router-dom";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="border-t border-border bg-secondary/30">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link to="/" className="font-bold tracking-tight text-lg">Yannabathula Varshith Reddy</Link>
            <p className="mt-4 text-muted-foreground max-w-xs">
              B.Tech Computer Science student at Lovely Professional University — data analytics, machine
              learning and full-stack development.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <nav className="flex flex-col gap-3">
              <a href="/#projects" className="text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </a>
              <a href="/#skills" className="text-muted-foreground hover:text-foreground transition-colors">
                Skills
              </a>
              <a href="/#certificates" className="text-muted-foreground hover:text-foreground transition-colors">
                Certificates
              </a>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex flex-col gap-3 text-muted-foreground">
              <a href="mailto:yannabathulavarshithreddy7@gmail.com" className="hover:text-foreground transition-colors">
                yannabathulavarshithreddy7@gmail.com
              </a>
              <a href="tel:+919177275881" className="hover:text-foreground transition-colors">+91 91772 75881</a>
              <a href="https://github.com/varshith1369" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/varshithreddy07/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Yannabathula Varshith Reddy. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Phagwara, Punjab, India
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;
