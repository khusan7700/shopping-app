"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/schemas/auth.schema";
import { register } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const fieldVariant = {
  hidden: { opacity: 0, x: -16 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.35 },
  }),
};

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
    formData.append("phone", data.phone ?? "");

    const result = await register(formData);
    if (result?.error) return alert(result.error);

    alert("회원가입 완료! 로그인 페이지로 이동합니다.");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h1
          className="text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          회원가입
        </motion.h1>

        {(["name", "phone", "email", "password"] as const).map((field, i) => (
          <motion.div key={field} custom={i} variants={fieldVariant} initial="hidden" animate="show">
            <input
              {...formRegister(field)}
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              placeholder={
                field === "name" ? "이름" :
                field === "phone" ? "휴대폰 번호 (010-0000-0000)" :
                field === "email" ? "이메일" : "비밀번호"
              }
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            {errors[field] && (
              <p className="text-red-400 text-sm mt-1">{errors[field]?.message}</p>
            )}
          </motion.div>
        ))}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-[#160E4E] font-bold p-2 rounded hover:bg-white/90 transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
        >
          {isSubmitting ? "처리 중..." : "회원가입"}
        </motion.button>

        <motion.p
          className="text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          이미 계정이 있으신가요?{" "}
          <a href="/login" className="underline text-white">
            로그인
          </a>
        </motion.p>
      </motion.form>
    </div>
  );
}
