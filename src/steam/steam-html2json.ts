import cheerio from 'cheerio';

type SteamGame = {
  appid: number;
  name: string;
};

type SteamJson = {
  response: {
    games: SteamGame[];
  };
};

const html2points = (html: string): SteamJson => {
  const $ = cheerio.load(html);

  const games = $('.recent_game')
    .map(
      (idx, recentGame): SteamGame => {
        const href =
          $(recentGame)
            .find('.game_name a')
            .attr('href') || '0';
        const appid = parseInt(href.substr(href.lastIndexOf('/') + 1), 10);
        return {
          appid,
          name: $(recentGame)
            .find('.game_name')
            .text(),
        };
      }
    )
    .get()
    .filter(game => {
      return game.appid !== 0;
    });

  return {
    response: {
      games,
    },
  };
};

export default html2points;
