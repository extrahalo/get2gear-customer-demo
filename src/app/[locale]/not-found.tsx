import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="section-label">404 / Get2Gear</p>
      <h1>Page not found</h1>
      <Link className="button button--primary" href="/">
        Return home
      </Link>
    </main>
  );
}
