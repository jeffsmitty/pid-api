--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.15
-- Dumped by pg_dump version 9.6.15

-- Started on 2020-01-14 13:57:18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12387)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2126 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 185 (class 1259 OID 19078)
-- Name: pid; Type: TABLE; Schema: public; Owner: pid_owner
--

CREATE TABLE public.pid (
    created timestamp without time zone NOT NULL,
    pid uuid NOT NULL,
    title character varying(500) NOT NULL,
    createdby character varying(250) NOT NULL,
    modified timestamp without time zone NOT NULL,
    apiversion character varying(5) NOT NULL,
    url character varying(500),
    pidtype character varying(50) NOT NULL
);


ALTER TABLE public.pid OWNER TO pid_owner;

--
-- TOC entry 2001 (class 2606 OID 19085)
-- Name: pid pid_pkey; Type: CONSTRAINT; Schema: public; Owner: pid_owner
--

ALTER TABLE ONLY public.pid
    ADD CONSTRAINT pid_pkey PRIMARY KEY (pid);


--
-- TOC entry 2127 (class 0 OID 0)
-- Dependencies: 185
-- Name: TABLE pid; Type: ACL; Schema: public; Owner: pid_owner
--

GRANT ALL ON TABLE public.pid TO app_pid;


-- Completed on 2020-01-14 13:57:19

--
-- PostgreSQL database dump complete
--

