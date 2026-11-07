// scripts/render-head.tsx
// SSR-прокладка: рендерит AppContent под StaticRouter, возвращает head-теги из Helmet.
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as helmetAsync from "react-helmet-async";
import { StaticRouter } from "react-router-dom/server";
import { AppContent } from "../src/App";

const HelmetProvider =
  helmetAsync.HelmetProvider ?? (helmetAsync as any).default?.HelmetProvider;

export function renderPage(route: string): { head: string; body: string } {
  const helmetContext: Record<string, any> = {};

  const body = renderToStaticMarkup(
    React.createElement(
      HelmetProvider,
      { context: helmetContext },
      React.createElement(
        StaticRouter,
        { location: route },
        React.createElement(AppContent)
      )
    )
  );

  const { helmet } = helmetContext as any;
  const head = helmet
    ? [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ]
        .filter(Boolean)
        .join("\n    ")
    : "";

  return { head, body };
}
