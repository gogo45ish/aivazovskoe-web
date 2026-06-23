import type { OfferBlock } from "@/types";
import HeadingBlock from "./HeadingBlock";
import RichTextBlock from "./RichTextBlock";
import ImageBlock from "./ImageBlock";
import GalleryBlock from "./GalleryBlock";
import CardGridBlock from "./CardGridBlock";
import CarouselBlock from "./CarouselBlock";
import CtaButtonBlock from "./CtaButtonBlock";

// Block renderer for an offer's dynamic-zone body. Maps each Strapi component
// (`__component`) to its React component. Unknown types are skipped, not crashed —
// so adding a new block in Strapi before wiring it here degrades gracefully.
export default function OfferBlocks({ blocks }: { blocks: OfferBlock[] }) {
  return (
    <div className="space-y-12 md:space-y-16">
      {blocks.map((block) => {
        switch (block.__component) {
          case "offer-blocks.heading":
            return <HeadingBlock key={block.id} block={block} />;
          case "offer-blocks.rich-text":
            return <RichTextBlock key={block.id} block={block} />;
          case "offer-blocks.image":
            return <ImageBlock key={block.id} block={block} />;
          case "offer-blocks.gallery":
            return <GalleryBlock key={block.id} block={block} />;
          case "offer-blocks.card-grid":
            return <CardGridBlock key={block.id} block={block} />;
          case "offer-blocks.carousel":
            return <CarouselBlock key={block.id} block={block} />;
          case "offer-blocks.cta-button":
            return <CtaButtonBlock key={block.id} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
