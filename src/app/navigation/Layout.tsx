import type { ReactNode } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <main className="layout__content">
        {children}
      </main>
      <Navigation />
    </div>
  );
};

export default Layout; 