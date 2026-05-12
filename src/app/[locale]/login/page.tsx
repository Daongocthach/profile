"use client";

import React, { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Mail, Lock, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch {
            setError("Email hoặc mật khẩu không chính xác.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

            <Link 
                href="/" 
                className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
            </Link>

            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Chào mừng trở lại</h1>
                    <p className="text-muted-foreground">Đăng nhập để quản lý Profile của bạn</p>
                </div>

                <div className="bg-card border p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                    type="email"
                                    placeholder="Email"
                                    className="pl-12 h-14 bg-muted/30 border-none rounded-2xl"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mật khẩu"
                                    className="pl-12 pr-12 h-14 bg-muted/30 border-none rounded-2xl"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-purple-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center font-medium animate-shake">{error}</p>
                        )}

                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-14 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-purple-500/20"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Đăng nhập"
                            )}
                        </Button>
                    </form>

                    <div className="flex items-center justify-between px-2 pt-2">
                        <button className="text-sm text-muted-foreground hover:text-purple-400 transition-colors font-medium">
                            Quên mật khẩu?
                        </button>
                        <Link 
                            href="/register" 
                            className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-bold"
                        >
                            Tạo tài khoản?
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs text-muted-foreground px-8">
                    Bằng cách đăng nhập, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
                </p>
            </div>
        </div>
    );
}
