"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/schemas/auth.schema";
import { register } from "@/actions/auth.actions"; // 회원가입을 처리하는 Server Action 임포트
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("name", data.name);

    const result = await register(formData); // Server Action 호출하면서 FormData 전달 -> 이렇게 전송된 FormData는 서버 액션의 register 함수의 formData 매개변수로 전달됨
    if (result?.error) return alert(result.error);

    alert("회원가입 완료! 로그인 페이지로 이동합니다.");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold">회원가입</h1>
        <div>
          <input
            {...formRegister("name")}
            placeholder="이름"
            className="w-full border p-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <input
            {...formRegister("email")}
            type="email"
            placeholder="이메일"
            className="w-full border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            {...formRegister("password")}
            type="password"
            placeholder="비밀번호"
            className="w-full border p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white p-2 rounded"
        >
          {isSubmitting ? "처리 중..." : "회원가입"}
        </button>
        <p className="text-center text-sm">
          이미 계정이 있으신가요?{" "}
          <a href="/login" className="underline">
            로그인
          </a>
        </p>
      </form>
    </div>
  );
}
