import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    document.querySelectorAll('meta[name="robots"]').forEach((meta) => {
      meta.setAttribute("content", "noindex, follow");
    });
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Страница не найдена | Pressovac</title>
        <meta
          name="description"
          content="Запрашиваемая страница не найдена. Перейдите на главную страницу Pressovac или выберите нужный раздел сайта."
        />
        <meta name="googlebot" content="noindex, follow" />
        <meta name="yandex" content="noindex, follow" />
        <link rel="canonical" href={"https://pressovac-msk.ru" + location.pathname} />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Страница не найдена</p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Вернуться на главную
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
