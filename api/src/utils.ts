import { v4 as uuidV4 } from 'uuid';

export const uuid = () => uuidV4();

export const unixTime = () => Math.round(new Date().getTime() / 1000);
