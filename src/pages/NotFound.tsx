import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0C1330] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="vok-headline text-6xl md:text-8xl tracking-[-4.52px] mb-4">404</h1>
        <p className="vok-body mb-8">This page doesn&apos;t exist.</p>
        <Link to="/" className="btn-primary inline-flex">
          BACK TO HOME
          <i className="ri-arrow-right-line ml-2" />
        </Link>
      </div>
    </div>
  );
}