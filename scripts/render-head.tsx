// scripts/render-head.tsx
// SSR-прокладка: рендерит AppContent под StaticRouter, возвращает head-теги из Helmet.
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { StaticRouter } from "react-router-dom/server";
import { AppContent } from "../src/App";

export function renderHead(route: string): string {
  const helmetContext: Record<string, any> = {};

  renderToStaticMarkup(
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
  if (!helmet) return "";

  return [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ]
    .filter(Boolean)
    .join("\n    ");
}
