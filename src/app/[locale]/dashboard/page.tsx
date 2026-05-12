"use client";

import React, { useState, useEffect } from "react";
import { auth, database } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { ref, onValue, update, get } from "firebase/database";
import { useRouter } from "@/i18n/routing";
import { 
    MessageSquare, 
    Clock, 
    User, 
    Mail, 
    Phone, 
    Loader2,
    Filter,
    ChevronDown,
    Reply,
    Trash2,
    Send,
    X,
    MessageCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { remove } from "firebase/database";
import { useTranslations } from "next-intl";

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
}

type MessageRecord = Omit<Message, "id">;
type UserRecord = {
    role?: string;
};

export default function DashboardPage() {
    const router = useRouter();
    const t = useTranslations("dashboard");
    const [isAdmin, setIsAdmin] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);

    // Reply State
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    // Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const fetchMessages = React.useCallback(() => {
        if (!database) return;
        const messagesRef = ref(database, 'messages');
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val() as Record<string, MessageRecord> | null;
            if (data) {
                const messageList: Message[] = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value,
                    status: value.status || 'pending'
                }));
                // Sort by newest first
                messageList.sort((a, b) => b.timestamp - a.timestamp);
                setMessages(messageList);
            } else {
                setMessages([]);
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser: FirebaseUser | null) => {
            if (currentUser) {
                // Check Admin Role
                if (database) {
                    const userRef = ref(database, `users/${currentUser.uid}`);
                    const snapshot = await get(userRef);
                    const userData = snapshot.val() as UserRecord | null;
                    if (snapshot.exists() && userData?.role === 'admin') {
                        setIsAdmin(true);
                        fetchMessages();
                    } else {
                        router.push("/");
                    }
                }
            } else {
                router.push("/login");
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, [fetchMessages, router]);

    const filteredMessages = messages.filter(msg => {
        const matchesSearch = 
            msg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.phone.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || msg.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const updateStatus = async (id: string, newStatus: string) => {
        if (!database) return;
        try {
            const messageRef = ref(database, `messages/${id}`);
            await update(messageRef, { status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!database || !window.confirm(t("deleteConfirm"))) return;
        try {
            const messageRef = ref(database, `messages/${id}`);
            await remove(messageRef);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const handleSendReply = async () => {
        if (!database || !replyingTo || !replyText.trim()) return;
        setIsSubmittingReply(true);
        try {
            const messageRef = ref(database, `messages/${replyingTo.id}`);
            await update(messageRef, { 
                adminResponse: replyText,
                respondedAt: Date.now(),
                status: 'resolved'
            });
            setReplyingTo(null);
            setReplyText("");
        } catch (error) {
            console.error("Error sending reply:", error);
        } finally {
            setIsSubmittingReply(false);
        }
    };

    const getStatusBadge = (status: string = 'pending') => {
        switch (status) {
            case 'resolved':
                return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/30">{t("statuses.resolved")}</Badge>;
            case 'contacted':
                return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border-blue-500/30">{t("statuses.contacted")}</Badge>;
            case 'read':
                return <Badge className="bg-purple-500/20 text-purple-500 hover:bg-purple-500/30 border-purple-500/30">{t("statuses.read")}</Badge>;
            default:
                return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border-yellow-500/30">{t("statuses.pending")}</Badge>;
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

    if (authLoading || (isAdmin && loading)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
                        <p className="text-muted-foreground">{t("subtitle")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-card border px-4 py-2 rounded-xl flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-purple-400" />
                            <span className="font-bold">{filteredMessages.length}</span>
                            <span className="text-sm text-muted-foreground">{t("showing")}</span>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="md:col-span-2 relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                            type="text"
                            placeholder={t("searchPlaceholder")}
                            className="w-full h-12 pl-12 pr-4 bg-card border rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <select 
                            className="w-full h-12 px-4 bg-card border rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">{t("allStatuses")}</option>
                            <option value="pending">{t("statuses.pending")}</option>
                            <option value="read">{t("statuses.read")}</option>
                            <option value="contacted">{t("statuses.contacted")}</option>
                            <option value="resolved">{t("statuses.resolved")}</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>

                {/* Main Content - Cleaned up borders */}
                <div className="bg-card/40 backdrop-blur-sm shadow-2xl relative rounded-[2.5rem] overflow-hidden border-none">
                    <div className="overflow-x-auto max-h-[70vh] pb-44 custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/50 bg-muted/40">
                                    <th className="px-6 py-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("userInfo")}</th>
                                    <th className="px-6 py-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("messageResponse")}</th>
                                    <th className="px-6 py-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("sentAt")}</th>
                                    <th className="px-6 py-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("status")}</th>
                                    <th className="px-6 py-6 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">{t("actions")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredMessages.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-3">
                                                <MessageSquare className="w-10 h-10 opacity-10" />
                                                <p className="text-lg font-medium opacity-50">
                                                    {messages.length === 0 ? t("noMessages") : t("noResults")}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMessages.map((msg) => (
                                        <tr key={msg.id} className="group hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="font-bold text-sm flex items-center gap-2">
                                                        <User className="w-3.5 h-3.5 text-purple-400" />
                                                        {msg.fullName}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-2">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        {msg.email}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-2">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        {msg.phone}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-3 max-w-md">
                                                    <p className="text-sm text-foreground/80 leading-relaxed italic">
                                                        &quot;{msg.message}&quot;
                                                    </p>
                                                    {msg.adminResponse && (
                                                        <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-3 space-y-1 animate-in fade-in slide-in-from-top-1">
                                                            <div className="flex items-center gap-2 text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                                                                <MessageCircle className="w-3 h-3" />
                                                                {t("adminResponse")}
                                                            </div>
                                                            <p className="text-xs text-foreground/90 leading-relaxed">
                                                                {msg.adminResponse}
                                                            </p>
                                                            {msg.respondedAt && (
                                                                <div className="text-[9px] text-muted-foreground text-right italic">
                                                                    {t("repliedAt")}: {formatDate(msg.respondedAt)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium flex items-center gap-2 text-muted-foreground">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {formatDate(msg.timestamp)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                {getStatusBadge(msg.status)}
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="relative group/menu">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="rounded-xl h-9 gap-2 border-border/50 hover:border-purple-500/50 bg-background/50"
                                                        >
                                                            {t("updateStatus")}
                                                            <ChevronDown className="w-4 h-4" />
                                                        </Button>
                                                        
                                                        <div className="absolute right-0 top-full mt-2 w-44 bg-card border rounded-2xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-50 overflow-hidden backdrop-blur-md">
                                                            {(['pending', 'read', 'contacted', 'resolved'] as const).map((s) => (
                                                                <button
                                                                    key={s}
                                                                    onClick={() => updateStatus(msg.id, s)}
                                                                    className={cn(
                                                                        "w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50",
                                                                        msg.status === s ? "text-purple-400 bg-purple-500/10" : "text-foreground"
                                                                    )}
                                                                >
                                                                    {t(`statuses.${s}`)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Button 
                                                        variant="outline" 
                                                        size="icon"
                                                        className="h-9 w-9 rounded-xl border-border/50 hover:border-blue-500/50 hover:text-blue-500 bg-background/50"
                                                        onClick={() => {
                                                            setReplyingTo(msg);
                                                            setReplyText(msg.adminResponse || "");
                                                        }}
                                                    >
                                                        <Reply className="w-4 h-4" />
                                                    </Button>

                                                    <Button 
                                                        variant="outline" 
                                                        size="icon"
                                                        className="h-9 w-9 rounded-xl border-border/50 hover:border-red-500/50 hover:text-red-500 bg-background/50"
                                                        onClick={() => handleDelete(msg.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Reply Modal Overlay */}
            {replyingTo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-card border w-full max-w-lg p-8 rounded-[2.5rem] shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Reply className="w-5 h-5 text-purple-400" />
                                {t("replyTo")} {replyingTo.fullName}
                            </h3>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setReplyingTo(null)}
                                className="rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-muted/30 border text-sm italic text-muted-foreground">
                                &quot;{replyingTo.message}&quot;
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">{t("yourResponse")}</label>
                                <Textarea 
                                    placeholder={t("typePlaceholder")}
                                    className="min-h-[150px] bg-muted/50 border-none rounded-2xl resize-none p-4"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button 
                                variant="outline" 
                                className="flex-1 h-12 rounded-xl font-bold"
                                onClick={() => setReplyingTo(null)}
                            >
                                {t("cancel")}
                            </Button>
                            <Button 
                                className="flex-[2] h-12 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white gap-2"
                                onClick={handleSendReply}
                                disabled={isSubmittingReply || !replyText.trim()}
                            >
                                {isSubmittingReply ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        {t("sendResponse")}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
