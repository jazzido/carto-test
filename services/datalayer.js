import 'isomorphic-fetch';
import formurlencoded from 'form-urlencoded';

const BASE_URL = 'https://rambo-test.carto.com:443/api/v2/sql';
const TABLE_NAME = 'public.mnmappluto';
const RE_DECIMAL = /-?\d+\.?\d+/g

function q(query) {
    return `${BASE_URL}?${formurlencoded({q: query})}`;
}

export function getBreaks(variable, breaks=7) {
    const sql = `select unnest(CDB_JenksBins(array_agg(distinct((${variable}::numeric))), ${breaks})) as bucket from (select * from public.mnmappluto) _table`;
    return fetch(q(sql))
        .then(res => res.json())
        .then(json => json.rows.map(r => r.bucket));
}

export function getTransformedGeometries(variable, width=800, height=800) {
    const sql = `
      WITH env AS
        ( SELECT st_xmin(st_extent(the_geom)) AS off_x,
                 st_ymin(st_extent(the_geom)) AS off_y,
                 (st_xmax(st_extent(the_geom)) - st_xmin(st_extent(the_geom))) AS width,
                 (st_ymax(st_extent(the_geom)) - st_ymin(st_extent(the_geom))) AS height
         FROM public.mnmappluto),
           transformed AS
        ( SELECT cartodb_id,
                 ${variable} as variable,
                 st_simplify(st_scale(st_translate(the_geom, -env.off_x, -env.off_y), ${width} / width, -${height} / height), 0.2) AS geom
         FROM public.mnmappluto,
              env)
      SELECT cartodb_id,
             variable,
             st_assvg(geom)
      FROM transformed
      WHERE st_area(geom) > 1
    `;
    return fetch(q(sql))
        .then(res => res.json())
        .then(json => json.rows);
}
