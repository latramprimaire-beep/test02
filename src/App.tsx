/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FlowEditor } from "./components/FlowEditor";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <FlowEditor />
    </ErrorBoundary>
  );
}

