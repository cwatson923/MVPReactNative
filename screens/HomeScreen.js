import React from 'react';
import { ScrollView } from 'react-native';
import { withNavigation } from 'react-navigation';
import useQuery from '../hooks/useQuery';
import topPlayersQuery from '../queries/topPlayers';

import LoadingScreen from './LoadingScreen';
import HeaderLg from '../components/HeaderLarge';
import ColorHeading from '../components/ColorHeading';
import GrayHeading from '../components/GrayHeading';
import Player from '../components/Player';
import BgImage from '../components/backgroundImage';

function HomeScreen() {
  const [topPlayers, topPlayersLoading] = useQuery(topPlayersQuery());

  if (!topPlayers || topPlayersLoading) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <ScrollView>
      <BgImage>
        <HeaderLg />
        <ColorHeading title="Top Player" />
        <Player
          key={topPlayers[0].id}
          rank={1}
          name={topPlayers[0].player[0].fullName}
          points={Math.floor(topPlayers[0].average)}
        />
        <GrayHeading title="Ranked Players" />
        {topPlayers.slice(1).map((item, index) => (
          <Player
            key={item.id}
            rank={index + 2}
            name={item.player[0].fullName}
            points={Math.floor(item.average)}
          />
        ))}
      </BgImage>
    </ScrollView>
  );
}

export default (withNavigation(HomeScreen));
