import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Since this file is required to exist, we export a minimal component
// that just passes through children. The actual html and body tags
// are rendered in app/[locale]/layout.tsx
export default function RootLayout({ children }: Props) {
  return children;
}
