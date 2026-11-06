import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import { ROUTES } from './routePaths.js'
import NotFoundPage from './NotFoundPage.jsx'
import AuthorPage from '../features/author/pages/AuthorPage.jsx'
import LaboratoryPage from '../features/laboratory/pages/LaboratoryPage.jsx'
import CaseFilesPage from '../features/case-files/pages/CaseFilesPage.jsx'
import CaseFileDetailPage from '../features/case-files/pages/CaseFileDetailPage.jsx'
import ChroniclesPage from '../features/chronicles/pages/ChroniclesPage.jsx'
import CorrespondencePage from '../features/correspondence/pages/CorrespondencePage.jsx'

const LibraryPage = lazy(() => import('../features/library/pages/LibraryPage.jsx'))

/**
 * Route table.
 *
 * The homepage and the full-page Case Files experience sit outside the
 * shared Layout. Other archive sections keep the shared shell.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <Suspense fallback={<div className="library-route-loading" aria-hidden="true" />}>
            <LibraryPage />
          </Suspense>
        }
      />

      <Route path={ROUTES.caseFiles} element={<CaseFilesPage />} />
      <Route path={ROUTES.caseFilePattern} element={<CaseFileDetailPage />} />

      <Route element={<Layout />}>
        <Route path={ROUTES.author} element={<AuthorPage />} />
        <Route path={ROUTES.laboratory} element={<LaboratoryPage />} />
        <Route path={ROUTES.chronicles} element={<ChroniclesPage />} />
        <Route path={ROUTES.correspondence} element={<CorrespondencePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
