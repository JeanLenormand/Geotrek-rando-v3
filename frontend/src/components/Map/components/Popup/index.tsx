import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Popup as LeafletPopup } from 'react-leaflet';
import { FormattedMessage } from 'react-intl';
import Loader from 'react-loader';

import { colorPalette, desktopOnly, getSpacing } from 'stylesheet';
import { textEllipsisAfterNLines } from 'services/cssHelpers';
import { Button as RawButton } from 'components/Button';
import { generateResultDetailsUrl } from 'components/pages/search/utils';
import { generateTouristicContentUrl } from 'components/pages/details/utils';

import Link from 'components/Link';
import { usePopupResult } from '../../hooks/usePopupResult';

interface Props {
  id: number;
  handleOpen: () => void;
  handleClose: () => void;
  type: 'TREK' | 'TOURISTIC_CONTENT';
}

export const Popup: React.FC<Props> = ({ id, handleOpen, handleClose, type }) => {
  const [shouldFetchData, setShouldFetchData] = useState<boolean>(false);
  const { isLoading, trekPopupResult } = usePopupResult(id.toString(), shouldFetchData, type);

  return (
    <StyledPopup
      closeButton={false}
      onOpen={() => {
        setShouldFetchData(true);
        handleOpen();
      }}
      onClose={handleClose}
      offset={[0, -12]}
    >
      <Loader
        loaded={!isLoading}
        options={{
          color: colorPalette.primary1,
        }}
      >
        {trekPopupResult !== undefined && (
          <div className="flex flex-col">
            <CoverImage src={trekPopupResult.imgUrl} />
            <div className="p-4">
              <span className="text-P2 mb-1 text-greyDarkColored hidden desktop:inline">
                {trekPopupResult.place}
              </span>
              <Title className="text-Mobile-C1 text-primary1 font-bold desktop:text-H4">
                {trekPopupResult.title}
              </Title>
              <Link
                href={
                  type === 'TREK'
                    ? generateResultDetailsUrl(id, trekPopupResult.title)
                    : generateTouristicContentUrl(id, trekPopupResult.title)
                }
              >
                <Button type="button">
                  <span className="text-center w-full">
                    <FormattedMessage id="search.map.seeResult" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Loader>
    </StyledPopup>
  );
};

const desktopWidth = 288;
const desktopImgHeight = 122;
const mobileWidth = 215;
const mobileImgHeight = 133;

const Button = styled(RawButton)`
  margin-top: ${getSpacing(4)};
  width: 100%;
  text-align: center;
`;

const Title = styled.span`
  ${textEllipsisAfterNLines(2)}

  ${desktopOnly(css`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
  `)}
`;

const StyledPopup = styled(LeafletPopup)`
  .leaflet-popup-content {
    margin: 0;

    // Show the loader properly
    position: relative;
    min-height: 120px;
    min-width: 120px;
  }

  .leaflet-popup-content-wrapper {
    padding: 0;

    border-radius: ${getSpacing(4)};
    overflow: hidden;

    width: ${mobileWidth}px;
    ${desktopOnly(css`
      width: ${desktopWidth}px;
    `)};
  }

  // Removes native leaflet popup triangle below the content
  // https://stackoverflow.com/a/51457598/14707543
  .leaflet-popup-tip {
    background: rgba(0, 0, 0, 0) !important;
    box-shadow: none !important;
  }
`;

const CoverImage = styled.img`
  height: ${mobileImgHeight}px;
  ${desktopOnly(css`
    height: ${desktopImgHeight}px;
  `)}
  object-fit: cover;
`;
