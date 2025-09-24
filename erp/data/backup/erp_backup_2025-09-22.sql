--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

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
-- Name: erp; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA erp;


ALTER SCHEMA erp OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: engineer_careers; Type: TABLE; Schema: erp; Owner: postgres
--

CREATE TABLE erp.engineer_careers (
    id bigint NOT NULL,
    engineer_id bigint,
    company text,
    start_date date,
    end_date date,
    recognition_date date,
    project_name text,
    client text,
    work_type text,
    method text,
    job_field text,
    specialty text,
    duty text,
    "position" text,
    report_type text,
    summary text,
    responsibility text,
    amount numeric(18,0),
    project_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE erp.engineer_careers OWNER TO postgres;

--
-- Name: engineer_careers_id_seq; Type: SEQUENCE; Schema: erp; Owner: postgres
--

CREATE SEQUENCE erp.engineer_careers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE erp.engineer_careers_id_seq OWNER TO postgres;

--
-- Name: engineer_careers_id_seq; Type: SEQUENCE OWNED BY; Schema: erp; Owner: postgres
--

ALTER SEQUENCE erp.engineer_careers_id_seq OWNED BY erp.engineer_careers.id;


--
-- Name: engineers; Type: TABLE; Schema: erp; Owner: postgres
--

CREATE TABLE erp.engineers (
    id bigint NOT NULL,
    engineer_code text,
    employee_no text NOT NULL,
    name text NOT NULL,
    birthdate date,
    join_date date,
    department text,
    mobile text,
    address text,
    retire_expected date,
    retire_date date,
    note text
);


ALTER TABLE erp.engineers OWNER TO postgres;

--
-- Name: engineers_id_seq; Type: SEQUENCE; Schema: erp; Owner: postgres
--

CREATE SEQUENCE erp.engineers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE erp.engineers_id_seq OWNER TO postgres;

--
-- Name: engineers_id_seq; Type: SEQUENCE OWNED BY; Schema: erp; Owner: postgres
--

ALTER SEQUENCE erp.engineers_id_seq OWNED BY erp.engineers.id;


--
-- Name: licenses; Type: TABLE; Schema: erp; Owner: postgres
--

CREATE TABLE erp.licenses (
    license_id bigint NOT NULL,
    name text NOT NULL,
    law_kind text NOT NULL,
    law_ref_url text
);


ALTER TABLE erp.licenses OWNER TO postgres;

--
-- Name: licenses_license_id_seq; Type: SEQUENCE; Schema: erp; Owner: postgres
--

CREATE SEQUENCE erp.licenses_license_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE erp.licenses_license_id_seq OWNER TO postgres;

--
-- Name: licenses_license_id_seq; Type: SEQUENCE OWNED BY; Schema: erp; Owner: postgres
--

ALTER SEQUENCE erp.licenses_license_id_seq OWNED BY erp.licenses.license_id;


--
-- Name: project_parties; Type: TABLE; Schema: erp; Owner: postgres
--

CREATE TABLE erp.project_parties (
    id bigint NOT NULL,
    project_id text,
    role text NOT NULL,
    name text NOT NULL
);


ALTER TABLE erp.project_parties OWNER TO postgres;

--
-- Name: project_parties_id_seq; Type: SEQUENCE; Schema: erp; Owner: postgres
--

CREATE SEQUENCE erp.project_parties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE erp.project_parties_id_seq OWNER TO postgres;

--
-- Name: project_parties_id_seq; Type: SEQUENCE OWNED BY; Schema: erp; Owner: postgres
--

ALTER SEQUENCE erp.project_parties_id_seq OWNED BY erp.project_parties.id;


--
-- Name: projects; Type: TABLE; Schema: erp; Owner: postgres
--

CREATE TABLE erp.projects (
    project_id text NOT NULL,
    name text NOT NULL,
    status text,
    start_date date,
    end_date date,
    summary text,
    overview text,
    contract_type text,
    contract_no text,
    total_amount numeric(18,0),
    equity_amount numeric(18,0),
    equity_ratio numeric(5,2),
    contract_date date,
    due_date date,
    location text,
    pm_id bigint,
    note text
);


ALTER TABLE erp.projects OWNER TO postgres;

--
-- Name: engineer_careers_construction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.engineer_careers_construction (
    id integer NOT NULL,
    engineer_id integer NOT NULL,
    company_name text NOT NULL,
    project_name text NOT NULL,
    start_date date NOT NULL,
    end_date date,
    client text,
    amount numeric(18,2),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.engineer_careers_construction OWNER TO postgres;

--
-- Name: engineer_careers_construction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.engineer_careers_construction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.engineer_careers_construction_id_seq OWNER TO postgres;

--
-- Name: engineer_careers_construction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.engineer_careers_construction_id_seq OWNED BY public.engineer_careers_construction.id;


--
-- Name: engineer_careers_engineering; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.engineer_careers_engineering (
    id integer NOT NULL,
    engineer_id integer NOT NULL,
    company_name text NOT NULL,
    project_name text NOT NULL,
    start_date date NOT NULL,
    end_date date,
    client text,
    amount numeric(18,2),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.engineer_careers_engineering OWNER TO postgres;

--
-- Name: engineer_careers_engineering_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.engineer_careers_engineering_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.engineer_careers_engineering_id_seq OWNER TO postgres;

--
-- Name: engineer_careers_engineering_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.engineer_careers_engineering_id_seq OWNED BY public.engineer_careers_engineering.id;


--
-- Name: engineer_evidences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.engineer_evidences (
    id integer NOT NULL,
    engineer_id integer NOT NULL,
    section text NOT NULL,
    file_path text NOT NULL,
    uploaded_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.engineer_evidences OWNER TO postgres;

--
-- Name: engineer_evidences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.engineer_evidences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.engineer_evidences_id_seq OWNER TO postgres;

--
-- Name: engineer_evidences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.engineer_evidences_id_seq OWNED BY public.engineer_evidences.id;


--
-- Name: engineers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.engineers (
    id integer NOT NULL,
    name text NOT NULL,
    employee_no text,
    status text,
    joined_at date,
    retired_at date,
    CONSTRAINT engineers_status_check CHECK ((status = ANY (ARRAY['재직'::text, '퇴직'::text, '퇴사예정'::text])))
);


ALTER TABLE public.engineers OWNER TO postgres;

--
-- Name: engineers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.engineers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.engineers_id_seq OWNER TO postgres;

--
-- Name: engineers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.engineers_id_seq OWNED BY public.engineers.id;


--
-- Name: engineer_careers id; Type: DEFAULT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.engineer_careers ALTER COLUMN id SET DEFAULT nextval('erp.engineer_careers_id_seq'::regclass);


--
-- Name: engineers id; Type: DEFAULT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.engineers ALTER COLUMN id SET DEFAULT nextval('erp.engineers_id_seq'::regclass);


--
-- Name: licenses license_id; Type: DEFAULT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.licenses ALTER COLUMN license_id SET DEFAULT nextval('erp.licenses_license_id_seq'::regclass);


--
-- Name: project_parties id; Type: DEFAULT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.project_parties ALTER COLUMN id SET DEFAULT nextval('erp.project_parties_id_seq'::regclass);


--
-- Name: engineer_careers_construction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engineer_careers_construction ALTER COLUMN id SET DEFAULT nextval('public.engineer_careers_construction_id_seq'::regclass);


--
-- Name: engineer_careers_engineering id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engineer_careers_engineering ALTER COLUMN id SET DEFAULT nextval('public.engineer_careers_engineering_id_seq'::regclass);


--
-- Name: engineer_evidences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engineer_evidences ALTER COLUMN id SET DEFAULT nextval('public.engineer_evidences_id_seq'::regclass);


--
-- Name: engineers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engineers ALTER COLUMN id SET DEFAULT nextval('public.engineers_id_seq'::regclass);


--
-- Data for Name: engineer_careers; Type: TABLE DATA; Schema: erp; Owner: postgres
--

COPY erp.engineer_careers (id, engineer_id, company, start_date, end_date, recognition_date, project_name, client, work_type, method, job_field, specialty, duty, "position", report_type, summary, responsibility, amount, project_id, created_at, updated_at) FROM stdin;
1	2	현소속사	2024-01-02	2024-12-31	\N	테스트 사업	발주처	\N	\N	\N	\N	\N	\N	\N	\N	\N	12345	\N	2025-09-19 16:26:06.882495+09	2025-09-19 16:26:06.882495+09
2	2	(주)거원	2005-07-17	2005-09-06	1900-02-19	온산덕산마을농로포장공사외6개소실시설계용역	울산광역시울주군청	\N	\N	토목	도로및공항	설계	주임	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
3	2	(주)거원	2005-09-07	2005-11-12	1900-03-06	염포동불무천하천정비공사실시설계용역	울산광역시북구청	\N	\N	토목	도로및공항	설계	주임	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
4	2	(주)거원	2005-11-13	2006-03-28	1900-05-14	군도,농어촌도로재정비및선형개량조사용역	울산광역시울주군청	\N	\N	토목	도로및공항	설계	주임	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
5	2	(주)거원	2006-03-29	2006-07-26	1900-04-01	동서오거리~야음주공간도로확장(주1-82호선)공사실시설계용역	울산광역시종합건설본부	\N	\N	토목	도로및공항	설계	주임	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
6	2	(주)거원	2006-06-06	2007-06-05	1900-08-05	울산광역시도시관리계획(학교:대학)결정용역	울산광역시	\N	\N	토목	도로및공항	설계	대리	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
7	2	(주)거원	2006-07-18	2006-09-21	1900-01-29	원지마을농로정비공사외3개소조사측량및세부설계용역	울산광역시북구	도로	\N	토목	도로및공항	설계	주임	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
8	2	(주)거원	2007-01-18	2007-02-22	1900-01-12	온산농어촌도로201호(종강선)개설공사실시설계용역	울산광역시울주군	도로	\N	토목	도로및공항	설계	대리	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
9	2	(주)거원	2007-02-08	2007-09-10	1900-03-26	상북농어촌도로309호도로및등산로정비공사실시설계용역	울산광역시울주군	도로	\N	토목	도로및공항	설계	대리	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
10	2	(주)거원	2007-02-14	2009-12-19	1901-05-17	일산진주거환경개선사업정비계획수립및정비구역지정용역	울산광역시동구	\N	\N	토목	도로및공항	설계	과장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
11	2	(주)거원	2008-01-20	2008-03-22	1900-01-22	온양대운산등산로정비사업실시설계용역	울산광역시울주군	도로	\N	토목	도로및공항	설계	대리	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
12	2	(주)거원	2008-02-21	2008-04-27	1900-01-18	온양운화16-1번지일원(소2-41 43 47호)도로개설공사실시설계용역	울산광역시울주군	도로	\N	토목	도로및공항	설계	대리	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
13	2	(주)거원	2008-03-04	2008-12-29	1900-04-16	길천일반산업단지(2차)조성사업기본설계및실시설계용역	울산광역시	단지조성	\N	토목	도로및공항	설계	대리	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
14	2	(주)거원	2008-07-20	2008-10-21	1900-01-25	언양어음도시계획도로(소2-1,6,9호)개설공사실시설계용역	울산광역시울주군	도로	\N	토목	도로및공항	설계	대리	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
15	2	(주)거원	2008-09-03	2009-12-13	1900-07-09	남목~방어진수질개선사업소(대2-19호선)도로개설기본및실시설계용역	울산광역시종합건설본부	도로	\N	토목	도로및공항	설계	과장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
16	2	(주)거원	2009-08-31	2010-01-23	1900-03-12	범서구영리일원도시관리계획(도로)결정용역	울산광역시울주군	\N	\N	토목	도로및공항	설계	과장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
17	2	(주)거원	2010-01-24	2010-04-20	1900-03-26	범서사연리(사일마을)도시관리계획(도로)결정용역	울산광역시울주군	\N	\N	토목	도로및공항	설계	과장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
18	2	(주)거원	2010-04-21	2010-04-29	1900-01-07	지구단위계획정비용역	울산광역시	\N	\N	토목	도로및공항	설계	과장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
19	2	(주)제원엔지니어링	2010-04-30	2011-10-27	1901-05-25	영어교육도시조성사업조사설계용역	제주국제자유도시개발센터	\N	\N	토목	도로및공항	설계	과장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
20	2	(주)제원엔지니어링	2011-08-22	2011-11-19	1900-02-23	시도(오일시장주변도로)정비사업실시설계용역	제주특별자치도제주시	\N	\N	토목	도로및공항	설계	과장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
21	2	(주)제원엔지니어링	2011-11-20	2012-01-31	1900-03-12	대정하수처리장증설및남제주서부하수관거정비사업기본및실시설계용역	제주특별자치도수자원본부	\N	\N	토목	도로및공항	설계	과장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
22	2	(주)제원엔지니어링	2012-02-01	2012-11-21	1900-08-20	상외선농어촌도로정비사업실시설계용역	제주특별자치도제주시청	도로	\N	토목	도로및공항	설계	과장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
23	2	(주)제원엔지니어링	2012-04-01	2012-04-30	1900-01-11	원노형로도로구조개선공사실시설계용역	제주특별자치도서귀포시	\N	\N	토목	도로및공항	설계	과장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
24	2	(주)제원엔지니어링	2012-04-22	2012-06-21	1900-01-20	토산1리~2리위험도로구조개선사업실시설계용역	제주특별자치도서귀포시	\N	\N	토목	도로및공항	설계	과장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
25	2	(주)제원엔지니어링	2012-05-16	2012-07-14	1900-01-21	장수원~무릉2위험도로구조개선사업실시설계용역	제주특별자치도서귀포시	\N	\N	토목	도로및공항	설계	과장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
26	2	(주)제원엔지니어링	2012-11-22	2012-12-30	1900-02-06	산방산절개지우회도로기본계획및타당성조사용역	제주특별자치도서귀포시청	도로	\N	토목	도로및공항	설계	과장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
27	2	(주)태신엔지니어링	2013-01-31	2013-03-20	1900-02-15	2013년 녹색복지공간 조성사업 설계용역	서귀포시	\N	\N	토목	도로및공항	설계	차장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
28	2	(주)태신엔지니어링	2013-03-20	2013-04-18	1900-01-21	평대리 용천수 자연환경보전 이용시설 정비사업 실시설계용역	제주시	\N	\N	토목	도로및공항	설계	차장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
29	2	(주)태신엔지니어링	2013-04-07	2013-06-29	1900-03-17	우도 문화마을 조성사업 시설공사 실시설계용역	제주시	도로	\N	토목	도로및공항	설계	차장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
30	2	(주)태신엔지니어링	2013-06-30	2013-09-19	1900-02-19	법환해안도로(신성리조트~법환포구)일부개선공사	서귀포시	도로	\N	토목	도로및공항	설계	차장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
31	2	(주)태신엔지니어링	2013-07-22	2013-12-18	1900-04-28	병문천 지류1 소하천정비사업 실시설계용역	제주시	도로	\N	토목	도로및공항	설계	차장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
32	2	(주)태신엔지니어링	2013-12-19	2014-01-30	1900-02-10	제주특별자치도 보행안전 및 편의증진 기본계획수립용역	제주특별자치도	도로	\N	토목	도로및공항	설계	차장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
33	2	(주)웹솔루스제주	2014-01-31	2014-12-30	1900-10-26	재해위험개선지구(무릉2지구)정비사업기본및실시설계용역	(주)도암엔지니어링	\N	\N	토목	도로및공항	설계	부장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
34	2	(주)웹솔루스제주	2014-10-16	2014-12-04	1900-01-23	재해예방도로및배수로정비공사실시설계용역	제주특별자치도제주시	\N	\N	토목	도로및공항	설계	부장	발주청	신제주일원도로및배수로정비공사,평대리마을안길,제대마을외2개소선흘리외1개소도로및배수로,김녕리도로개설공사,용담3동도로정비공사	참여기술인	6	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
35	2	(주)웹솔루스제주	2014-12-16	2015-02-13	1900-02-18	한라산국립공원식수원보수실시설계용역	한라산국립공원관리사무소	\N	\N	토목	도로및공항	설계	부장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
36	2	(주)웹솔루스제주	2015-02-11	2015-04-01	1900-01-28	송천수해상습지개선공사실시설계용역	서귀포시청	\N	\N	토목	도로및공항	설계	부장	회사	\N	참여기술인	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
37	2	(주)웹솔루스제주	2015-02-24	2015-12-09	1900-07-26	서귀포시시군도및농어촌도로정비기본계획수립용역	서귀포시청	\N	\N	토목	도로및공항	조사	부장	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
38	2	(주)웹솔루스제주	2015-09-03	2015-12-09	1900-02-04	대정도시계획도로정비공사실시설계용역	서귀포시청	\N	\N	토목	도로및공항	설계	부장	회사	\N	참여기술인	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
39	2	(주)웹솔루스제주	2015-09-20	2015-11-28	1900-01-21	전통포구중심의어촌특화사업세부설계용역	한국농어촌공사 제주지역본부	관광휴게시설	\N	토목	도로및공항	설계	부장	발주청	O 과업범위 : 전통포구 및 원담복원, 포구내부 정비, 도대불 및 불턱 조성해변체험시설, 포구테마경관 및 안내시설, 주변환경정비 등	*참여기술인	29	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
40	2	(주)웹솔루스제주	2016-06-30	2016-09-11	1900-02-04	예례휴양체육공원조성사업실시설계용역	서귀포시청	\N	\N	토목	도로및공항	설계	부장	회사	\N	참여기술인	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
41	2	(주)웹솔루스제주	2016-06-30	2016-11-17	1900-04-09	통물천소하천정비사업실시설계용역	서귀포시청	\N	\N	토목	도로및공항	설계	부장	회사	\N	참여기술인	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
42	2	(주)웹솔루스제주	2016-11-13	2016-12-12	1900-01-25	동홍도시계획도로(중로2-1-52호선)도로개설공사실시설계용역	서귀포시청	\N	\N	토목	도로및공항	설계	부장	회사	\N	참여기술인	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
43	2	(주)해오름엔지니어링	2016-12-31	2017-05-22	1900-03-22	판포리주차장조성공사실시설계용역	제주특별자치도제주시한경면	도로	\N	토목	도로및공항	설계	이사	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
44	2	(주)해오름엔지니어링	2017-02-01	2018-11-15	1901-03-20	한경면신창리하수관로정비사업실시설계용역	제주특별자치도상하수도본부	상하수도	\N	토목	도로및공항	설계	이사	회사	\N	참여기술인	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
45	2	(주)해오름엔지니어링	2017-04-30	2017-09-02	1900-02-25	서귀포예래대륜(호근)하수관로정비사업실시설계용역	제주특별자치도상하수도본부	상하수도	\N	토목	도로및공항	설계	이사	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
46	2	(주)해오름엔지니어링	2017-08-31	2018-01-14	1900-03-06	이도1동1696-9번지외33개소공영(공한지)주차장정비조성공사실시설계용역	제주특별자치도제주시	도로	\N	토목	도로및공항	설계	이사	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
47	2	(주)해오름엔지니어링	2018-01-09	2018-03-09	1900-01-27	2018년저지리주차환경개선사업실시설계용역	제주특별자치도제주시	도로	\N	토목	도로및공항	설계	이사	회사	\N	\N	0	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
48	2	(주)해오름엔지니어링	2019-08-25	2020-04-24	1900-05-30	연북로~영평하동(중로1-1-62)도로개설사업기본설계용역	제주특별자치도 제주시	도로	\N	토목	토목구조	설계	이사	발주청	도시계획도로 개설 L=2,100m, B=20m, 도시․군계획시설사업 실시계획인가에 따른 인가서 작성 및 협의	*참여기술인	128	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
49	2	(주)해오름엔지니어링	2019-10-24	2020-05-21	1900-04-27	하원도시계획도로(중로2-1-16호선)개설사업실시설계용역	제주특별자치도 서귀포시	도로	\N	토목	토목구조	설계	이사	발주청	하원(중로2-1-16호선) 도시계획도로 개설공사 L=1,293m, B=15m	*참여기술인	138	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
50	2	(주)해오름엔지니어링	2021-06-28	2021-12-24	1900-04-01	2021년소하천정비사업실시설계용역	제주특별자치도제주시	하천정비(지방)	\N	토목	도로및공항	설계	이사	발주청	하천정비L=2,276m,교량설치5개소	*참여기술인	140	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
51	2	(주)해오름엔지니어링	2021-07-05	2022-03-22	1900-06-21	2022년밭기반정비사업(동부지역)기본계획및세부설계용역	제주특별자치도제주시	밭기반정비사업	\N	토목	도로및공항	설계	이사	발주청	밭기반정비사업기본계획및세부설계1식	*사업책임기술인	173	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
52	2	(주)해오름엔지니어링	2022-04-14	2022-12-13	1900-08-29	2022년제주시주차장수급및안전관리실태조사용역	제주특별자치도제주시	조사	\N	토목	도로및공항	조사	이사	발주청	기본현황 및 교통현황 조사 분석	*참여기술인	167	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
53	2	(주)해오름엔지니어링	2022-12-13	2023-04-25	1900-05-11	추자올레 인도교 조성 해상지반조사용역	제주특별자치도제주시추자면	일반교량	\N	토목	토질·지질	조사	\N	설계등통보	해상지반조사 2공	*분야별책임기술인	183	\N	2025-09-19 16:27:16.971969+09	2025-09-19 16:27:16.971969+09
\.


--
-- Data for Name: engineers; Type: TABLE DATA; Schema: erp; Owner: postgres
--

COPY erp.engineers (id, engineer_code, employee_no, name, birthdate, join_date, department, mobile, address, retire_expected, retire_date, note) FROM stdin;
2	ENG_HOR001	HOR-001	권종진	1976-05-06	2001-01-17	토목부	9022	제주특별자치도 제주시 화삼로32, 201동 801호(화북이동 LH2단지)	\N	\N	\N
3	ENG_HOR002	HOR-002	김경식	1968-07-12	2001-01-17	측량부	9895	제주 제주시 조천읍 조천리2859-4번지	\N	\N	\N
4	ENG_HOR003	HOR-003	배진권	1978-06-04	2001-01-17	토목부	5151	제주 제주시 원남6길 55-1, 102동 402호	\N	\N	\N
5	ENG_HOR004	HOR-004	한지철	1972-03-29	2001-01-17	토목부	0485	제주특별자치도 제주시 원노형남1길 11, 1319호	\N	\N	\N
6	ENG_HOR005	HOR-005	김포진	1975-11-03	2003-01-17	토목부	3403	부산 중구 보수동1가 33-67번지 행복빌라101호	\N	2024-08-31	\N
7	ENG_HOR006	HOR-006	이창림	1982-06-19	2007-01-17	토목부	2949	제주 제주시 동한두기길 3(용담일동)	\N	\N	\N
8	ENG_HOR007	HOR-007	박윤식	1971-08-02	2001-01-18	토목부	9680	부산광역시 동래구 안남로9, 102동 109호(낙민동, 동래우성아파트)	\N	2023-12-31	\N
9	ENG_HOR008	HOR-008	이주홍	1979-06-26	2002-01-18	조경부	8026	부산 기장군 정관읍 정관5로 12 207동 201호	\N	\N	\N
10	ENG_HOR009	HOR-009	한복규	1944-03-09	2008-01-18	토목부	5001	경기 광명시 소하로 56, 광명소하 휴먼시아 3단지 아파트 306동 601호	\N	\N	\N
11	ENG_HOR010	HOR-010	이홍철	1972-06-29	2018-12-18	건설사업관리부	1176	제주특별자치도 제주시 태성로 2길 21	\N	\N	\N
12	ENG_HOR011	HOR-011	정명수	1980-03-02	2004-01-19	토목부	8577	부산광역시 북구 백양대로1050번길11-1	\N	\N	\N
13	ENG_HOR012	HOR-012	양원아	1978-02-15	2006-01-19	토목부	8867	부산광역시 기장군 정관읍 정관4로 24 동일스위트113-1604	\N	2025-06-30	\N
14	ENG_HOR013	HOR-013	김현수	1992-12-24	2007-08-19	토목부	8638	제주특별자치도 제주시 이도2동 438번지 혜성아파트108-101	\N	\N	\N
15	ENG_HOR014	HOR-014	박재홍	1965-03-07	2009-01-19	측량부	8669	제주특별자치도 제주시 제원2길 28 1층101호	\N	\N	\N
16	ENG_HOR015	HOR-015	강준혁	1989-09-18	2002-01-20	토목부	2095	서귀포시 표선면 표선리 627번지	\N	2022-10-14	\N
17	ENG_HOR016	HOR-016	강경훈	1990-06-05	2003-01-20	토목부	0851	서귀포시 1100로 36, 201동 203호(중문동,중문메리디안연립)	\N	\N	ㅛ
18	ENG_HOR017	HOR-017	황현기	1984-09-16	2002-01-21	토목부	2991	부산 남구 감만1동 유창그린아파트 108동 1505호	\N	\N	\N
19	ENG_HOR018	HOR-018	김도형	1979-09-02	2002-01-21	토목부	8684	제주특별자치도 제주시 애월읍 하광로 326, 101동 108호	\N	2025-08-31	\N
20	ENG_HOR019	HOR-019	최상묵	1978-01-03	2007-01-21	교통부	0302	경상북도 예천군 호명면 양지로 14, 220동 902호	\N	\N	\N
21	ENG_HOR020	HOR-020	김보영	1982-07-07	2007-06-21	관리부	2787	제주시 동문로 72 유피테르6차 406호	\N	\N	\N
22	ENG_HOR021	HOR-021	정승문	1972-02-06	2001-06-22	구조안전부	4106	제주특별자치도 제주시 신설로9길 12-4,201호(이도이동, 정현빌)	\N	\N	\N
23	ENG_HOR022	HOR-022	정재민	1977-04-02	2003-01-22	도시부	6956	부산광역시 해운대구 대천로67번길 41, 203동 302호	\N	2023-10-31	\N
24	ENG_HOR023	HOR-023	고윤재	1989-04-14	2005-01-22	토목부	1583	제주시 화삼로167, 310동 1002호	\N	2022-12-31	\N
25	ENG_HOR024	HOR-024	문석원	1993-05-26	2007-01-22	토목부	9058	제주시 일주서로 7845	\N	\N	\N
26	ENG_HOR025	HOR-025	김강민	1999-02-16	2008-01-22	토목부	4338	제주시 삼봉로 299-3, 103동 502호	\N	2024-06-30	\N
27	ENG_HOR026	HOR-026	김재진	1978-05-22	2009-07-22	관리부	7673	제주특별자치도 제주시 성신로 13-8,503호(연동이화1차아파트, 연동)	\N	\N	\N
28	ENG_HOR027	HOR-027	박의환	1963-07-11	2011-01-22	토목부	1625	경기도 남양주시 늘을 1로 39, C동 202호(평내동, 클래식파크빌)	\N	2023-08-21	\N
29	ENG_HOR028	HOR-028	고덕원	1997-08-20	2011-07-22	토목부	3392	제주특별자치도 제주시 수덕9길73, 1102호(노형동, 서부파크빌)	\N	2023-03-31	\N
30	ENG_HOR029	HOR-029	고승한	1990-02-06	2011-07-22	토목부	3739	제주특별자치도 제주시 귀아랑길 27, 3층(연동)	\N	2008-10-23	\N
31	ENG_HOR030	HOR-030	하동해	1982-03-24	2001-01-23	토목부	8068	서울특별시 양천구 목동서로 377, 에이동 601호(신정동, 이스타빌 3차)	\N	\N	\N
32	ENG_HOR031	HOR-031	정기윤	1995-04-09	2001-08-23	토목부	0432	제주시 아란서길 101-8,302호(아라일동, 태성리치빌C)	\N	2023-06-30	\N
33	ENG_HOR032	HOR-032	문상필	1962-12-22	2003-01-23	건축부	7850	제주시 가령골길 54(이도이동)	\N	\N	\N
34	ENG_HOR033	HOR-033	장종관	1956-04-25	2003-01-23	건축부	2558	제주시 외도1동 486-8 한라주택 A동 501호	\N	\N	\N
35	ENG_HOR034	HOR-034	현미주	1988-05-29	2003-01-23	건축부	8685	서울특별시 서초구 양재천로 113-6, 4층(양재동)	\N	\N	\N
36	ENG_HOR035	HOR-035	김세빈	1996-08-30	2003-01-23	토목부	6981	제주시 조천읍 신촉북3길 40	\N	2024-02-29	\N
37	ENG_HOR036	HOR-036	조우형	1956-06-22	2008-01-23	건설사업관리부	2695	제주시 아란1길 28-1, 603동 402호(아라일동, 방선문 6차빌리지)	\N	\N	\N
38	ENG_HOR037	HOR-037	장현서	1997-10-25	2023-08-23	토목부	4815	제주시 천수로 13길 19-5	\N	\N	\N
39	ENG_HOR038	HOR-038	박송	1983-06-10	2023-09-20	도시부	2557	경상남도 양산시 물금읍 범구로 28,302-501(양산신도시3차 동원로얄듀크비스타)	\N	2024-02-29	\N
40	ENG_HOR039	HOR-039	김상범	1960-09-13	2012-06-23	건설사업관리부	5627	제주특별자치도 제주시 노형10길3 (노형동)	\N	\N	\N
41	ENG_HOR040	HOR-040	배성환	1968-12-08	2023-12-21	건설사업관리부	8744	제주특별자치도 서귀포시 서호호근로 168-1,101동 401호(서호동, 광진주택)	\N	\N	\N
42	ENG_HOR041	HOR-041	정진석	1973-02-24	2001-01-24	토목부	0186	경기 군포시 산본천로 119-9 1103동 1411호(산본동, 주공11단지아파트)	\N	2024-06-30	\N
43	ENG_HOR042	HOR-042	황기훈	1978-02-24	2003-01-24	건설사업관리부	9654	제주특별자치도 서귀포시 안덕면 중산간서로 1615번길 251-18	\N	\N	\N
44	ENG_HOR043	HOR-043	박현명	1997-09-05	2005-01-24	구조안전부	3557	제주시 고마로13길41, 502호(일도이동, 성환사라봉아파트)	\N	\N	\N
45	ENG_HOR044	HOR-044	진형민	1996-02-21	2024-05-13	토목부	1630	제주특별자치도 제주시 동화로1길11, 101동 402호(화북일동, 화북1아파트)	\N	2025-08-31	\N
46	ENG_HOR045	HOR-045	송용식	1960-04-26	2007-01-24	토목부	0441	경기도 의왕시 백운중앙로 88,503동 402호(학의동, 의왕백운해링턴플레이스)	\N	2024-12-31	\N
47	ENG_HOR046	HOR-046	김영호	1960-10-27	2009-01-24	토목부	2596	강원도 인제군 인제읍 인제로 228번길 6, 102동 604호(내설악APT)	\N	\N	\N
48	ENG_HOR047	HOR-047	문영호	1963-08-08	2001-01-25	토목부	5623	제주시 아란9길 22 스위첸아파트 106동1004	\N	\N	\N
49	ENG_HOR048	HOR-048	김장렬	1940-05-21	2005-01-25	측량부	4478	제주시 노형로 66-4, 105동 501호(해안동, 해안 회성푸르니)	\N	\N	\N
50	ENG_HOR049	HOR-049	김상봉	1971-06-04	2025-05-19	도시부	5305	부산광역시 남구 유엔평화로47번길 101,601호(대연동, 대정빌라)	\N	\N	\N
51	ENG_HOR050	HOR-050	송원진	1999-06-14	2008-01-25	토목부	6934	제주시 동고산로 26	\N	\N	\N
52	ENG_HOR051	HOR-051	이창해	1960-03-05	2009-01-25	토목부	3608	서울특별시 마포구 토정로 167, 104동 1801호 (창전동,서강해모로)	\N	\N	\N
\.


--
-- Data for Name: licenses; Type: TABLE DATA; Schema: erp; Owner: postgres
--

COPY erp.licenses (license_id, name, law_kind, law_ref_url) FROM stdin;
\.


--
-- Data for Name: project_parties; Type: TABLE DATA; Schema: erp; Owner: postgres
--

COPY erp.project_parties (id, project_id, role, name) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: erp; Owner: postgres
--

COPY erp.projects (project_id, name, status, start_date, end_date, summary, overview, contract_type, contract_no, total_amount, equity_amount, equity_ratio, contract_date, due_date, location, pm_id, note) FROM stdin;
\.


--
-- Data for Name: engineer_careers_construction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.engineer_careers_construction (id, engineer_id, company_name, project_name, start_date, end_date, client, amount, created_at) FROM stdin;
\.


--
-- Data for Name: engineer_careers_engineering; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.engineer_careers_engineering (id, engineer_id, company_name, project_name, start_date, end_date, client, amount, created_at) FROM stdin;
3	1	해오름엔지니어링	제주항만개발	2022-01-01	2022-12-31	제주특별자치도	150000000.00	2025-09-22 08:46:03.652269
4	2	제원엔지니어링	서귀포 도로확장	2023-06-01	2024-05-31	제주특별자치도	200000000.00	2025-09-22 08:49:03.567482
\.


--
-- Data for Name: engineer_evidences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.engineer_evidences (id, engineer_id, section, file_path, uploaded_at) FROM stdin;
3	1	techcareer	/uploads/evidence/홍길동_경력증명서.pdf	2025-09-22 08:46:03.655473
4	2	techcareer	/uploads/evidence/김철수_경력증명서.pdf	2025-09-22 08:49:03.56791
8	2	techcareer	/Users/geenie./Desktop/Art/erp/data/uploads/홍길동_경력증명서.pdf.enc	2025-09-22 09:19:10.379497
\.


--
-- Data for Name: engineers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.engineers (id, name, employee_no, status, joined_at, retired_at) FROM stdin;
1	홍길동	E001	재직	2023-03-01	\N
2	김철수	E002	재직	2024-05-10	\N
\.


--
-- Name: engineer_careers_id_seq; Type: SEQUENCE SET; Schema: erp; Owner: postgres
--

SELECT pg_catalog.setval('erp.engineer_careers_id_seq', 53, true);


--
-- Name: engineers_id_seq; Type: SEQUENCE SET; Schema: erp; Owner: postgres
--

SELECT pg_catalog.setval('erp.engineers_id_seq', 52, true);


--
-- Name: licenses_license_id_seq; Type: SEQUENCE SET; Schema: erp; Owner: postgres
--

SELECT pg_catalog.setval('erp.licenses_license_id_seq', 1, false);


--
-- Name: project_parties_id_seq; Type: SEQUENCE SET; Schema: erp; Owner: postgres
--

SELECT pg_catalog.setval('erp.project_parties_id_seq', 1, false);


--
-- Name: engineer_careers_construction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.engineer_careers_construction_id_seq', 1, false);


--
-- Name: engineer_careers_engineering_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.engineer_careers_engineering_id_seq', 7, true);


--
-- Name: engineer_evidences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.engineer_evidences_id_seq', 8, true);


--
-- Name: engineers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.engineers_id_seq', 3, false);


--
-- Name: engineer_careers engineer_careers_pkey; Type: CONSTRAINT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.engineer_careers
    ADD CONSTRAINT engineer_careers_pkey PRIMARY KEY (id);


--
-- Name: engineers engineers_engineer_code_key; Type: CONSTRAINT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.engineers
    ADD CONSTRAINT engineers_engineer_code_key UNIQUE (engineer_code);


--
-- Name: engineers engineers_pkey; Type: CONSTRAINT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.engineers
    ADD CONSTRAINT engineers_pkey PRIMARY KEY (id);


--
-- Name: licenses licenses_pkey; Type: CONSTRAINT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.licenses
    ADD CONSTRAINT licenses_pkey PRIMARY KEY (license_id);


--
-- Name: project_parties project_parties_pkey; Type: CONSTRAINT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.project_parties
    ADD CONSTRAINT project_parties_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (project_id);


--
-- Name: engineers uq_engineers_engineer_code; Type: CONSTRAINT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.engineers
    ADD CONSTRAINT uq_engineers_engineer_code UNIQUE (engineer_code);


--
-- Name: engineer_careers_construction engineer_careers_construction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engineer_careers_construction
    ADD CONSTRAINT engineer_careers_construction_pkey PRIMARY KEY (id);


--
-- Name: engineer_careers_engineering engineer_careers_engineering_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engineer_careers_engineering
    ADD CONSTRAINT engineer_careers_engineering_pkey PRIMARY KEY (id);


--
-- Name: engineer_evidences engineer_evidences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engineer_evidences
    ADD CONSTRAINT engineer_evidences_pkey PRIMARY KEY (id);


--
-- Name: engineers engineers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engineers
    ADD CONSTRAINT engineers_pkey PRIMARY KEY (id);


--
-- Name: engineer_careers_engineering uniq_engineer_career; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engineer_careers_engineering
    ADD CONSTRAINT uniq_engineer_career UNIQUE (engineer_id, project_name, start_date);


--
-- Name: engineer_evidences uniq_engineer_evidence; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engineer_evidences
    ADD CONSTRAINT uniq_engineer_evidence UNIQUE (engineer_id, file_path);


--
-- Name: idx_careers_engineer; Type: INDEX; Schema: erp; Owner: postgres
--

CREATE INDEX idx_careers_engineer ON erp.engineer_careers USING btree (engineer_id);


--
-- Name: idx_careers_start; Type: INDEX; Schema: erp; Owner: postgres
--

CREATE INDEX idx_careers_start ON erp.engineer_careers USING btree (start_date);


--
-- Name: idx_engineer_careers_engineer_id; Type: INDEX; Schema: erp; Owner: postgres
--

CREATE INDEX idx_engineer_careers_engineer_id ON erp.engineer_careers USING btree (engineer_id);


--
-- Name: idx_engineers_emp; Type: INDEX; Schema: erp; Owner: postgres
--

CREATE INDEX idx_engineers_emp ON erp.engineers USING btree (employee_no);


--
-- Name: idx_engineers_name; Type: INDEX; Schema: erp; Owner: postgres
--

CREATE INDEX idx_engineers_name ON erp.engineers USING btree (name);


--
-- Name: idx_project_parties_proj; Type: INDEX; Schema: erp; Owner: postgres
--

CREATE INDEX idx_project_parties_proj ON erp.project_parties USING btree (project_id);


--
-- Name: idx_project_parties_role; Type: INDEX; Schema: erp; Owner: postgres
--

CREATE INDEX idx_project_parties_role ON erp.project_parties USING btree (role);


--
-- Name: idx_projects_name; Type: INDEX; Schema: erp; Owner: postgres
--

CREATE INDEX idx_projects_name ON erp.projects USING btree (name);


--
-- Name: idx_projects_status; Type: INDEX; Schema: erp; Owner: postgres
--

CREATE INDEX idx_projects_status ON erp.projects USING btree (status);


--
-- Name: idx_engineer_careers_engineering_engineer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_engineer_careers_engineering_engineer_id ON public.engineer_careers_engineering USING btree (engineer_id);


--
-- Name: idx_engineer_evidences_engineer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_engineer_evidences_engineer_id ON public.engineer_evidences USING btree (engineer_id);


--
-- Name: engineer_careers engineer_careers_engineer_id_fkey; Type: FK CONSTRAINT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.engineer_careers
    ADD CONSTRAINT engineer_careers_engineer_id_fkey FOREIGN KEY (engineer_id) REFERENCES erp.engineers(id) ON DELETE CASCADE;


--
-- Name: engineer_careers engineer_careers_project_id_fkey; Type: FK CONSTRAINT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.engineer_careers
    ADD CONSTRAINT engineer_careers_project_id_fkey FOREIGN KEY (project_id) REFERENCES erp.projects(project_id) ON DELETE SET NULL;


--
-- Name: project_parties project_parties_project_id_fkey; Type: FK CONSTRAINT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.project_parties
    ADD CONSTRAINT project_parties_project_id_fkey FOREIGN KEY (project_id) REFERENCES erp.projects(project_id) ON DELETE CASCADE;


--
-- Name: projects projects_pm_id_fkey; Type: FK CONSTRAINT; Schema: erp; Owner: postgres
--

ALTER TABLE ONLY erp.projects
    ADD CONSTRAINT projects_pm_id_fkey FOREIGN KEY (pm_id) REFERENCES erp.engineers(id);


--
-- Name: engineer_careers_engineering engineer_careers_engineering_engineer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engineer_careers_engineering
    ADD CONSTRAINT engineer_careers_engineering_engineer_id_fkey FOREIGN KEY (engineer_id) REFERENCES public.engineers(id) ON DELETE CASCADE;


--
-- Name: engineer_evidences engineer_evidences_engineer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engineer_evidences
    ADD CONSTRAINT engineer_evidences_engineer_id_fkey FOREIGN KEY (engineer_id) REFERENCES public.engineers(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

