do
$$
    <<first_block>>
        declare
        earth_spheroid spheroid := 'SPHEROID["WGS 84",6378137,298.257223563]';
        my_vert        bigint;
        my_length_m    float8;
        my_cost_s      float8;
    begin
        drop table if exists my_points;
        drop table if exists my_vertices;

        create temp table my_points as
        select distinct p1.osm_id,
                        p1.way,
                        p1.way_4326
        from planet_osm_point p1,
             planet_osm_point p2
        where p1.tourism = $1
          and p2.natural = $2
          and ST_DistanceSpheroid('SRID=4326;POINT(20.9476681 52.2382989991)'::geometry,
                                  p1.way_4326, 'SPHEROID["WGS 84",6378137,298.257223563]') < 10000
          and ST_DistanceSpheroid(p1.way_4326, p2.way_4326, 'SPHEROID["WGS 84",6378137,298.257223563]') < 100
        order by p1.osm_id;

        create temp table my_paths as
        select point.osm_id as osm_id,
               (
                   select vert.id
                   from ways_vertices_pgr_cars vert
                   order by ST_DistanceSpheroid(
                                    vert.the_geom,
                                    point.way_4326,
                                    'SPHEROID["WGS 84",6378137,298.257223563]')
                   limit 1
               )::bigint    as end_vert_id,
               null::float8 as length_m,
               null::float8 as cost_s,
               null::json   as path_json
        from my_points point;

        for my_vert in select end_vert_id from my_paths
        loop
            create temp table my_path as
            select *
            from pgr_astar('select gid::int4 as id,
                       source::int4, target::int4,
                       cost_s::float8 as cost,
                       reverse_cost_s::float8 as reverse_cost,
                       x1, y1, x2, y2
                from ways_cars
                ', 21963, my_vert, true);

            if (select count(*) from my_path) > 0 then

                select sum(ways.length_m),
                       sum(ways.cost_s)
                into my_length_m,my_cost_s
                from my_path a
                         inner join ways on ways.gid = a.edge;

                update my_paths
                set length_m  = my_length_m,
                    cost_s    = my_cost_s,
                    path_json = (select array_to_json(array_agg(row_to_json(a))) from my_path a)
                where end_vert_id = my_vert;

            end if;
            drop table my_path;
        end loop;

        drop table if exists spbd_output;
        create table spbd_output as
        select * from my_paths;

        drop table my_points;
        drop table my_paths;
    end first_block
$$;