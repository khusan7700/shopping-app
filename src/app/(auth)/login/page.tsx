"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/auth.schema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    const result = await signIn("credentials", { ...data, redirect: false });
    if (result?.error)
      return alert("로그인 실패: 이메일 또는 비밀번호를 확인해주세요.");

    router.push("/");
    router.refresh();
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
          transition={{ delay: 0.15 }}
        >
          로그인
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            {...register("email")}
            type="email"
            placeholder="이메일"
            className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.28 }}
        >
          <input
            {...register("password")}
            type="password"
            placeholder="비밀번호"
            className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
          )}
        </motion.div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-[#160E4E] font-bold p-2 rounded hover:bg-white/90 transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.36 }}
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </motion.button>

        <motion.p
          className="text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.44 }}
        >
          계정이 없으신가요?{" "}
          <a href="/register" className="underline text-white">
            회원가입
          </a>
        </motion.p>
      </motion.form>
    </div>
  );
}
