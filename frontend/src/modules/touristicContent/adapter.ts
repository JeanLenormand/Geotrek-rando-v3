import { TouristicContentCategoryDictionnary } from 'modules/touristicContentCategory/interface';
import { getThumbnail } from 'modules/utils/adapter';
import { RawTouristicContent, TouristicContent } from './interface';

const fallbackImgUri = 'https://upload.wikimedia.org/wikipedia/fr/d/df/Logo_ecrins.png'; // TODO to put in configuration file

export const adaptTouristicContent = ({
  rawTouristicContent,
  touristicContentCategories,
}: {
  rawTouristicContent: RawTouristicContent[];
  touristicContentCategories: TouristicContentCategoryDictionnary;
}): TouristicContent[] =>
  rawTouristicContent.map(rawTouristicObject => ({
    name: rawTouristicObject.name,
    description: rawTouristicObject.description_teaser,
    thumbnailUri: getThumbnail(rawTouristicObject.attachments) ?? fallbackImgUri,
    category: touristicContentCategories[rawTouristicObject.category],
  }));
