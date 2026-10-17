import { AppNav } from "@/components/AppNav";
import { SiteFooter } from "@/components/SiteFooter";

type PageShellProps = {
  children: React.ReactNode;
  email?: string | null;
  social?: Array<{ platform?: string; url?: string }>;
};

export function PageShell({ children, email, social }: PageShellProps) {
  return (
    <div className="site-page">
      <AppNav />
      <div className="flex-1">{children}</div>
      <SiteFooter email={email} social={social} />
    </div>
  );
}
