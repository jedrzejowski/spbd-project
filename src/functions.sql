create or replace function make_name_with_boundaries(name text, way geometry) returns text
    language sql
as
$$
select concat(name, ', ', (
    select array_to_string(unique_names.name, ', ') as name
        from (
            select array_agg(distinct boundary_names.name) as "name"
                from (select boundaries.name
                          from planet_osm_polygon boundaries
                          where boundaries.boundary = 'administrative' and
                              boundaries.name notnull and
                              st_contains(
                                      boundaries.way,
                                      $2
                                  )
                          order by boundaries.admin_level desc
                ) boundary_names
        ) unique_names)
    )
$$;