import type { Metadata } from "next";

// This layout provides default metadata for all public pages
// Individual pages can override this if needed
export const metadata: Metadata = {
  title: 'View Menu',
  description: 'View our digital menu with real-time updates. Browse our delicious offerings.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

