import {z} from 'zod';
export const userNameValidation = z
  .string()
  .min(3, 'name can’t be shorter than 3 characters')
  .max(10, 'name can’t be longer than 10 characters')
  .regex(/^[a-zA-Z0-9._-]+$/, 'Invalid characters in the username');

export const signupValidation = z.object({
  userName:userNameValidation,
  email:z.string().email({message:'please enter valid email'}),
  password:z.string().min(6,{message:'passwords must be 6 character long'})
})