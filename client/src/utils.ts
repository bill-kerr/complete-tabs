import qs from 'query-string';

export const parseQuery = (queryString: string) => qs.parse(queryString);
