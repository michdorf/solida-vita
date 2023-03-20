// @refresh reload
import { Routes } from "@solidjs/router";
import { Suspense } from "solid-js";
import {
  Body,
  FileRoutes,
  Head,
  Html,
  Meta,
  Scripts,
  Title,
} from "solid-start";
import { ErrorBoundary } from "solid-start/error-boundary";
import 'tributejs/dist/tribute.css';

// <script type="text/javascript" src="/dist.js"></script>
export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart - With Vitest</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <script type="text/javascript" src="/mrypt.js"></script>
        <Scripts />
      </Body>
    </Html>
  );
}
