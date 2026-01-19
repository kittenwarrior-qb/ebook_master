export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container mx-auto py-4 md:py-6 px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-3 md:gap-4 md:flex-row">
          <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Ebook Master. All rights reserved.
          </p>
          <div className="flex gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              About
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
