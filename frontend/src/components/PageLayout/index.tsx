import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { Suspense } from 'react';

export default function PageLayout() {
  return (
    <>
      <Header className="fixed left-0 top-0 w-full" />
      <div className="flex min-h-screen flex-col justify-between">
        <div className="mt-16">
          <Suspense fallback={<div></div>}>
            <Outlet />
          </Suspense>
        </div>
        <Footer className="mt-24" />
      </div>
    </>
  );
}
