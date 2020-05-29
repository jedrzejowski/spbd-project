alter table planet_osm_point
    add way_4326 geometry(Point, 4326);

update planet_osm_point
set way_4326 = st_transform(way, 4326);

alter table planet_osm_polygon
    add way_4326 geometry(Geometry, 4326);

update planet_osm_polygon
set way_4326 = st_transform(way, 4326);

alter table planet_osm_line
    add way_4326 geometry(LineString, 4326);

update planet_osm_line
set way_4326 = st_transform(way, 4326);

---

drop materialized view if exists ways_cars;

create materialized view ways_cars as
select *
from ways
where tag_id in (101, 103, 102, 117, 106, 107, 110, 100, 108, 124, 112, 115, 109, 125, 104, 105, 123);

refresh materialized view ways_cars;

---

drop materialized view if exists ways_vertices_pgr_cars;

create materialized view ways_vertices_pgr_cars as
select distinct on (vert.id) vert.*
from ways_vertices_pgr vert,
     ways_cars edge
where (edge.source = vert.id or edge.target = vert.id);

refresh materialized view ways_vertices_pgr_cars;

---

create or replace function spbd_find_pgr_vert_car(way_point geometry(Point, 4326)) returns bigint as
$$
select vert.id
from ways_vertices_pgr_cars vert
where the_geom && st_expand(way_point, 0.001)
order by ST_Distance(vert.the_geom, way_point)
limit 1;
$$ language sql;

---

-- https://stackoverflow.com/questions/8137112/unnest-array-by-one-level
create or replace function spbd_unnest_2d_table(bigint[][])
    returns table
            (
                "first"  bigint,
                "second" bigint
            )
as
$$
select q.a[1] as "first", q.a[2] as "second"
from (select array_agg($1[d1][d2]) as "a"
      from generate_subscripts($1, 1) d1
         , generate_subscripts($1, 2) d2
      group by d1
      order by d1
     ) q;

$$ language sql immutable;

---

drop view if exists planet_osm_typed;

create materialized view planet_osm_typed as
select p.osm_id,
       'tree'     as "type",
       p.way_4326 as "way",
       p.name     as "name"
--        spbd_find_pgr_vert_car(p.way_4326) as "nearest_car_vert_id"
from planet_osm_point p
where p.natural = 'tree'
union
select p.osm_id,
       'hotel'  as "type",
       way_4326 as "way",
       p.name   as "name"
--        spbd_find_pgr_vert_car(p.way_4326) as "nearest_car_vert_id"
from planet_osm_point p
where p.tourism = 'hotel'
-- union
-- select p.osm_id,
--        'building'                    as "type",
--        way_4326                      as "way",
--        p.name                        as "name",
--        spbd_find_pgr_vert_car(p.way_4326) as "nearest_car_vert_id"
-- from planet_osm_polygon p
-- where p.building notnull
;

refresh materialized view planet_osm_typed;
