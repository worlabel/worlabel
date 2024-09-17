import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { Suspense } from 'react';

export default function PageLayout() {
  return (
    <>
      <Header className="fixed left-0 top-0 w-full" />
      <div className="flex min-h-screen flex-col justify-between">
        <div className="mt-16 flex flex-1">
          <Suspense fallback={<div></div>}>
            <main className="grow">
              <Outlet />
            </main>
          </Suspense>
        </div>
        <Footer className="mt-0" />
      </div>
    </>
  );
}
