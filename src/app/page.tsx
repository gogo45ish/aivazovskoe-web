import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Rooms from "@/components/Rooms";
import Offers from "@/components/Offers";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import Booking from "@/components/Booking";
import Location from "@/components/Location";
import Footer from "@/components/Footer";
import ParallaxBand from "@/components/ui/ParallaxBand";
import JsonLd from "@/components/JsonLd";
import { lodgingBusinessLd } from "@/lib/seo";

import {
  getRooms,
  getOffers,
  getReviewHighlights,
  getSiteSettings,
  getHomeHero,
} from "@/lib/strapi";
import { lifeGallery } from "@/data/gallery";
import { unsplashUrl } from "@/data/media";

export const revalidate = 60;

export default async function Home() {
  const [hero, rooms, offers, reviewHighlights, { settings, reviewAggregate }] =
    await Promise.all([
      getHomeHero(),
      getRooms(),
      getOffers(),
      getReviewHighlights(),
      getSiteSettings(),
    ]);

  return (
    <>
      <JsonLd data={lodgingBusinessLd(settings, reviewAggregate)} />
      <Nav />
      <Hero hero={hero} />
      <About aboutImage={settings.aboutImage} />

      <ParallaxBand
        src={unsplashUrl("photo-1507525428034-b723cf961d3e")}
        alt="Берег Чёрного моря"
        eyebrow="900 метров пляжа"
        title="Чёрное море — в нескольких шагах от номера"
        // Dev placeholder stock video — replace with self-hosted/S3 mp4 before launch
        videoSrc="https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_30fps.mp4"
      />

      <Gallery images={lifeGallery} />
      <Rooms rooms={rooms} />

      <ParallaxBand
        src={unsplashUrl("photo-1441974231531-c6227db76b6e")}
        alt="Реликтовый парк"
        eyebrow="24 гектара парка"
        title="Реликтовая роща, тишина и тень вековых деревьев"
        // Dev placeholder stock video — replace with self-hosted/S3 mp4 before launch
        videoSrc="https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4"
      />

      <Offers offers={offers} />
      <Reviews highlights={reviewHighlights} aggregate={reviewAggregate} />
      <Booking />
      <Location settings={settings} />
      <Footer settings={settings} />
    </>
  );
}
