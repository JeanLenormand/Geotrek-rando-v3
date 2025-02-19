import { Attachment } from 'modules/interface';
import { LargeCarousel } from 'components/Carousel';

interface DetailsCoverCarouselProps {
  attachments: Attachment[];
}

export const DetailsCoverCarousel: React.FC<DetailsCoverCarouselProps> = ({ attachments }) => {
  return (
    <LargeCarousel className="relative h-coverDetailsMobile desktop:h-coverDetailsDesktop">
      {attachments.map((attachment, i) => (
        <ImageWithLegend attachment={attachment} key={i} />
      ))}
    </LargeCarousel>
  );
};

interface ImageWithLegendProps {
  attachment: Attachment;
}

export const ImageWithLegend: React.FC<ImageWithLegendProps> = ({ attachment }) => (
  <div id="details_cover_image" className="relative">
    <Legend author={attachment.author} legend={attachment.legend} />
    <img
      src={attachment.url}
      className="object-cover object-top overflow-hidden h-coverDetailsMobile desktop:h-coverDetailsDesktop w-full"
    />
  </div>
);

interface LegendProps {
  author: string;
  legend: string;
}

const Legend: React.FC<LegendProps> = ({ author, legend }) => {
  const hasLegendOrAuthor =
    (legend !== null && legend.length > 0) || (author !== null && author.length > 0);
  const hasLegendAndAuthor =
    legend !== null && legend.length > 0 && author !== null && author.length > 0;
  const fullText = `${legend}${hasLegendAndAuthor ? ' - ' : ''}${author}`;
  if (hasLegendOrAuthor) {
    return (
      hasLegendOrAuthor && (
        <div
          className={`w-full h-12 desktop:h-40
          absolute bottom-0 desktop:top-0 flex items-end desktop:items-start justify-center
          py-1 px-2 desktop:pt-3 desktop:px-10
          bg-gradient-to-t desktop:bg-gradient-to-b from-blackSemiOpaque desktop:from-blackSemiTransparent to-transparent
          text-white text-opacity-90 text-Mobile-C3 desktop:text-P2`}
        >
          <span className="mx-15 truncate">{fullText}</span>
        </div>
      )
    );
  }
  return null;
};
