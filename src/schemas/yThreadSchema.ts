import {z} from 'zod';
export const yThreadSchemaValidation =
  z.object({
    title: z.string()
      .min(4, { message: 'title should be at least 4 characters long' })
      .max(30, { message: 'title cannot be greater than 30 characters' }),
    message: z.string()
      .min(6, { message: 'message must be at least 6 characters long' })
      .max(1000, { message: 'message cannot be greater than 1000 characters long' }),
    communityPost: z.string()
  }); 