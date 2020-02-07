import html2points from '../steam-html2json';
import { promises as fsp } from 'fs';
import Path from 'path';

const FIXTURE_PATH = '../../../samples/steam.html';

describe('html2points', () => {
  it('processes a fixture file into points a-okay', async () => {
    const fixture = await fsp.readFile(
      Path.join(__dirname, FIXTURE_PATH),
      'utf-8'
    );

    const points = html2points(fixture);

    expect(points.response.games.length).toBe(3);

    expect(points.response.games[0]).toEqual({
      name: 'Not For Broadcast',
      appid: 1147550,
    });

    expect(points.response.games[1]).toEqual({
      name: 'ScourgeBringer',
      appid: 1037020,
    });

    expect(points.response.games[2]).toEqual({
      name: 'KUNAI',
      appid: 1001800,
    });
  });
});
