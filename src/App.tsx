/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route } from "react-router-dom";
import { FlowEditor } from "./components/FlowEditor";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<FlowEditor />} />
          <Route path="*" element={<FlowEditor />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}

