// Публичный health-check для мониторинга uptime (UptimeRobot).
// Без авторизации, без обращения к базе — минимальная нагрузка.
Deno.serve(() =>
  new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  })
);
