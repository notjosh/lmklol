import dotenv from 'dotenv';
dotenv.config();

import numeral from 'numeral';
import { DateTime } from 'luxon';
import humanizeDuration from 'humanize-duration';
import fetchdata from './data';

import existPointForDate from './exist/exist-point-for-date';

const lmklol = async () => {
  const data = await fetchdata();

  const points: any = {};

  // --- collect data

  // time
  const timezone = 'Australia/Melbourne';
  const now = DateTime.local().setZone(timezone);

  points.time = now.toFormat('h:mma').toLowerCase();

  const today = now.toISODate();
  const yesterday = now.minus({ days: 1 }).toISODate();

  points.today = today;
  points.yesterday = yesterday;

  // location
  // points.location_name = existPointForDate(data.exist, 'location_name', today);
  points.location_name = 'Melbourne'; // yolo

  // weather
  points.weather_temp_max = existPointForDate(
    data.exist,
    'weather_temp_max',
    today
  );
  points.weather_temp_min = existPointForDate(
    data.exist,
    'weather_temp_min',
    today
  );

  // weather: clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night
  points.weather_icon = existPointForDate(data.exist, 'weather_icon', today);

  // productvity
  points.distracting_min = existPointForDate(
    data.exist,
    'distracting_min',
    yesterday
  );
  points.neutral_min = existPointForDate(data.exist, 'neutral_min', yesterday);
  points.productive_min = existPointForDate(
    data.exist,
    'productive_min',
    yesterday
  );

  // steps
  points.steps = existPointForDate(data.exist, 'steps', yesterday);

  // sleep
  points.sleep = existPointForDate(data.exist, 'sleep', today);

  // song
  if (data.lastfm != null) {
    if (
      data.lastfm.recenttracks != null &&
      data.lastfm.recenttracks.track != null &&
      data.lastfm.recenttracks.track.length > 0
    ) {
      const track = data.lastfm.recenttracks.track[0];

      if (track != null) {
        points.song = {
          name: track.name,
          url: track.url,
        };

        if (track.artist != null) {
          points.song.artist = {
            name: track.artist.name,
            url: track.artist.url,
          };
        }
      }
    }
  }

  // watched
  if (data.trakt != null && data.trakt.length > 0) {
    const watchable = data.trakt[0];

    let title: string | null = null;
    let url: string | null = null;

    const traktor = (slug: string | undefined): string | null => {
      if (slug == null) {
        return null;
      }

      return `https://trakt.tv/shows/${slug}`;
    };

    if (watchable.show != null) {
      title = watchable.show.title;

      if (watchable.show.ids != null) {
        url = traktor(watchable.show.ids.slug);
      }
    }

    if (watchable.movie != null) {
      title = watchable.movie.title;

      if (watchable.show.ids != null) {
        url = traktor(watchable.movie.ids.slug);
      }
    }

    if (title != null && url != null) {
      points.watched = {
        title,
        url,
      };
    }
  }

  // played
  if (
    data.steam != null &&
    data.steam.response != null &&
    data.steam.response.games != null &&
    data.steam.response.games.length > 0
  ) {
    const game = data.steam.response.games[0];

    if (game != null) {
      points.steam_game_name = game.name;
      points.steam_game_appid = game.appid;
    }
  }

  // --- transform

  // weather
  const weathers: any = {
    'clear-day': 'clear',
    'clear-night': 'clear',
    rain: 'raining',
    'snow,': 'snowing',
    'sleet,': 'NOT IDEAL',
    'wind,': 'windy',
    'fog,': 'foggy',
    'cloudy,': 'cloudy',
    'partly-cloudy-day': 'partly cloudy',
    'partly-cloudy-nigh': 'partly cloudy',
  };

  points.weather = weathers[points.weather_icon] || null;

  // productivity

  if (points.productive_min != null) {
    const distracting_min = points.distracting_min || 0;
    const neutral_min = points.neutral_min || 0;
    const productive_min = points.productive_min || 0;

    const total = distracting_min + neutral_min + productive_min;

    if (total !== 0) {
      points.productivity = Math.round((productive_min / total) * 100);
    }
  }

  // sleep, number to words
  if (points.sleep) {
    const ms = points.sleep * 60 * 1000;

    points.sleep_in_words = humanizeDuration(ms, {
      conjunction: ' and ',
      round: true,
      serialComma: false,
    });
  }

  // steps, number format
  if (points.steps != null) {
    points.steps_formatted = numeral(points.steps).format('0,0');
  }

  // --- sentence construction

  let words = '';
  words += `it's <a style="cursor:default;" data-background="01lol.gif">${points.time}</a> `;
  if (points.location_name != null) {
    words += `here in <a target="_blank" data-background="04lol.gif" href="#">${points.location_name}</a>`;
  } else {
    words +=
      'probably in <a target="_blank" data-background="04lol.gif" href="#">melbourne</a>';
  }

  if (points.weather_temp_max != null && points.weather_temp_min != null) {
    words += `, which is <a target="_blank" data-background="02lol.gif" href="#">${points.weather_temp_min}°-${points.weather_temp_max}°`;

    if (points.weather != null) {
      words += ` and ${points.weather}`;
    }
  }
  words += '</a>. ';

  if (
    points.song != null ||
    points.watched != null ||
    (points.steam_game_name != null && points.steam_game_appid != null)
  ) {
    let lines: string[] = [];

    if (points.song != null) {
      let line = `the last song i listened to was <a target="_blank" data-background="05lol.gif" href="${points
        .song.url || 'https://www.last.fm/user/lemikizu'}">${
        points.song.name
      }</a>`;

      if (points.song.artist != null) {
        let link_pre = '';
        let link_post = '';

        if (points.song.artist.url != null) {
          link_pre = `<a target="_blank" data-background="14lol.gif" href="${points.song.artist.url}">`;
          link_post = '</a>';
        }
        line += ` by ${link_pre}${points.song.artist.name}${link_post}`;
      }

      lines.push(line);
    }

    if (points.watched != null) {
      lines.push(
        `the last thing i watched was <a target="_blank" data-background="14lol.gif" href="${points
          .watched.url || 'https://trakt.tv/users/lmk'}">${
          points.watched.title
        }</a>`
      );
    }

    if (points.steam_game_name != null && points.steam_game_appid != null) {
      lines.push(
        `the last game i played was <a target="_blank" data-background="14lol.gif" href="https://store.steampowered.com/app/${points.steam_game_appid}/">${points.steam_game_name}</a>`
      );
    }

    if (lines.length > 0) {
      // grab everything but the last line, to be joined by a comma
      const csvable = lines.slice(0, lines.length - 1);
      const last = lines.slice(-1);

      if (csvable.length > 0) {
        words += csvable.join(', ');
        words += ', and ';
      }

      words += `${last}. `;
    }
  }

  // todo
  // yesterday
  if (
    points.productivity != null ||
    points.steps_formatted != null ||
    points.sleep_in_words != null
  ) {
    words += 'yesterday ';

    if (points.productivity != null) {
      words += `i was <a style="cursor:default;" data-background="03lol.gif">${points.productivity}% productive</a>`;

      if (points.steps_formatted != null) {
        words += ' and ';
      }
    }

    if (points.steps_formatted != null) {
      words += `i took <a style="cursor:default;" data-background="06lol.gif">${points.steps_formatted} steps</a>`;

      if (points.sleep_in_words != null) {
        words += ' ';
      }
    }

    if (points.sleep_in_words != null) {
      if (points.steps_formatted == null && points.productivity == null) {
        words += 'i slept';
      } else {
        words += 'before sleeping';
      }

      words += ` for <a style="cursor:default;" data-background="07lol.gif">${points.sleep_in_words}</a>`;
    }

    words += '.';
  }

  words = words.trimEnd();

  const out = {
    points,
    html: words,
    text: words.replace(/<[^>]*>?/gm, ''),
  };

  return out;
};

const handler = async (event: any = {}): Promise<any> => {
  const body = await lmklol();
  return {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
  };
};

export { lmklol, handler };
