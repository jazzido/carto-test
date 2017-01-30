import 'isomorphic-fetch';
import formurlencoded from 'form-urlencoded';

const BASE_URL = 'https://rambo-test.carto.com:443/api/v2/sql';
const TABLE_NAME = 'public.mnmappluto';
const RE_DECIMAL = /-?\d+\.?\d+/g

function q(query) {
    return fetch(`${BASE_URL}?${formurlencoded({q: query})}`)
        .then(res => res.json())
}

export function getBreaks(variable, breaks=7) {
    const sql = `select unnest(CDB_JenksBins(array_agg(distinct((${variable}::numeric))), ${breaks})) as bucket from (select * from public.mnmappluto) _table`;
    return q(sql)
        .then(json => json.rows.map(r => r.bucket));
}

export function getTransformedGeometries(variable, num_breaks=5, width=800, height=800) {
    const sql = `
      WITH env AS
        ( SELECT st_xmin(st_extent(the_geom_webmercator)) AS off_x,
                 st_ymin(st_extent(the_geom_webmercator)) AS off_y,
                 (st_xmax(st_extent(the_geom_webmercator)) - st_xmin(st_extent(the_geom_webmercator))) AS width,
                 (st_ymax(st_extent(the_geom_webmercator)) - st_ymin(st_extent(the_geom_webmercator))) AS height
         FROM ${TABLE_NAME}),
           transformed AS
        ( SELECT cartodb_id,
                 st_simplify(st_scale(st_translate(the_geom_webmercator, -env.off_x, -env.off_y), ${width} / width, -${height} / height), 0.2) AS geom,
                 ${variable} as variable
         FROM ${TABLE_NAME},
              env),
           breaks AS
                   (SELECT row_number() over (ORDER BY bucket nulls LAST) AS bucket_number,
                           bucket
                    FROM
                      (SELECT unnest(CDB_JenksBins(array_agg(distinct((${variable}::numeric))), ${num_breaks})) AS bucket
                       FROM
                         (SELECT ${variable}
                          FROM public.mnmappluto) AS q) AS t
                    )
      SELECT cartodb_id,
             st_assvg(geom),
             variable,
             min(coalesce(b.bucket_number, 5)) - 1 as bucket_number
      FROM transformed
      LEFT OUTER JOIN breaks b ON variable <= b.bucket
      WHERE st_area(geom) > 0.5
      GROUP by cartodb_id, geom, variable
    `;
    return q(sql)
        .then(json => json.rows);
}
