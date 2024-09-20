import {z} from 'zod';
const reservedCategory = ['sports', 'entertainment', 'travel', 'fitness','food','general'] as const
export const communitySchemaValidation = z.object({
  communityName:z.string().min(8).max(12,{message:"maximum length can be 12 characters only"}),
  following:z.number().positive(),
  followers:z.number().positive(),
  category: z.enum(reservedCategory, {
    message: "dude! you can't choose out of these categories",
  })
});