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

drop table if exists ways_cars;
create table ways_cars as
select *
from ways
where tag_id in (101, 103, 102, 117, 106, 107, 110, 100, 108, 124, 112, 115, 109, 125, 104, 105, 123)

drop table if exists ways_vertices_pgr_cars;
create table ways_vertices_pgr_cars as
select distinct on (vert.id) vert.*
from ways_vertices_pgr vert,
     ways_cars edge
where (edge.source = vert.id or edge.target = vert.id);

create or replace function spbd_find_pgr_vert_car(way_point geometry(Point, 4326)) returns bigint as
$$
select vert.id
from ways_vertices_pgr_cars vert
where the_geom && st_expand(way_point, 0.001)
order by ST_Distance(vert.the_geom, way_point)
limit 1;
$$ language sql;


drop table if exists planet_osm_typed;
create table planet_osm_typed as
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


