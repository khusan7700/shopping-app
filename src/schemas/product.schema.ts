import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "상품명은 2자 이상 입력해주세요")
    .max(50, "상품명은 50자 이하로 입력해주세요"),

  // valueAsNumber: true (RHF) 로 string→number 변환 → z.number() 직접 사용
  price: z
    .number({ error: "가격을 입력해주세요" })
    .int("가격은 정수로 입력해주세요")
    .positive("가격은 0보다 커야 합니다"),

  stock: z
    .number({ error: "재고를 입력해주세요" })
    .int("재고는 정수로 입력해주세요")
    .min(0, "재고는 0 이상이어야 합니다"),

  category: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
