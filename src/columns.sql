alter table planet_osm_point
    add way_4326 geometry(Point, 4326);

update planet_osm_point
set way_4326 = st_transform(way, 4326);

create view ways_cars as
select *
from ways
where tag_id in (101, 103, 102, 117, 106, 107, 110, 100, 108, 124, 112, 115, 109, 125, 104, 105, 123)

create view ways_vertices_pgr_cars as
select distinct on (vert.id) vert.*
from ways_vertices_pgr vert,
     ways_cars edge
where (edge.source = vert.id or edge.target = vert.id);