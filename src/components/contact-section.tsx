"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { database, auth } from "@/lib/firebase";
import { ref, push, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

export const ContactSection = () => {
    const t = useTranslations("contact");
    const router = useRouter();
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);
    
    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        message: ""
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setFormData(prev => ({
                    ...prev,
                    fullName: currentUser.displayName || "",
                    email: currentUser.email || ""
                }));
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const data = {
            ...formData,
            timestamp: Date.now(),
            status: "pending",
            uid: user?.uid || null,
        };
        
        try {
            if (!database) {
                alert("Firebase chưa được cấu hình.");
                return;
            }
            const messagesRef = ref(database, 'messages');
            const newMessageRef = push(messagesRef);
            await set(newMessageRef, data);

            setIsSuccessModalOpen(true);
            setFormData(prev => ({ ...prev, message: "" })); // Clear message only
        } catch (error) {
            console.error("Firebase error:", error);
            alert("Có lỗi xảy ra khi gửi dữ liệu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedLabel(label);
        setTimeout(() => setCopiedLabel(null), 2000);
    };

    return (
        <section id="contact" className="py-20 px-6 bg-background relative">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left side: Info */}
                    <div className="space-y-12">
                        <div className="flex items-center justify-between">
                            <h3 className="text-3xl font-bold">{t("getInTouch")}</h3>
                            {user && (
                                <Link href="/history">
                                    <Button variant="ghost" className="rounded-xl gap-2 h-10 text-purple-500 hover:bg-purple-500/10 hover:text-purple-400 group/btn">
                                        {t("viewHistory")}
                                        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                        
                        <div className="space-y-8">
                            {/* Email */}
                            <div 
                                className="flex items-start gap-5 cursor-pointer group"
                                onClick={() => handleCopy("thachdaongoc75@gmail.com", "email")}
                            >
                                <div className="p-4 rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="relative">
                                    <h4 className="font-bold text-lg flex items-center gap-2">
                                        {t("email")}
                                        {copiedLabel === "email" && (
                                            <span className="text-xs font-normal text-green-500 animate-in fade-in slide-in-from-left-1">Copied!</span>
                                        )}
                                    </h4>
                                    <p className="text-muted-foreground group-hover:text-foreground transition-colors">thachdaongoc75@gmail.com</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div 
                                className="flex items-start gap-5 cursor-pointer group"
                                onClick={() => handleCopy("0373060206", "phone")}
                            >
                                <div className="p-4 rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="relative">
                                    <h4 className="font-bold text-lg flex items-center gap-2">
                                        {t("phone")}
                                        {copiedLabel === "phone" && (
                                            <span className="text-xs font-normal text-green-500 animate-in fade-in slide-in-from-left-1">Copied!</span>
                                        )}
                                    </h4>
                                    <p className="text-muted-foreground group-hover:text-foreground transition-colors">0373060206</p>
                                </div>
                            </div>

                            {/* Location */}
                            <div 
                                className="flex items-start gap-5 cursor-pointer group"
                                onClick={() => handleCopy("Xuyen Moc, Ho Chi Minh City, Vietnam", "location")}
                            >
                                <div className="p-4 rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div className="relative">
                                    <h4 className="font-bold text-lg flex items-center gap-2">
                                        {t("location")}
                                        {copiedLabel === "location" && (
                                            <span className="text-xs font-normal text-green-500 animate-in fade-in slide-in-from-left-1">Copied!</span>
                                        )}
                                    </h4>
                                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                                        Xuyen Moc, Ho Chi Minh City, Vietnam
                                    </p>
                                </div>
                            </div>

                            {/* Working days */}
                            <div className="flex items-start gap-5">
                                <div className="p-4 rounded-full bg-blue-500/10 text-blue-500">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{t("workingDays")}</h4>
                                    <p className="text-muted-foreground">
                                        {t("mondayToSaturday")} &nbsp; {t("workingHours")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Form */}
                    <div className="bg-card p-8 md:p-10 rounded-[2rem] border shadow-lg">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <Input 
                                name="full-name"
                                placeholder={t("form.fullName")} 
                                className="bg-muted/50 border-none h-12 rounded-xl" 
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input 
                                    name="phone"
                                    placeholder={t("form.phoneNumber")} 
                                    className="bg-muted/50 border-none h-12 rounded-xl" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                                <Input 
                                    name="email"
                                    placeholder={t("form.yourEmail")} 
                                    className="bg-muted/50 border-none h-12 rounded-xl" 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <Textarea 
                                name="message"
                                placeholder={t("form.yourProblem")} 
                                className="bg-muted/50 border-none min-h-[150px] rounded-2xl resize-none" 
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                            <Button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 h-14 rounded-full text-lg font-bold transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? "Sending..." : t("form.submit")}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Success Modal Overlay */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-card border w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-white">{t("form.successTitle")}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {t("form.successMessage")}
                            </p>
                        </div>
                        <Button 
                            onClick={() => setIsSuccessModalOpen(false)}
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white h-12 rounded-xl font-bold transition-all"
                        >
                            OK
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
};
