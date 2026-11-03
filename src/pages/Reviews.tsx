import { ExternalLink, ChevronDown } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';

type Review = {
  author: string;
  date: string;
  source: string;
  sourceUrl: string;
  preview: string;
  text: string;
};

const reviewsBannerUrl: string | null = null;

const reviews: Review[] = [
  {
    "author": "Елена К.",
    "date": "18 сентября 2019",
    "source": "Яндекс Карты",
    "sourceUrl": "https://yandex.com/maps/org/vecont_m/211975092839/reviews/",
    "preview": "Мы уже больше 2 лет и, особенно последний год, рассматривали проект по открытию бизнеса очистки вентиляции на Юге России...",
    "text": "Мы уже больше 2 лет и, особенно последний год, рассматривали проект по открытию бизнеса очистки вентиляции на Юге России (Ростовская область). Думали, искали, мониторили Рынок, считали, взвешивали. Обзвонили много поставщиков, среди которых и российский производитель Пробат. Много чего посмотрели и не посмотрели. Звонили всем, но встретиться удалось только с фирмой Веконт-М (финское оборудование Pressovac), потому что все оборудование представлено в офисе, можно потрогать и посмотреть как все работает. Высокий уровень квалифицированных консультантов. С аналогичными поставщиками не получилось, то офиса нет, то оборудование посмотреть нельзя, встречи назначаются в каком-то гаражном Боксе или, в лучшем случае, в Макдональдс. Более адекватных и профессиональных по этой теме найти не удалось, кроме фирмы Веконт-М. Серьезная компания, серьезный подход, в интернет-магазине представлено все, что необходимо и, главное, актуальные цены в рублях. В результате, все согласовали и приобрели. Теперь работаем и очень довольны результатом, включая положительные отзывы наших клиентов. Спасибо компании."
  },
  {
    "author": "Елена Н. · Эко-Сибирь",
    "date": "16 декабря 2019",
    "source": "Яндекс Карты",
    "sourceUrl": "https://yandex.com/maps/org/vecont_m/211975092839/reviews/",
    "preview": "Компания Эко-Сибирь, работает с компанией Веконт-М с 2017 года. За период сотрудничества Веконт-М было поставлено два оборудования комплексной очистки...",
    "text": "Компания Эко-Сибирь, работает с компанией Веконт-М с 2017 года. За период сотрудничества Веконт-М было поставлено два оборудования комплексной очистки системы вентиляции Pressovak. Оборудование эксплуатируется на производствах, в общепите, школьных и других учреждениях практически круглосуточно, по большей части без монтажа системы вентиляции. Компания Веконт-М ответственно подходит к своему делу, умеет верно находить правильные решения для клиента, имеет квалифицированную службу менеджеров работают 24 часа в оперативном режиме. Благодарим Веконт-М и Эдуарда Сулейманова за качественную работу и поставленное оборудование и считаем, возможным рекомендовать Веконт-М как надежного партнера подборки, поставки оборудования для очистки системы вентиляции."
  },
  {
    "author": "Олег",
    "date": "23 февраля 2021",
    "source": "Яндекс Карты",
    "sourceUrl": "https://yandex.com/maps/org/vekont_m/211975092839/reviews/?ll=99.505405%2C-3.537040&utm_source=review&z=2",
    "preview": "С компанией Веконт-М сотрудничаем много лет. Оборудования лучше представляемого этой компанией не найти, качественное и...",
    "text": "С компанией Веконт-М сотрудничаем много лет. Оборудования лучше представляемого этой компанией не найти, качественное и долговечное, проверено. Менеджеры компании работают на высшем уровне, отдельная благодарность Эдуарду, всегда всё детально объяснит, ничего лишнего."
  },
  {
    "author": "andry.tihon77",
    "date": "2 ноября 2021, изменён",
    "source": "Flamp · отзыв в карточке 2GIS",
    "sourceUrl": "https://flamp.ru/r/4504127918197850/7263327",
    "preview": "Долго искали поставщика оборудование. Вышли на финское оборудование Pressovac, встретились, обсудили и сделали заказ...",
    "text": "Долго искали поставщика оборудование. Вышли на финское оборудование Pressovac, встретились, обсудили и сделали заказ. Оборудование действительно профессиональное, консультации и поддержка на высоком уровне. Кроме обучения предоставили Обучающий диск и готовый Бизнес-план. Много благодарностей компании, особенно Эдуарду (Консультант). Очень довольны, надеемся, что скоро вернемся за вторым комплектом."
  },
  {
    "author": "Сергей Николаевич Таманцев",
    "date": "30 октября 2021",
    "source": "2GIS",
    "sourceUrl": "https://2gis.ru/moscow/firm/4504127918197850/tab/reviews",
    "preview": "Приобрели универсальное оборудование Pressovac с комплектом инструментов и аксессуаров для очистки вентиляции. Долго выбирали...",
    "text": "Приобрели универсальное оборудование Pressovac с комплектом инструментов и аксессуаров для очистки вентиляции. Долго выбирали, что подойдет по цене и качеству. Цена совсем не маленькая, но приемлема, потому что в нашем основном направлении по клинингу, канализации и алмазной резке, мы используем только профессиональное. Пытались обратиться к российскому производителю Пробат, цены конечно привлекательные, но ассортимент скудный и для очень узких задач. Выбор российского был исключен сразу потому что нет доверия ни по качеству, ни по работоспособности. Выбрали финское оборудование Прессовак. Что особенно приятно - это большой объем учебных материалов, специальная программа оценки и расчета. Даже не ожидали, что все так будет. Полный респект."
  },
  {
    "author": "aleshina-toma",
    "date": "26 ноября 2015",
    "source": "Flamp · отзыв в карточке 2GIS",
    "sourceUrl": "https://flamp.ru/r/4504127918197850/1660586",
    "preview": "Сайт и компания Веконьт-М в целом проверены ни одним годом сотрудничества и отзывами других клиентов. Есть собственный опыт общения...",
    "text": "Сайт и компания Веконьт-М в целом проверены ни одним годом сотрудничества и отзывами других клиентов. Есть собственный опыт общения. Оперативность, четкость принятия решений, профессионализм, надежный партнер в подборе, поставке оборудования для выполнения сложных самых задач. Оборудование работает 24 часа в сутки, а не ломается и выходит из строя как у некоторых. Не просто продают оборудование (лишь бы отдать), а еще передают все навыки и готовые решения для бизнеса. Поддержка на протяжении всего срока эксплуатации. Не забывают о клиентах и всегда доступны для общения (даже в неудобное время). В общем, оценка 5+. Даже программу для расчета очистки и ведения бизнеса предоставляют абсолютно бесплатно."
  }
];

const reviewsBreadcrumbs = [
  { name: 'Главная', url: '/' },
  { name: 'Отзывы', url: '/reviews' },
];

const Reviews = () => (
  <Layout>
    <SEOHead
      title="Отзывы клиентов о Веконт-М и оборудовании Pressovac"
      description="Отзывы клиентов о выборе оборудования Pressovac, консультациях, обучении и поддержке компании Веконт-М."
      keywords="отзывы Веконт-М, отзывы Pressovac, оборудование Pressovac, очистка вентиляции"
      canonical="/reviews"
      breadcrumbs={reviewsBreadcrumbs}
    />

    <section className="relative overflow-hidden bg-gradient-to-r from-primary to-accent pt-20" aria-label="Отзывы клиентов">
      {reviewsBannerUrl && (
        <>
          <img
            src={reviewsBannerUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/60" />
        </>
      )}
      <div className="container-custom relative py-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/80">Отзывы</p>
        <h1 className="font-display text-3xl font-bold text-white md:text-5xl">
          Отзывы клиентов
        </h1>
        <p className="mt-5 max-w-3xl leading-relaxed text-white/90">
          Подборка отзывов, опубликованных клиентами на Яндекс Картах, в 2GIS и на Flamp.
          Отзывы рассказывают об опыте выбора и покупки оборудования Pressovac,
          консультациях, обучении и поддержке компании Веконт-М.
        </p>
      </div>
    </section>

    <section className="section-padding pt-4">
      <div className="container-custom">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.author + review.date} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">{review.author}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{review.date}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {review.source}
                </span>
              </header>

              <details className="group">
                <summary className="list-none cursor-pointer rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                  <p className="leading-relaxed text-foreground">{review.preview}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Читать отзыв полностью
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </span>
                </summary>
                <blockquote className="mt-4 border-t border-border pt-4 leading-relaxed text-foreground">
                  {review.text}
                </blockquote>
              </details>

              <a
                href={review.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
              >
                Открыть источник
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Reviews;
