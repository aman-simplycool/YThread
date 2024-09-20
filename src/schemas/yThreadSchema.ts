import {z} from 'zod';
export const yThreadSchemaValidation = z.object({
  title:z.string()
  .min(4,{message:'title should be atleast 4 characters long'})
  .max(30,{message:'title can not be greater than 30 characters'}),
  communityPost: z.enum(["Yes", "No"], { 
    errorMap: () => ({ message: "Must be either 'Yes' or 'No'" }) 
  }),
  message:z.string()
  .min(6,{message:'message must be 6 characters long'})
  .max(1000,{message:'message can not be greater than 200 characters long'})
})