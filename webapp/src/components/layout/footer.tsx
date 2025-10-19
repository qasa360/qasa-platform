import { APP_NAME, APP_VERSION } from '@/lib/constants';

/**
 * Application footer with copyright and version info
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container flex h-14 items-center justify-between text-sm text-muted-foreground">
        <p>
          © {currentYear} {APP_NAME}. Todos los derechos reservados.
        </p>
        <p>Versión {APP_VERSION}</p>
      </div>
    </footer>
  );
}
