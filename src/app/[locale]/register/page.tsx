"use client";

import React, { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { auth, database } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { Mail, Lock, User, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // 1. Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update Profile (DisplayName)
            await updateProfile(user, { displayName: fullName });

            // 3. Set default role in Database
            if (database) {
                await set(ref(database, 'users/' + user.uid), {
                    fullName: fullName,
                    email: email,
                    role: 'customer', // Default role
                    createdAt: Date.now()
                });
            }

            router.push("/");
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof FirebaseError && err.code === 'auth/email-already-in-use') {
                setError("Email này đã được sử dụng.");
            } else {
                setError("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

            <Link 
                href="/login" 
                className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại Đăng nhập</span>
            </Link>

            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Tạo tài khoản</h1>
                    <p className="text-muted-foreground">Tham gia cùng chúng tôi ngay hôm nay</p>
                </div>

                <div className="bg-card border p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                    type="text"
                                    placeholder="Họ và Tên"
                                    className="pl-12 h-14 bg-muted/30 border-none rounded-2xl"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-blue-400 transition-colors"
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
                            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Đăng ký ngay"
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Đã có tài khoản?{" "}
                        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
