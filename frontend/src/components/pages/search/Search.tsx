import React from 'react';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import Loader from 'react-loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { colorPalette, getSpacing, sizes, typography, zIndex } from 'stylesheet';

import { Layout } from 'components/Layout/Layout';
import { TouristicContentCategoryMapping } from 'modules/touristicContentCategory/interface';
import { OpenMapButton } from 'components/OpenMapButton';
import {
  MobileFilterMenu,
  MobileFilterSubMenu,
  useFilterMenu,
  useFilterSubMenu,
} from 'components/MobileFilterMenu';

import { PageHead } from 'components/PageHead';
import { FilterState } from 'modules/filters/interface';
import { SearchMapDynamicComponent } from 'components/Map';
import { FilterBar } from './components/FilterBar';
import { ResultCard } from './components/ResultCard';
import { SearchResultsMeta } from './components/SearchResultsMeta';
import { ToggleFilterButton } from './components/ToggleFilterButton';
import { useFilter } from './components/useFilters';
import { useTrekResults } from './hooks/useTrekResults';
import { useMapResults } from './hooks/useMapResults';
import { ErrorFallback } from './components/ErrorFallback';
import { generateResultDetailsUrl, getHoverId } from './utils';
import { generateTouristicContentUrl } from '../details/utils';
import InputWithMagnifier from './components/InputWithMagnifier';
import { useTextFilter } from './hooks/useTextFilter';

interface Props {
  initialFiltersState: FilterState[];
  touristicContentCategoryMapping: TouristicContentCategoryMapping;
  initialFiltersStateWithSelectedOptions: FilterState[];
  language: string;
}

export const SearchUI: React.FC<Props> = ({ language }) => {
  const {
    filtersState,
    setFilterSelectedOptions,
    filterBarExpansionState,
    setFilterBarExpansionState,
    resetFilters,
  } = useFilter();

  const {
    subMenuState,
    selectFilter,
    hideSubMenu,
    currentFilterId,
    currentFilterState,
    selectOption,
    deSelectOption,
  } = useFilterSubMenu(filtersState, setFilterSelectedOptions);

  const { menuState, displayMenu, hideMenu, filtersList, activeFiltersNumber } = useFilterMenu(
    filtersState,
    selectFilter,
  );

  const {
    textFilterInput,
    textFilterState,
    onTextFilterInputChange,
    onTextFilterSubmit,
    resetTextFilter,
  } = useTextFilter();

  const {
    searchResults,
    isLoading,
    isError,
    refetch,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    mobileMapState,
    displayMobileMap,
    hideMobileMap,
  } = useTrekResults({ filtersState, textFilterState }, language);

  const { mapResults, isMapLoading } = useMapResults({ filtersState, textFilterState }, language);

  const intl = useIntl();

  const onRemoveAllFiltersClick = () => {
    resetFilters();
    resetTextFilter();
  };

  return (
    <div id="Search">
      <PageHead
        title={`${intl.formatMessage({ id: 'search.title' })} - ${intl.formatMessage({
          id: 'home.title',
        })}`}
      />
      <MobileFilterMenu
        menuState={menuState}
        handleClose={hideMenu}
        title={<FormattedMessage id="search.filter" />}
        filtersList={filtersList}
        closeMenu={hideMenu}
        resetFilter={onRemoveAllFiltersClick}
      />
      <MobileFilterSubMenu
        menuState={subMenuState}
        handleClose={hideSubMenu}
        filterId={currentFilterId}
        closeMenu={hideSubMenu}
        filterState={currentFilterState}
        selectOption={selectOption}
        deSelectOption={deSelectOption}
      />
      <Layout>
        <Container className="flex flex-col">
          <FilterBar
            filtersState={filtersState}
            setFilterSelectedOptions={setFilterSelectedOptions}
            filterBarExpansionState={filterBarExpansionState}
            setFilterBarExpansionState={setFilterBarExpansionState}
            resetFilters={onRemoveAllFiltersClick}
          />
          <div className="flex flex-row flex-1 overflow-y-hidden">
            <div
              id="search_resultCardList"
              className="flex flex-col w-full desktop:w-1/2 overflow-y-scroll"
            >
              <div className="p-4 flex-1">
                <Loader
                  loaded={!isLoading}
                  options={{
                    top: '40px',
                    color: colorPalette.primary1,
                    zIndex: zIndex.loader,
                    position: 'relative',
                  }}
                >
                  <div className="flex flex-col desktop:flex-row desktop:justify-between">
                    <div className="flex justify-between items-end" id="search_resultMapTitle">
                      <SearchResultsMeta resultsNumber={searchResults?.resultsNumber ?? 0} />
                      <ToggleFilterButton
                        onClick={displayMenu}
                        activeFiltersNumber={activeFiltersNumber}
                      />
                    </div>
                    <div className="flex items-center mt-4 desktop:mt-0 desktop:ml-5">
                      <InputWithMagnifier
                        value={textFilterInput}
                        onChange={onTextFilterInputChange}
                        onButtonClick={onTextFilterSubmit}
                      />
                    </div>
                  </div>

                  <Separator className="w-full mt-6 desktop:block hidden" />

                  <OpenMapButton displayMap={displayMobileMap} />

                  <InfiniteScroll
                    dataLength={searchResults?.results.length ?? 0}
                    next={fetchNextPage}
                    hasMore={hasNextPage ?? false}
                    loader={
                      <div className={` my-10 ${isFetchingNextPage ? 'h-10' : ''}`}>
                        <Loader
                          loaded={!isFetchingNextPage}
                          options={{
                            color: colorPalette.primary1,
                            zIndex: zIndex.loader,
                          }}
                        ></Loader>
                      </div>
                    }
                    scrollableTarget="search_resultCardList"
                  >
                    {searchResults?.results.map(searchResult =>
                      searchResult.type === 'TREK' ? (
                        <ResultCard
                          type={searchResult.type}
                          key={searchResult.title}
                          id={`${searchResult.id}`}
                          hoverId={getHoverId(searchResult)}
                          place={searchResult.place}
                          title={searchResult.title}
                          tags={searchResult.tags}
                          thumbnailUris={searchResult.thumbnailUris}
                          badgeIconUri={searchResult.practice?.pictogram}
                          informations={searchResult.informations}
                          redirectionUrl={generateResultDetailsUrl(
                            searchResult.id,
                            searchResult.title,
                          )}
                          className="my-4 desktop:my-6 desktop:mx-1" // Height is not limited to let the card grow with long text & informations. Most photos are not vertical, and does not have to be restrained.
                        />
                      ) : (
                        <ResultCard
                          type={searchResult.type}
                          key={searchResult.name}
                          id={`${searchResult.id}`}
                          hoverId={getHoverId(searchResult)}
                          place={searchResult.place}
                          title={searchResult.name}
                          tags={searchResult.themes}
                          thumbnailUris={searchResult.thumbnailUris}
                          badgeIconUri={searchResult.category.pictogramUri}
                          informations={searchResult.types}
                          redirectionUrl={generateTouristicContentUrl(
                            searchResult.id,
                            searchResult.name,
                          )}
                          className="my-4 desktop:my-6 desktop:mx-1 desktop:max-h-50" // Height is limited in desktop to restrain vertical images ; not limiting with short text & informations
                        />
                      ),
                    )}
                  </InfiniteScroll>
                  {isError && (
                    <ErrorFallback refetch={searchResults === null ? refetch : fetchNextPage} />
                  )}
                </Loader>
              </div>
            </div>

            <div
              className="hidden desktop:flex desktop:z-content desktop:w-1/2 desktop:fixed desktop:right-0 desktop:bottom-0 desktop:top-headerAndFilterBar"
              id="search_resultMap"
            >
              {isMapLoading && (
                <div
                  className="absolute bg-primary2 opacity-40 w-full h-full"
                  style={{ zIndex: 2000 }}
                />
              )}
              <Loader
                loaded={!isMapLoading}
                options={{
                  color: colorPalette.primary1,
                  zIndex: 2500,
                  scale: 2,
                }}
              />
              <SearchMapDynamicComponent
                points={mapResults}
                type="DESKTOP"
                shouldUseClusters
                shouldUsePopups
              />
            </div>
          </div>
        </Container>
      </Layout>
      <MobileMapContainer
        className={`desktop:hidden fixed right-0 left-0 h-full z-map ${
          mobileMapState === 'HIDDEN' ? 'hidden' : 'flex'
        }`}
        displayState={mobileMapState}
      >
        <SearchMapDynamicComponent
          hideMap={hideMobileMap}
          type="MOBILE"
          points={mapResults}
          openFilterMenu={displayMenu}
          hasFilters={activeFiltersNumber > 0}
          shouldUseClusters
          shouldUsePopups
        />
      </MobileMapContainer>
    </div>
  );
};

const Container = styled.div`
  height: calc(100vh - ${sizes.desktopHeader}px);
`;

const Separator = styled.hr`
  background-color: ${colorPalette.greySoft};
  height: 1px;
  border: 0;
`;

const RankingInfo = styled.div`
  ${typography.small}
  margin-top: ${getSpacing(1)};
`;

export const MobileMapContainer = styled.div<{ displayState: 'DISPLAYED' | 'HIDDEN' }>`
  transition: top 0.3s ease-in-out 0.1s;
  top: ${({ displayState }) => (displayState === 'DISPLAYED' ? 0 : 100)}%;
`;
