"use client";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import type { LightboxExternalProps } from "yet-another-react-lightbox";

export default function LightboxWrapper(
  props: Omit<LightboxExternalProps, "plugins">
) {
  return <Lightbox {...props} plugins={[Zoom, Thumbnails]} />;
}
