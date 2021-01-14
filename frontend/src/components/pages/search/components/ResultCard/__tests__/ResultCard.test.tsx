import { render } from 'services/testing/reactTestingLibraryWrapper';

import { ResultCard } from '../ResultCard';

test('AAU, I can see a ResultCard', () => {
  const component = render(
    <ResultCard
      place="Saint-Etienne-du-Valdonnez"
      title="Balade au pays des menhirs"
      tags={['En famille', 'Ciel étoilé', 'Beau paysage']}
      thumbnailUri=""
      badgeIconUri=""
      informations={{
        duration: '2h',
        distance: '5km',
        elevation: '+360m',
        difficulty: { label: '', pictogramUri: '' },
        reservationSystem: 1,
      }}
    />,
  );

  expect(component).toMatchSnapshot();
});
