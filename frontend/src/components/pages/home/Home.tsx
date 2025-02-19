import { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import parse from 'html-react-parser';

import homeTopHtml from 'customization/html/homeTop.html';
import homeBottomHtml from 'customization/html/homeBottom.html';

import { Layout } from 'components/Layout/Layout';
import { ActivitySearchFilter } from 'components/ActivitySearchFilter';
import { PageHead } from 'components/PageHead';
import { Footer } from 'components/Footer';
import { HomeSection } from './components/HomeSection';
import { HomeContainer } from './Home.style';
import { useHome } from './useHome';
import { BannerWithAsset } from './components/BannerWithAsset';

const HomeUI: FunctionComponent = () => {
  const { config, activitySuggestionCategories } = useHome();

  const contentContainerClassname = `relative ${
    config.activityBar.shouldDisplay ? '-top-6 desktop:-top-15' : 'pt-6 desktop:pt-18'
  }`;

  const intl = useIntl();
  return (
    <>
      <PageHead
        title={intl.formatMessage({ id: 'home.title' })}
        description={intl.formatMessage({ id: 'home.description' })}
      />
      <Layout>
        <HomeContainer>
          <BannerWithAsset
            shouldDisplayText={config.welcomeBanner.shouldDisplayText}
            carouselUrls={config.welcomeBanner.carouselUrls}
            pictureUrl={config.welcomeBanner.pictureUrl}
            videoUrl={config.welcomeBanner.videoUrl}
          />
          <div id="home_content" className={contentContainerClassname}>
            {config.activityBar.shouldDisplay && (
              <div
                className={`desktop:flex desktop:justify-center ${classNameHomeChild}`}
                id="home_activitiesBar"
              >
                <ActivitySearchFilter />
              </div>
            )}
            <div id="home_topHtml" className={classNameHomeChild}>
              {parse(homeTopHtml)}
            </div>
            {activitySuggestionCategories.map(suggestionCategory => (
              <>
                {suggestionCategory.suggestions.length > 0 && (
                  <HomeSection
                    title={intl.formatMessage({ id: suggestionCategory.titleTranslationId })}
                    iconUrl={suggestionCategory.iconUrl}
                    key={suggestionCategory.titleTranslationId}
                    activitySuggestions={suggestionCategory.suggestions}
                  />
                )}
              </>
            ))}
            <div className={classNameHomeChild}>{parse(homeBottomHtml)}</div>
          </div>
        </HomeContainer>
        <Footer />
      </Layout>
    </>
  );
};

const classNameHomeChild = 'mx-4 desktop:mx-10percent mb-6 desktop:mb-18';

export const Home = HomeUI;
