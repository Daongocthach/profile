"use client";

import React, { useState, useEffect } from "react";
import { auth, database } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue, remove, query, orderByChild, equalTo } from "firebase/database";
import { useRouter } from "@/i18n/routing";
import { 
    MessageSquare, 
    Clock, 
    Trash2,
    Loader2,
    MessageCircle,
    ArrowLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface Message {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    message: string;
    timestamp: number;
    status?: 'pending' | 'read' | 'contacted' | 'resolved';
    adminResponse?: string;
    respondedAt?: number;
    uid?: string;
}

export default function HistoryPage() {
    const router = useRouter();
    const t = useTranslations("history");
    const dt = useTranslations("dashboard");
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchUserMessages(currentUser.uid);
            } else {
                // If not logged in, wait a bit then redirect
                setLoading(false);
                router.push("/login");
            }
            setAuthLoading(false);
        });

        // Safety timeout: if loading takes > 5s, something is wrong
        const timer = setTimeout(() => {
            setLoading(false);
            setAuthLoading(false);
        }, 5000);

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    const fetchUserMessages = (uid: string) => {
        if (!database) {
            setLoading(false);
            return;
        }
        
        try {
            const messagesRef = ref(database, 'messages');
            // Use query to fetch only messages for this user
            const userMessagesQuery = query(
                messagesRef, 
                orderByChild('uid'), 
                equalTo(uid)
            );

            onValue(userMessagesQuery, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const messageList: Message[] = Object.entries(data)
                        .map(([key, value]: [string, any]) => ({
                            id: key,
                            ...value,
                        }))
                        .sort((a, b) => b.timestamp - a.timestamp);
                    setMessages(messageList);
                } else {
                    setMessages([]);
                }
                setLoading(false);
            }, (error) => {
                console.error("Firebase onValue error:", error);
                setLoading(false);
            });
        } catch (error) {
            console.error("fetchUserMessages error:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (msg: Message) => {
        if (msg.adminResponse) {
            alert(t("cannotDelete"));
            return;
        }

        if (!database || !window.confirm(dt("deleteConfirm"))) return;
        
        try {
            const messageRef = ref(database, `messages/${msg.id}`);
            await remove(messageRef);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const getStatusBadge = (status: string = 'pending') => {
        switch (status) {
            case 'resolved':
                return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/30">{dt("statuses.resolved")}</Badge>;
            case 'contacted':
                return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border-blue-500/30">{dt("statuses.contacted")}</Badge>;
            case 'read':
                return <Badge className="bg-purple-500/20 text-purple-500 hover:bg-purple-500/30 border-purple-500/30">{dt("statuses.read")}</Badge>;
            default:
                return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border-yellow-500/30">{dt("statuses.pending")}</Badge>;
        }
    };

    const formatDate = (timestamp: number) => {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(timestamp));
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Link href="/">
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-muted">
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
                        </div>
                        <p className="text-muted-foreground ml-11">{t("subtitle")}</p>
                    </div>
                    <div className="bg-card border px-4 py-2 rounded-xl flex items-center gap-2 h-fit">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        <span className="font-bold">{messages.length}</span>
                        <span className="text-sm text-muted-foreground">{dt("total")}</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-card/40 backdrop-blur-sm shadow-2xl relative rounded-[2.5rem] overflow-hidden border-none">
                    <div className="overflow-x-auto max-h-[70vh] pb-20 custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/50 bg-muted/40">
                                    <th className="px-6 py-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">{dt("sentAt")}</th>
                                    <th className="px-6 py-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">{dt("messageResponse")}</th>
                                    <th className="px-6 py-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">{dt("status")}</th>
                                    <th className="px-6 py-6 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">{dt("actions")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {messages.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-3">
                                                <MessageSquare className="w-10 h-10 opacity-10" />
                                                <p className="text-lg font-medium opacity-50">{t("noMessages")}</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    messages.map((msg) => (
                                        <tr key={msg.id} className="group hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatDate(msg.timestamp)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-3 max-w-2xl">
                                                    <p className="text-sm text-foreground/80 leading-relaxed italic">
                                                        "{msg.message}"
                                                    </p>
                                                    {msg.adminResponse && (
                                                        <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-3 space-y-1 animate-in fade-in slide-in-from-top-1">
                                                            <div className="flex items-center gap-2 text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                                                                <MessageCircle className="w-3 h-3" />
                                                                {dt("adminResponse")}
                                                            </div>
                                                            <p className="text-xs text-foreground/90 leading-relaxed">
                                                                {msg.adminResponse}
                                                            </p>
                                                            {msg.respondedAt && (
                                                                <div className="text-[9px] text-muted-foreground text-right italic">
                                                                    {dt("repliedAt")}: {formatDate(msg.respondedAt)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                {getStatusBadge(msg.status)}
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon"
                                                    className="h-9 w-9 rounded-xl border-border/50 hover:border-red-500/50 hover:text-red-500 bg-background/50 disabled:opacity-30"
                                                    onClick={() => handleDelete(msg)}
                                                    disabled={!!msg.adminResponse}
                                                    title={msg.adminResponse ? t("cannotDelete") : dt("actions")}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
