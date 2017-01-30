# CARTO Test #1

This repository contains an implementation for Test #1 proposed by CARTO.

A live instance of the application is available at: [https://carto-test-xxtmozvrzn.now.sh](https://carto-test-xxtmozvrzn.now.sh). The source code of the running instance can be explored at [https://carto-test-xxtmozvrzn.now.sh/_src](https://carto-test-xxtmozvrzn.now.sh/_src)

![Screenshot](http://dump.jazzido.com/carto_shot.png)

## Why did I choose this test?

It poses a more challenging task than Test #2. Being a [longtime fan of PostgreSQL](https://twitter.com/search?l=&q=postgresql%20from%3Amanuelaristaran&src=typd) and PostGIS, this test allowed me to play with interesting SQL queries.

## Implementation

The application that I implemented consists of a simple map viewer for the [MapPLUTO](https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-pluto-mappluto.page) dataset as [stored in CARTO](https://rambo-test.carto.com/tables/mnmappluto/public). It shows a choropleth for some of the variables in the dataset, and allows the user to render the map with either SVG or HTML5 `<canvas>`.

I used [ZEIT](https://zeit.co)'s [next.js](https://github.com/zeit/next.js), a framework based on the well known [React](https://facebook.github.io/react/) library.

### Data loading

The core of the program is a SQL query used to obtain the geometries, along with its class for the selected variable, according to the result of a [Jenks Natural Breaks optimization](https://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization), as implemented by CARTO in the [`CDB_JenksBins`](https://github.com/CartoDB/cartodb-postgresql/wiki/CDB_JenksBins) function.

``` sql
WITH env AS
    (SELECT st_xmin(st_extent(the_geom_webmercator)) AS off_x,
             st_ymin(st_extent(the_geom_webmercator)) AS off_y,
             (st_xmax(st_extent(the_geom_webmercator)) - st_xmin(st_extent(the_geom_webmercator))) AS width,
             (st_ymax(st_extent(the_geom_webmercator)) - st_ymin(st_extent(the_geom_webmercator))) AS height
     FROM public.mnmappluto),

     transformed AS
     (SELECT cartodb_id,
             st_simplify(st_scale(st_translate(the_geom_webmercator, -env.off_x, -env.off_y), ${width} / width, -${height} / height), 0.2) AS geom,
             ${variable} as variable
     FROM public.mnmappluto, env),

     breaks AS
     (SELECT row_number() over (ORDER BY bucket nulls LAST) AS bucket_number,
             bucket
      FROM
      (SELECT unnest(CDB_JenksBins(array_agg(distinct((${variable}::numeric))), ${num_breaks})) AS bucket
       FROM (SELECT ${variable}
             FROM public.mnmappluto) AS q) AS t)

  SELECT cartodb_id,
         st_assvg(geom),
         variable,
         min(coalesce(b.bucket_number, 5)) - 1 as bucket_number
  FROM transformed
  LEFT OUTER JOIN breaks b ON variable <= b.bucket
  WHERE st_area(geom) > 0.5
  GROUP by cartodb_id, geom, variable
```

There are 3 Common Table Expressions (CTE) before the main query:

- `env`: obtains the bounding box of the area of interest, which will be used to transform the map coordinates onto screen coordinates.
- `transformed`: obtains a relation consisting of the ID of the geometry, the simplified and transformed geometry (according to the size of the display) and the variable to be mapped.
- `breaks`: obtains a table of bounds of the Jenks optimization.

The main query returns:

- The geometry id
- The geometry represented in [SVG Path](https://www.w3.org/TR/SVG/paths.html) syntax, using PostGIS's [`ST_AsSVG`](http://www.postgis.net/docs/ST_AsSVG.html)
- The variable of interest
- The variable's corresponding *class* in the Jenks optimization.

### Display

Using the same datasource, the application can display the map using either SVG or in an HTML5 Canvas element. For SVG, the *path* data is directly applied to the `d` attribute of `<path>` objects. In the case of the Canvas renderer, the application instantiates [`Path2D`](https://developer.mozilla.org/en-US/docs/Web/API/Path2D) objects which are in turn drawn onto the Canvas and colored according to the element's class.
