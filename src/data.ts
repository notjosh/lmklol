import { promises as fsp } from 'fs';
import got from 'got';
import Keyv from 'keyv';
import KeyvFile from 'keyv-file';
import { ExistData } from './exist/types';

import steam_html2json from './steam/steam-html2json';

export type Data = {
  exist: ExistData[];
  lastfm: any;
  steam: any;
  trakt: any;
};

const keyv = new Keyv({
  store: new KeyvFile({
    filename: `/tmp/keyv-file/store.json`, // the file path to store the data
    expiredCheckDelay: 24 * 3600 * 1000, // ms, check and remove expired data in each ms
    writeDelay: 100, // ms, batch write to disk in a specific duration, enhance write performance.
    encode: JSON.stringify, // serialize function
    decode: JSON.parse, // deserialize function
  }),
});

const http = got.extend({});

const data = async (): Promise<Data> => {
  let exist: ExistData[] = (await keyv.get('exist')) as any;
  if (exist == null) {
    try {
      // const existy = require('../samples/existio.json');
      const existy: ExistData[] = await http(
        'https://exist.io/api/1/users/$self/attributes/',
        {
          headers: {
            authorization: `Token ${process.env.EXIST_IO_TOKEN}`,
          },
        }
      ).json();

      await keyv.set('exist', existy, 1000 * 60); // 1 minute
      exist = existy;
    } catch (error) {
      console.error('error fetching exist:', error);
    }
  }

  let lastfm: any = (await keyv.get('lastfm')) as any;
  if (lastfm == null) {
    try {
      const lastfmy: any = await http(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&extended=1&user=${process.env.LASTFM_USERNAME}&api_key=${process.env.LASTFM_API_KEY}&format=json`
      ).json();
      // const lastfmy: any = require('../samples/lastfm.json');

      await keyv.set('lastfm', lastfmy, 1000 * 60); // 1 minute
      lastfm = lastfmy;
    } catch (error) {
      console.error('error fetching lastfm:', error);
    }
  }

  let trakt: any[] = (await keyv.get('trakt')) as any;
  if (trakt == null) {
    try {
      // const trakty: any[] = require('../samples/trakt.json');
      const trakty: any[] = await http(
        `https://api.trakt.tv/users/${process.env.TRAKT_USERNAME}/history`,
        {
          headers: {
            'trakt-api-version': '2',
            'trakt-api-key': process.env.TRAKT_API_KEY,
          },
        }
      ).json();

      await keyv.set('trakt', trakty, 1000 * 60); // 1 minute
      trakt = trakty;
    } catch (error) {
      console.error('error fetching trakt:', error);
    }
  }

  let steam: any = (await keyv.get('steamhtml')) as any;
  if (steam == null) {
    try {
      const { body: steamy } = await http(
        `https://steamcommunity.com/id/${process.env.STEAM_USERNAME}`,
        {
          // try to look like a browser, maybe
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:72.0) Gecko/20100101 Firefox/72.0',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-AU,en;q=0.5',
            DNT: '1',
            'Upgrade-Insecure-Requests': '1',
          },
        }
      );
      // const steamy: any = await fsp.readFile('../samples/steam.html', 'utf-8');

      const steamyjson = steam_html2json(steamy);

      await keyv.set('steamhtml', steamyjson, 1000 * 60); // 1 minute
      steam = steamyjson;
    } catch (error) {
      console.error('error fetching steam:', error);
    }
  }

  return {
    exist,
    lastfm,
    steam,
    trakt,
  };
};

export default data;
