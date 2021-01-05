export const READ = ['read'];
export const CREATE = ['create'];
export const UPDATE = ['update'];
export const READ_CREATE = [...READ, ...CREATE];
export const CREATE_UPDATE = [...CREATE, ...UPDATE];
export const ALL = [...READ, ...CREATE, ...UPDATE];

export const groups = {
  READ,
  CREATE,
  UPDATE,
  READ_CREATE,
  ALL,
};
