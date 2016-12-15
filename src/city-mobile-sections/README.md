
### Create table
```sql
-- object: public.phone | type: TABLE --
-- DROP TABLE IF EXISTS public.phone CASCADE;
CREATE TABLE public.phone(
	id integer NOT NULL,
	phone character varying(7),
	province character varying(4),
	city character varying(8),
	isp char(5),
	code character varying(4),
	zip char(6),
	CONSTRAINT phone_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.phone OWNER TO postgres;
-- ddl-end --
```

### Load data
```sql
copy phone(id,phone,province,city,isp,code,zip) from '~/soft/2016phonelocation2.txt' DELIMITER ',' CSV;
```