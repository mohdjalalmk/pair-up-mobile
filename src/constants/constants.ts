import { User } from "../store/userStore";

export const ALLOWED_EDIT_FIELDS: (keyof User)[] = [
  'age',
  'gender',
  'description',
  'skills',
  'firstName',
  'lastName',
];
