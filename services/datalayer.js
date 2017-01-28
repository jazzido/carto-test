import 'isomorphic-fetch';
import formurlencoded from 'form-urlencoded';

const BASE_URL = 'https://rambo-test.carto.com:443/api/v2/sql';
const TABLE_NAME = 'public.mnmappluto';
const RE_DECIMAL = /(-?\d+\.?\d+)/g

export function getExtent() {
    const sql = `SELECT ST_Extent(the_geom) from ${TABLE_NAME}`;
    console.log(`${BASE_URL}?sql=${formurlencoded({q: sql})}`);
    return fetch(`${BASE_URL}?sql=${formurlencoded({q: sql})}`)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            return RE_DECIMAL
                     .exec(json.rows[0].st_extent)
                     .map((m, i) => m);

        });
};
